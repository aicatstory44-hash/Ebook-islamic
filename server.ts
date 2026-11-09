import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI client with standard aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Text-to-Speech endpoint using gemini-3.8-flash-tts
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "Gemini API key is not configured" });
    }

    // Limit text chunk size for TTS to avoid timeout
    const snippet = text.slice(0, 1000);

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: snippet,
              speechMetadata: {
                style: "Calm, reverent, gentle Islamic narrator with clear pronunciation",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      return res.status(500).json({ error: "No audio generated from model" });
    }

    res.json({
      audioBase64,
      mimeType: "audio/wav",
    });
  } catch (error: any) {
    console.error("TTS generation error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to generate speech" });
  }
});

// Spiritual Guidance & Chapter Contemplation AI Endpoint
app.post("/api/gemini/guidance", async (req, res) => {
  try {
    const { question, chapterTitle, chapterContext, mode } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "Gemini API key is not configured" });
    }

    const systemInstruction = `آپ کتاب "اللہ کی طرف واپسی — دل سے رب تک: ایک روحانی سفر" کے مؤلفانہ اسلوب میں قارئین کے لیے ایک محبت بھرا، پرحکمت اور مستند اسلامی روحانی و علمی معاون ہیں۔
آپ کا کام قاری کو اللہ تعالیٰ کی رحمت، سچی توبہ، نماز کی پابندی، قرآن سے تعلق، اور اخلاقی پاکیزگی کی طرف انتہائی نرمی، شفقت اور محبت سے بلانا ہے۔
رہنمائی کے اصول:
1. ہمیشہ مستند قرآن اور صحیح احادیث کی روشنی میں جواب دیں۔
2. زبان خالص، شیریں، ادبی اور سادہ اردو ہو (کوئی غیر ضروری انگریزی الفاظ یا ہندی نہ ہو)۔
3. قاری کو کبھی بھی ناامید یا احساسِ جرم میں مبتلا نہ کریں، بلکہ اللہ کی بے پایاں رحمت اور مغفرت کا یقین دلائیں۔
4. جواب میں مختصر قرآنی آیت یا مسنون دعا عربی متن و اردو ترجمہ کے ساتھ ضرور شامل کریں۔
5. اگر قاری کسی پیچیدہ فقہی مسئلے کے بارے میں پوچھے تو نرمی سے جواب دینے کے بعد یہ بھی عرض کریں کہ قطعی فقہی فیصلے کے لیے مستند مفتیانِ کرام سے رجوع فرمائیں۔`;

    let userPrompt = `کتاب کا موضوع: اللہ کی طرف واپسی (مصنف: عبدالرشید زاہد)\n`;
    if (chapterTitle) {
      userPrompt += `زیرِ مطالعہ باب: ${chapterTitle}\n`;
    }
    if (chapterContext) {
      userPrompt += `باب کا تناظر: ${chapterContext.slice(0, 500)}\n`;
    }
    userPrompt += `\nقاری کا روحانی سوال یا الجھن: ${question}\n\nبراہِ کرم محبت، حکمت اور قرآنی و نبوی رہنمائی کے ساتھ دل کو تسلی دینے والا جامع جواب عنایت فرمائیں۔`;

    let response;

    // Mode handling based on user feature requirements:
    if (mode === "deep_reflection") {
      // Complex reasoning with gemini-4-argon and high thinking
      response = await ai.models.generateContent({
        model: "gemini-4-argon",
        contents: userPrompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
    } else if (mode === "scholar_search") {
      // Search Grounding with gemini-3.8-flash and googleSearch tool
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });
    } else {
      // General task using gemini-3.8-flash
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
        },
      });
    }

    const answer = response.text || "معذرت، اس وقت جواب حاصل نہیں ہو سکا۔";
    res.json({ answer });
  } catch (error: any) {
    console.error("Guidance endpoint error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to process request" });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
