import React from "react";
import { DEDICATION, AUTHORS_MESSAGE, PREFACE } from "../data/bookIndex";
import { Heart, Feather, Sparkles, BookOpen, ArrowLeft } from "lucide-react";

interface FrontMatterViewsProps {
  type: "dedication" | "author" | "preface";
  onNavigateTOC: () => void;
  onStartChapter1: () => void;
}

export const FrontMatterViews: React.FC<FrontMatterViewsProps> = ({
  type,
  onNavigateTOC,
  onStartChapter1,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-[var(--surface)] border-2 border-[var(--surface-border)] rounded-3xl p-8 sm:p-12 shadow-sm relative">
        {/* Back link */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--surface-border)]">
          <button
            onClick={onNavigateTOC}
            className="text-xs sm:text-sm font-urdu font-bold text-[var(--brand-emerald)] hover:underline flex items-center gap-1"
          >
            <span>← فہرستِ ابواب</span>
          </button>
          <button
            onClick={onStartChapter1}
            className="px-4 py-1.5 rounded-xl bg-[#0A3D27] text-white font-urdu text-xs font-bold hover:bg-[#14532D] transition-colors"
          >
            باب اول شروع کریں
          </button>
        </div>

        {/* Content based on type */}
        {type === "dedication" && (
          <div>
            <div className="w-16 h-16 rounded-2xl bg-[#0A3D27]/10 text-[var(--brand-emerald)] flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-[#C29B38]" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] text-center mb-6">
              {DEDICATION.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C29B38] to-transparent mx-auto mb-8" />
            <div className="font-urdu text-base sm:text-xl text-[var(--text-primary)] leading-[2.5] whitespace-pre-line urdu-reading-text">
              {DEDICATION.content}
            </div>
          </div>
        )}

        {type === "author" && (
          <div>
            <div className="w-16 h-16 rounded-2xl bg-[#0A3D27]/10 text-[var(--brand-emerald)] flex items-center justify-center mx-auto mb-6">
              <Feather className="w-8 h-8 text-[#C29B38]" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] text-center mb-2">
              {AUTHORS_MESSAGE.title}
            </h1>
            <p className="text-center font-urdu text-lg text-[var(--brand-gold)] font-bold mb-6">
              مصنف: {AUTHORS_MESSAGE.author}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C29B38] to-transparent mx-auto mb-8" />
            <div className="font-urdu text-base sm:text-xl text-[var(--text-primary)] leading-[2.5] whitespace-pre-line urdu-reading-text">
              {AUTHORS_MESSAGE.content}
            </div>
          </div>
        )}

        {type === "preface" && (
          <div>
            <div className="w-16 h-16 rounded-2xl bg-[#0A3D27]/10 text-[var(--brand-emerald)] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[#C29B38]" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] text-center mb-6">
              {PREFACE.title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C29B38] to-transparent mx-auto mb-8" />
            <div className="font-urdu text-base sm:text-xl text-[var(--text-primary)] leading-[2.5] whitespace-pre-line urdu-reading-text">
              {PREFACE.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
