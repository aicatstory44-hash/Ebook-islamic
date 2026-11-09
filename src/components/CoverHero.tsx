import React from "react";
import { BOOK_META, DEDICATION, AUTHORS_MESSAGE, PREFACE } from "../data/bookIndex";
import { BookOpen, CheckCircle, ArrowLeft, Heart, Feather, Sparkles, Compass, Share2 } from "lucide-react";

interface CoverHeroProps {
  onStartReading: () => void;
  onResumeReading: () => void;
  onOpenTOC: () => void;
  onOpenActionPlan: () => void;
  onOpenSection: (section: "dedication" | "author" | "preface") => void;
  completedCount: number;
  totalChapters: number;
  lastOpenedChapterId: number | null;
  lastOpenedChapterTitle?: string;
}

export const CoverHero: React.FC<CoverHeroProps> = ({
  onStartReading,
  onResumeReading,
  onOpenTOC,
  onOpenActionPlan,
  onOpenSection,
  completedCount,
  totalChapters,
  lastOpenedChapterId,
  lastOpenedChapterTitle,
}) => {
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: BOOK_META.title,
          text: `${BOOK_META.title} — ${BOOK_META.subtitle}\nمصنف: ${BOOK_META.author}`,
          url: window.location.href,
        });
      } catch {
        // user dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("کتاب کا لنک کلپ بورڈ پر کاپی ہو گیا ہے!");
    }
  };

  return (
    <div className="w-full">
      {/* Grand Islamic Book Cover Container */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#082819] via-[#0A3D27] to-[#0D442C] text-[#FAF7F0] pt-12 pb-20 px-4 sm:px-6 shadow-xl border-b-4 border-[#C29B38]">
        {/* Subtle geometric Islamic patterns & stars */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C29B38_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Golden Arch Glow Silhouette in the Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C29B38]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Bismillah Header */}
          <div className="mb-6 inline-flex flex-col items-center">
            <span className="text-xl sm:text-2xl text-[#C29B38] font-quran tracking-wider select-none">
              {BOOK_META.openingBismillah}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#C29B38] to-transparent mt-2" />
          </div>

          {/* Book Presentation Frame */}
          <div className="relative mx-auto max-w-2xl bg-[#061F13]/80 backdrop-blur-sm border-2 border-[#C29B38]/60 rounded-3xl p-8 sm:p-12 shadow-2xl">
            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 right-3 text-[#C29B38] text-sm select-none">✦</div>
            <div className="absolute top-3 left-3 text-[#C29B38] text-sm select-none">✦</div>
            <div className="absolute bottom-3 right-3 text-[#C29B38] text-sm select-none">✦</div>
            <div className="absolute bottom-3 left-3 text-[#C29B38] text-sm select-none">✦</div>

            {/* Sub-badge */}
            <div className="inline-block px-4 py-1 rounded-full bg-[#C29B38]/20 border border-[#C29B38]/40 text-[#F4E8C1] text-xs sm:text-sm font-urdu font-medium mb-4">
              ایک مکمل، مستند اور دل کو چھو لینے والی اسلامی ڈیجیٹل کتاب
            </div>

            {/* Main Book Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-urdu text-[#FAF7F0] tracking-tight leading-[1.6] sm:leading-[1.6] mb-4 text-shadow-sm">
              {BOOK_META.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-urdu text-[#D4AF37] mb-6 font-semibold">
              {BOOK_META.subtitle}
            </p>

            {/* Pathway to Warm Golden Light Metaphor */}
            <div className="my-6 flex items-center justify-center gap-3 text-xs text-[#FAF7F0]/80 font-urdu">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#C29B38]" />
              <span className="italic">"واپس آ جاؤ، تمہارا رب تمہیں جانتا ہے اور اس کی رحمت بہت وسیع ہے۔"</span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#C29B38]" />
            </div>

            {/* Author Credit */}
            <div className="mt-8 pt-6 border-t border-[#C29B38]/30 flex flex-wrap items-center justify-center gap-6 text-sm text-[#F4E8C1]/90 font-urdu">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#C29B38]" />
                <span>مصنف: <strong className="text-white text-base font-bold">{BOOK_META.author}</strong></span>
              </div>
              <span className="text-[#C29B38]">•</span>
              <div>20 مکمل ابواب</div>
              <span className="text-[#C29B38]">•</span>
              <div>30 روزہ عملی لائحہ عمل</div>
            </div>

            {/* Main Call-to-Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {lastOpenedChapterId ? (
                <button
                  onClick={onResumeReading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C29B38] to-[#DFC066] text-[#082819] font-urdu font-bold text-base sm:text-lg shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>مطالعہ جاری رکھیں (باب {lastOpenedChapterId})</span>
                </button>
              ) : (
                <button
                  onClick={onStartReading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C29B38] to-[#DFC066] text-[#082819] font-urdu font-bold text-base sm:text-lg shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>کتاب شروع کریں (باب اول)</span>
                </button>
              )}

              <button
                onClick={onOpenTOC}
                className="px-5 py-3 rounded-xl bg-[#0A3D27] border border-[#C29B38]/60 text-[#FAF7F0] font-urdu font-semibold text-base hover:bg-[#14532D] active:scale-95 transition-all"
              >
                فہرستِ ابواب
              </button>

              <button
                onClick={onOpenActionPlan}
                className="px-5 py-3 rounded-xl bg-[#061F13] border border-[#C29B38]/40 text-[#C29B38] font-urdu font-semibold text-base hover:bg-[#0A3D27] active:scale-95 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>30 روزہ منصوبہ</span>
              </button>

              <button
                onClick={handleShare}
                title="کتاب شیئر کریں"
                className="p-3 rounded-xl bg-[#061F13] border border-[#C29B38]/40 text-[#FAF7F0] hover:text-[#C29B38] transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reading Progress Quick Card */}
          <div className="mt-8 max-w-xl mx-auto bg-[#061F13]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#C29B38]/20 text-right">
            <div className="flex items-center justify-between text-xs sm:text-sm font-urdu mb-2">
              <span className="text-[#C29B38] font-bold">آپ کے مطالعہ کی پیش رفت</span>
              <span className="font-sans-ui text-[#F4E8C1]">
                {completedCount} / {totalChapters} ابواب مکمل ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#0A3D27] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C29B38] to-[#E5C875] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {lastOpenedChapterTitle && (
              <p className="text-xs text-[#FAF7F0]/70 font-urdu mt-2">
                آخری مطالعہ شدہ باب: <strong>{lastOpenedChapterTitle}</strong>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Book Information & Introductory Navigation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Front Matter Tabs: Dedication, Author's Message, Preface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Dedication Card */}
          <div
            onClick={() => onOpenSection("dedication")}
            className="cursor-pointer bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-2xl p-6 transition-all shadow-xs hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0A3D27]/10 text-[var(--brand-emerald)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 text-[#C29B38]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-urdu mb-2">
              {DEDICATION.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-urdu line-clamp-3">
              یہ حقیر تحریر اپنے اس خالق و مالک، رحمن و رحیم پروردگار کے نام جس نے ہمیشہ میری پردہ پوشی فرمائی...
            </p>
            <div className="mt-4 text-xs font-bold text-[var(--brand-gold)] font-urdu flex items-center gap-1">
              <span>مکمل انتساب پڑھیں</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Author's Message Card */}
          <div
            onClick={() => onOpenSection("author")}
            className="cursor-pointer bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-2xl p-6 transition-all shadow-xs hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0A3D27]/10 text-[var(--brand-emerald)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Feather className="w-6 h-6 text-[#C29B38]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-urdu mb-2">
              {AUTHORS_MESSAGE.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-urdu line-clamp-3">
              میرے ہاتھ میں یہ قلم کسی برتری کے احساس کے تحت نہیں، بلکہ اپنے ہی دل کے زخموں پر مرہم رکھنے کی تمنا لیے...
            </p>
            <div className="mt-4 text-xs font-bold text-[var(--brand-gold)] font-urdu flex items-center gap-1">
              <span>مصنف کا پیغام پڑھیں</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Preface Card */}
          <div
            onClick={() => onOpenSection("preface")}
            className="cursor-pointer bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-2xl p-6 transition-all shadow-xs hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0A3D27]/10 text-[var(--brand-emerald)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-[#C29B38]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-urdu mb-2">
              {PREFACE.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] font-urdu line-clamp-3">
              انسان کی تخلیق کا اصل راز اللہ کی معرفت اور اس کی محبت میں مضمر ہے۔ مگر دنیا کی زندگی ایک ایسا فریب ہے...
            </p>
            <div className="mt-4 text-xs font-bold text-[var(--brand-gold)] font-urdu flex items-center gap-1">
              <span>مقدمہ کتاب پڑھیں</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Book Overview Highlights */}
        <div className="bg-gradient-to-br from-[#0A3D27]/10 via-[#C29B38]/5 to-transparent rounded-3xl p-8 border border-[var(--surface-border)]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-urdu text-[var(--brand-emerald)] mb-4">
              اس کتاب کا مقصد اور پیغام
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] font-urdu leading-[2.3] mb-8">
              یہ کتاب ان تمام دلوں کے لیے ایک دستک ہے جو دنیا کے غموں، گناہوں کی تپش اور تنہائی کے اندھیروں میں اپنے رب سے بچھڑ چکے ہیں۔ ہمارا مقصد آپ کے دل میں اس بات کا سچا یقین جگانا ہے کہ:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0A3D27] shrink-0 mt-1" />
                <span className="font-urdu text-sm sm:text-base text-[var(--text-primary)]">
                  میرا رب مجھے جانتا ہے، اور وہ میری شہ رگ سے بھی زیادہ قریب ہے۔
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0A3D27] shrink-0 mt-1" />
                <span className="font-urdu text-sm sm:text-base text-[var(--text-primary)]">
                  اللہ کی رحمت سے کبھی مایوس نہیں ہونا چاہیے، توبہ کا دروازہ ہر وقت کھلا ہے۔
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0A3D27] shrink-0 mt-1" />
                <span className="font-urdu text-sm sm:text-base text-[var(--text-primary)]">
                  میں آج ہی اسی لمحے اپنی زندگی بدلنے کا آغاز کر سکتا ہوں۔
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0A3D27] shrink-0 mt-1" />
                <span className="font-urdu text-sm sm:text-base text-[var(--text-primary)]">
                  دنیا عارضی مسافر خانہ ہے اور آخرت ہی اصل اور ہمیشہ کی منزل ہے۔
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
