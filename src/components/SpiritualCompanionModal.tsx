import React, { useState } from "react";
import { Sparkles, X, Send, Loader2, Volume2, VolumeX, MessageSquare, BookOpen, Compass } from "lucide-react";

interface SpiritualCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterTitle?: string;
}

export const SpiritualCompanionModal: React.FC<SpiritualCompanionModalProps> = ({
  isOpen,
  onClose,
  currentChapterTitle,
}) => {
  const [prompt, setPrompt] = useState("");
  const [mode, setAiMode] = useState<"general" | "deep_reflection" | "scholar_search">("general");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; mode?: string }[]
  >([
    {
      role: "assistant",
      content: `السلام علیکم ورحمۃ اللہ وبرکاتہ!
میں کتاب "اللہ کی طرف واپسی" کا روحانی و علمی رفیق ہوں۔ آپ توبہ، نماز میں خشوع، گناہوں سے بچاؤ، دل کی بے سکونی، یا قرآن کے متعلق کوئی بھی سوال یا الجھن بلا جھجک شیئر کر سکتے ہیں۔
"واپس آ جاؤ، تمہارا رب تمہیں جانتا ہے اور اس کی رحمت بہت وسیع ہے۔"`,
    },
  ]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    "میرا دل نماز میں نہیں لگتا، میں کیا کروں؟",
    "کیا اللہ میرے جیسے گناہ گار کو معاف کر دے گا؟",
    "تنہائی میں گناہ سے بچنے کا مؤثر طریقہ کیا ہے؟",
    "توبہ بار بار ٹوٹ جاتی ہے، کیا میں منافق ہوں؟",
    "والدین ناراض ہیں، انہیں کیسے راضی کروں؟",
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || prompt;
    if (!q.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: q }];
    setMessages(newMessages);
    setPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          chapterTitle: currentChapterTitle || "عمومی روحانی رہنمائی",
          mode,
        }),
      });

      if (!res.ok) {
        throw new Error("سرور سے جواب حاصل نہیں ہو سکا۔");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.answer, mode }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `معذرت، اس وقت رابطہ ممکن نہیں ہو سکا۔ ${err.message || ""}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoice = (text: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 400));
      utterance.lang = "ur-PK";
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--surface-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0A3D27] to-[#14532D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F4E8C1]">
              <Sparkles className="w-5 h-5 text-[#C29B38]" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-urdu text-[#FAF7F0]">
                روحانی مشیر و علمی رفیق (Gemini AI)
              </h3>
              <p className="text-xs text-[#F4E8C1]/80 font-urdu">
                مستند اسلامی رہنمائی برائے اصلاحِ نفس و قربِ الٰہی
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Mode Selector Tabs */}
        <div className="p-2.5 bg-[var(--surface-hover)] border-b border-[var(--surface-border)] flex items-center justify-between gap-2 overflow-x-auto text-xs font-urdu">
          <span className="text-[var(--text-secondary)] shrink-0 font-bold">ماڈل و صلاحیت:</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setAiMode("general")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === "general"
                  ? "bg-[#0A3D27] text-white font-bold"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)]"
              }`}
            >
              عام سوالات (Flash)
            </button>
            <button
              onClick={() => setAiMode("deep_reflection")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === "deep_reflection"
                  ? "bg-[#0A3D27] text-white font-bold"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)]"
              }`}
            >
              عمیق فہم و حکمت (Argon High Thinking)
            </button>
            <button
              onClick={() => setAiMode("scholar_search")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === "scholar_search"
                  ? "bg-[#0A3D27] text-white font-bold"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)]"
              }`}
            >
              مستند تحقیق (Search Grounding)
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 sm:p-5 font-urdu text-sm sm:text-base leading-[2.3] ${
                  m.role === "user"
                    ? "bg-[#0A3D27] text-white rounded-tr-none shadow-xs"
                    : "bg-[var(--surface-hover)] border border-[var(--surface-border)] text-[var(--text-primary)] rounded-tl-none shadow-xs"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--surface-border)] text-xs text-[var(--brand-emerald)] font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                      <span>روحانی رہنمائی</span>
                    </span>
                    <button
                      onClick={() => handlePlayVoice(m.content)}
                      className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      title="آواز سنیں"
                    >
                      {isPlayingAudio ? (
                        <VolumeX className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-[#C29B38]" />
                      )}
                    </button>
                  </div>
                )}
                <div className="whitespace-pre-line urdu-reading-text">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-2xl p-4 flex items-center gap-3 font-urdu text-xs text-[var(--text-secondary)]">
                <Loader2 className="w-4 h-4 text-[#C29B38] animate-spin" />
                <span>قرآن و سنت کی روشنی میں جواب مرتب ہو رہا ہے...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 border-t border-[var(--surface-border)] bg-[var(--surface)] overflow-x-auto flex items-center gap-2 text-xs font-urdu">
          <span className="text-[var(--text-secondary)] shrink-0">منتخب سوالات:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] hover:bg-[#C29B38]/10 border border-[var(--surface-border)] text-[var(--text-primary)] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[var(--surface-border)] bg-[var(--surface)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اپنا روحانی سوال یا الجھن یہاں تحریر کریں..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[var(--surface-hover)] border border-[var(--surface-border)] text-sm sm:text-base font-urdu text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[#C29B38]"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-3 rounded-2xl bg-[#0A3D27] hover:bg-[#14532D] text-white font-urdu font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">ارسال</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
