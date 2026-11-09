import React, { useState, useEffect, useRef } from "react";
import { Chapter } from "../data/types";
import {
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Share2,
  Sparkles,
  BookOpen,
  ArrowUp,
  Printer,
  Heart,
  Quote,
  HelpCircle,
  Send,
  Loader2,
} from "lucide-react";

interface ChapterReaderProps {
  chapter: Chapter;
  fontSize: "sm" | "md" | "lg" | "xl";
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onBackToTOC: () => void;
  totalChapters: number;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapter,
  fontSize,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  onNavigatePrev,
  onNavigateNext,
  onBackToTOC,
  totalChapters,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<"general" | "deep_reflection" | "scholar_search">("general");

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio when chapter changes
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(false);
    setAudioError(null);
    setAiAnswer(null);
    setUserQuestion("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapter.id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Text-To-Speech handler
  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsLoadingAudio(true);
    setAudioError(null);

    // Form audio narration text from opening and verses
    const textToRead = `${chapter.title}۔ ${chapter.subtitle}۔ ${chapter.opening}۔`;

    try {
      // 1. Try Gemini 3.8 Flash TTS via server endpoint
      const res = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToRead,
          voice: "Kore",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audioUrl = `data:${data.mimeType || "audio/wav"};base64,${data.audioBase64}`;
          const audio = new Audio(audioUrl);
          audioElementRef.current = audio;
          audio.onended = () => setIsPlayingAudio(false);
          audio.onerror = () => {
            playSpeechSynthesisFallback(textToRead);
          };
          await audio.play();
          setIsPlayingAudio(true);
          setIsLoadingAudio(false);
          return;
        }
      }
      // If server response not ok, fall back to Web Speech
      playSpeechSynthesisFallback(textToRead);
    } catch {
      playSpeechSynthesisFallback(textToRead);
    }
  };

  const playSpeechSynthesisFallback = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ur-PK";
      utterance.rate = 0.9;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
        setAudioError("صوتی قراءت اس وقت ممکن نہیں ہو سکی۔");
      };
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsLoadingAudio(false);
    } else {
      setIsLoadingAudio(false);
      setAudioError("آپ کا براؤزر صوتی قراءت سپورٹ نہیں کرتا۔");
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsAskingAI(true);
    setAiAnswer(null);

    try {
      const res = await fetch("/api/gemini/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          chapterTitle: chapter.title,
          chapterContext: chapter.opening,
          mode: aiMode,
        }),
      });

      if (!res.ok) {
        throw new Error("سرور سے جواب حاصل نہیں ہو سکا۔");
      }

      const data = await res.json();
      setAiAnswer(data.answer);
    } catch (err: any) {
      setAiAnswer(`معذرت: ${err.message || "کوشش ناکام ہو گئی۔ براہِ کرم دوبارہ کوشش فرمائیں۔"}`);
    } finally {
      setIsAskingAI(false);
    }
  };

  // Font size classes
  const fontSizes = {
    sm: "text-base sm:text-lg leading-[2.1]",
    md: "text-lg sm:text-xl leading-[2.3]",
    lg: "text-xl sm:text-2xl leading-[2.5]",
    xl: "text-2xl sm:text-3xl leading-[2.7]",
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Breadcrumb & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[var(--surface-border)] mb-8 text-sm font-urdu">
        <button
          onClick={onBackToTOC}
          className="text-[var(--brand-emerald)] hover:underline flex items-center gap-1 font-semibold"
        >
          <span>← فہرستِ ابواب</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio narration button */}
          <button
            onClick={handleToggleAudio}
            disabled={isLoadingAudio}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isPlayingAudio
                ? "bg-red-700 text-white border-red-800 animate-pulse"
                : "bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
            }`}
          >
            {isLoadingAudio ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>لوڈ ہو رہا ہے...</span>
              </>
            ) : isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>آڈیو روکیں</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>آڈیو سنیں (TTS)</span>
              </>
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(chapter.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked
                ? "bg-[#C29B38] text-[#082819] border-[#C29B38]"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--surface-border)]"
            }`}
            title={isBookmarked ? "بُک مارک ہٹائیں" : "اس باب کو بُک مارک کریں"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Mark Completed Button */}
          <button
            onClick={() => onToggleComplete(chapter.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isCompleted
                ? "bg-[#0A3D27] text-white border-[#0A3D27]"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--surface-border)]"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C29B38]" />
                <span>مطالعہ مکمل</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>مکمل نشان لگائیں</span>
              </>
            )}
          </button>

          {/* Print Friendly */}
          <button
            onClick={handlePrint}
            title="پرنٹ کریں"
            className="p-2 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--surface-border)] hidden sm:block"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {audioError && (
        <div className="mb-6 p-3 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-urdu text-center">
          {audioError}
        </div>
      )}

      {/* Chapter Header Frame */}
      <header className="text-center mb-12">
        <div className="inline-block px-4 py-1 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] border border-[#0A3D27]/20 font-urdu font-bold text-sm mb-4">
          باب {chapter.id} از {totalChapters}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] leading-[1.6] mb-3">
          {chapter.title}
        </h1>

        <p className="text-lg sm:text-xl font-urdu text-[var(--brand-gold)] font-medium max-w-2xl mx-auto">
          {chapter.subtitle}
        </p>

        {/* Decorative divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C29B38] to-transparent mx-auto mt-6" />
      </header>

      {/* Chapter Opening (Emotionally Engaging) */}
      <section className="mb-12">
        <div className="relative bg-gradient-to-r from-[#0A3D27]/8 via-[#C29B38]/8 to-transparent rounded-2xl p-6 sm:p-8 border-r-4 border-[#C29B38]">
          <Quote className="w-8 h-8 text-[#C29B38]/40 mb-3" />
          <p className={`font-urdu urdu-reading-text text-[var(--text-primary)] ${fontSizes[fontSize]}`}>
            {chapter.opening}
          </p>
        </div>
      </section>

      {/* Quranic Verses Section (Authentic Arabic + Translation + Reference) */}
      {chapter.quranVerses.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-[#0A3D27] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold font-urdu text-[var(--brand-emerald)]">
              فرامینِ الٰہی — قرآنِ حکیم
            </h2>
          </div>

          <div className="space-y-4">
            {chapter.quranVerses.map((verse, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface)] border-2 border-[#C29B38]/30 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#C29B38] transition-colors relative"
              >
                {/* Copy Button */}
                <button
                  onClick={() =>
                    copyToClipboard(`${verse.arabic}\n\n${verse.translation}\n(${verse.reference})`, `verse-${idx}`)
                  }
                  title="آیت اور ترجمہ کاپی کریں"
                  className="absolute top-4 left-4 p-2 rounded-lg bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {copiedKey === `verse-${idx}` ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Arabic Quranic Text */}
                <p className="font-quran text-2xl sm:text-3xl text-right text-[var(--brand-emerald)] leading-[2.2] tracking-wide mb-6 pl-8">
                  {verse.arabic}
                </p>

                {/* Urdu Translation */}
                <div className="pt-4 border-t border-[var(--surface-border)]">
                  <p className="font-urdu text-base sm:text-lg text-[var(--text-primary)] leading-[2.2]">
                    <strong className="text-[var(--brand-gold)]">ترجمہ: </strong>
                    {verse.translation}
                  </p>
                </div>

                {/* Reference Tag */}
                <div className="mt-4 flex items-center justify-end">
                  <span className="px-3 py-1 rounded-md bg-[#0A3D27]/10 text-[var(--brand-emerald)] font-urdu text-xs font-bold">
                    {verse.reference}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Authentic Hadith Section */}
      {chapter.hadiths.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-[#C29B38] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold font-urdu text-[var(--brand-emerald)]">
              ارشاداتِ نبوی ﷺ — احادیثِ مبارکہ
            </h2>
          </div>

          <div className="space-y-4">
            {chapter.hadiths.map((h, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface)] border-2 border-[var(--surface-border)] rounded-2xl p-6 sm:p-8 relative"
              >
                <button
                  onClick={() => copyToClipboard(`${h.urdu}\n(${h.source})`, `hadith-${idx}`)}
                  title="حدیث اور ترجمہ کاپی کریں"
                  className="absolute top-4 left-4 p-2 rounded-lg bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {copiedKey === `hadith-${idx}` ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {h.arabic && (
                  <p className="font-quran text-xl sm:text-2xl text-right text-[var(--text-primary)] leading-[2.0] mb-4 pl-8">
                    {h.arabic}
                  </p>
                )}

                <p className="font-urdu text-base sm:text-lg text-[var(--text-primary)] leading-[2.2]">
                  {h.urdu}
                </p>

                <div className="mt-4 flex items-center justify-end">
                  <span className="px-3 py-1 rounded-md bg-[#C29B38]/15 text-[#916F1E] font-urdu text-xs font-bold">
                    حوالہ: {h.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Chapter Content Sections */}
      <section className="mb-12 space-y-8">
        {chapter.sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold font-urdu text-[var(--brand-emerald)] pb-2 border-b border-[var(--surface-border)]">
              {section.heading}
            </h3>
            {section.content.map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className={`font-urdu urdu-reading-text text-[var(--text-primary)] ${fontSizes[fontSize]}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Real-Life Realistic Example (سبق آموز واقعہ) */}
      {chapter.realLifeExample && (
        <section className="mb-12">
          <div className="bg-gradient-to-br from-[#FAF7F0] via-white to-[#F3EFE6] dark:from-[#15211B] dark:via-[#1B2C24] dark:to-[#15211B] rounded-2xl p-6 sm:p-8 border border-[#C29B38]/40 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)]">
                سبق آموز واقعہ: {chapter.realLifeExample.title}
              </h3>
            </div>
            <p className="font-urdu text-base sm:text-lg text-[var(--text-primary)] leading-[2.3] mb-4 urdu-reading-text">
              {chapter.realLifeExample.story}
            </p>
            <div className="p-4 rounded-xl bg-[#C29B38]/10 border-r-4 border-[#C29B38]">
              <p className="font-urdu text-sm sm:text-base font-bold text-[var(--brand-emerald)]">
                سبق: {chapter.realLifeExample.lesson}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Heartfelt Spiritual Reflection (روحانی محاسبہ) */}
      {chapter.spiritualReflection && (
        <section className="mb-12">
          <div className="bg-[#0A3D27] text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-[#C29B38]" />
              <h3 className="text-xl font-bold font-urdu text-[#F4E8C1]">
                روحانی تدبر اور دل کا آئینہ
              </h3>
            </div>
            <p className="font-urdu text-base sm:text-lg text-[#FAF7F0] leading-[2.4] urdu-reading-text">
              {chapter.spiritualReflection}
            </p>
          </div>
        </section>
      )}

      {/* Practical Action Steps Checklist (عملی اقدامات) */}
      {chapter.practicalSteps.length > 0 && (
        <section className="mb-12">
          <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)] mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>اس باب کے عملی اقدامات (Practical Steps)</span>
            </h3>
            <ul className="space-y-3">
              {chapter.practicalSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] font-bold text-xs flex items-center justify-center shrink-0 mt-1 font-sans-ui">
                    {idx + 1}
                  </span>
                  <span className="font-urdu text-base text-[var(--text-primary)] leading-[2.1]">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Self-Reflection Questions (محاسبہ کے سوالات) */}
      {chapter.reflectionQuestions.length > 0 && (
        <section className="mb-12">
          <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)] mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#C29B38]" />
              <span>محاسبۂ نفس کے سوالات — خود سے سچی بات</span>
            </h3>
            <div className="space-y-3">
              {chapter.reflectionQuestions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--surface-border)] font-urdu text-base text-[var(--text-primary)]">
                  • {q}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing Chapter Dua (دعائے اختتام) */}
      {chapter.closingDua && (
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#0A3D27] to-[#155734] text-white rounded-2xl p-6 sm:p-8 shadow-md relative">
            <button
              onClick={() =>
                copyToClipboard(
                  `${chapter.closingDua.arabic}\n${chapter.closingDua.translation}`,
                  "closing-dua"
                )
              }
              title="دعا کاپی کریں"
              className="absolute top-4 left-4 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {copiedKey === "closing-dua" ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤲</span>
              <h3 className="text-xl font-bold font-urdu text-[#D4AF37]">
                اس باب کی مسنون دعا
              </h3>
            </div>

            <p className="font-quran text-2xl sm:text-3xl text-right leading-[2.2] mb-4 text-[#FAF7F0] pl-8">
              {chapter.closingDua.arabic}
            </p>

            <p className="font-urdu text-base sm:text-lg text-[#F4E8C1] leading-[2.2]">
              <strong className="text-white">ترجمہ: </strong>
              {chapter.closingDua.translation}
            </p>
          </div>
        </section>
      )}

      {/* Interactive AI Chapter Contemplation & Guidance Assistant */}
      <section className="mb-12 bg-gradient-to-br from-[#0A3D27]/5 via-[var(--surface)] to-[#C29B38]/5 rounded-2xl p-6 sm:p-8 border border-[var(--surface-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#C29B38]" />
          <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)]">
            اس باب کے بارے میں سوال یا روحانی رہنمائی لیں
          </h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-urdu mb-4">
          اگر آپ کو اس باب کے متعلق کوئی الجھن ہے یا آپ کسی ذاتی مسئلے میں قرآنی و نبوی رہنمائی چاہتے ہیں تو یہاں تحریر فرمائیں:
        </p>

        {/* AI Mode Selector */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-urdu">
          <span className="text-[var(--text-secondary)]">طرزِ جواب:</span>
          <button
            type="button"
            onClick={() => setAiMode("general")}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              aiMode === "general"
                ? "bg-[#0A3D27] text-white border-[#0A3D27]"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--surface-border)]"
            }`}
          >
            عام و پرحکمت (Gemini Flash)
          </button>
          <button
            type="button"
            onClick={() => setAiMode("deep_reflection")}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              aiMode === "deep_reflection"
                ? "bg-[#0A3D27] text-white border-[#0A3D27]"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--surface-border)]"
            }`}
          >
            گہرا تدبر و حکمت (Gemini Argon Thinking)
          </button>
          <button
            type="button"
            onClick={() => setAiMode("scholar_search")}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              aiMode === "scholar_search"
                ? "bg-[#0A3D27] text-white border-[#0A3D27]"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--surface-border)]"
            }`}
          >
            مستند حوالہ جاتی تلاش (Search Grounding)
          </button>
        </div>

        <form onSubmit={handleAskAI} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="مثلاً: اس باب کے بعد میں نماز میں دل کیسے لگاؤں؟"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] text-sm font-urdu focus:outline-hidden focus:ring-2 focus:ring-[#C29B38]"
            />
            <button
              type="submit"
              disabled={isAskingAI || !userQuestion.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#0A3D27] hover:bg-[#14532D] text-white font-urdu text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              {isAskingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>پوچھیں</span>
            </button>
          </div>
        </form>

        {aiAnswer && (
          <div className="mt-4 p-5 rounded-xl bg-[var(--surface)] border border-[#C29B38]/30 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--brand-emerald)] font-urdu">
              <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
              <span>روحانی رہنمائی و جواب:</span>
            </div>
            <div className="font-urdu text-sm sm:text-base text-[var(--text-primary)] leading-[2.3] whitespace-pre-line urdu-reading-text">
              {aiAnswer}
            </div>
          </div>
        )}
      </section>

      {/* Bottom Chapter Navigation Footer */}
      <footer className="pt-8 border-t-2 border-[var(--surface-border)] flex flex-wrap items-center justify-between gap-4 font-urdu">
        {onNavigatePrev ? (
          <button
            onClick={onNavigatePrev}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] text-[var(--text-primary)] font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#C29B38]" />
            <span>پچھلا باب</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToTOC}
            className="px-4 py-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs sm:text-sm font-bold transition-colors"
          >
            فہرستِ ابواب
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="اوپر جائیں"
            className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--surface-border)]"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {onNavigateNext ? (
          <button
            onClick={onNavigateNext}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A3D27] hover:bg-[#14532D] text-white font-bold text-sm sm:text-base shadow-xs transition-colors"
          >
            <span>اگلا باب</span>
            <ChevronLeft className="w-5 h-5 text-[#C29B38]" />
          </button>
        ) : (
          <button
            onClick={onBackToTOC}
            className="px-5 py-3 rounded-xl bg-[#C29B38] text-[#082819] font-bold text-sm sm:text-base shadow-xs"
          >
            کتاب مکمل — فہرست دیکھیں
          </button>
        )}
      </footer>
    </article>
  );
};
