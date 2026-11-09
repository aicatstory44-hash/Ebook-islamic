import React, { useState } from "react";
import { searchBook, SearchResult } from "../data/bookIndex";
import { Search, X, BookOpen, ChevronLeft } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterId: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
}) => {
  const [query, setQuery] = useState("");
  const results: SearchResult[] = searchBook(query);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--surface-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[var(--surface-border)] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--brand-emerald)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="کتاب میں لفظ، موضوع، قرآنی آیت یا حدیث تلاش کریں..."
            autoFocus
            className="flex-1 bg-transparent text-base sm:text-lg font-urdu text-[var(--text-primary)] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-hover)] text-xs font-urdu font-bold text-[var(--text-secondary)]"
          >
            بند کریں
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim().length < 2 ? (
            <div className="text-center py-12 text-[var(--text-secondary)] font-urdu">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C29B38]" />
              <p className="text-sm">تلاش شروع کرنے کے لیے کم از کم 2 حروف درج فرمائیں...</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {["توبہ", "نماز", "قرآن", "رحمت", "موت", "والدین", "حسد", "استغفار"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] border border-[var(--surface-border)] hover:border-[#C29B38]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)] font-urdu">
              <p className="text-sm">"{query}" کے متعلق کوئی نتیجہ نہیں ملا۔</p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-urdu text-[var(--text-secondary)] px-2 mb-3">
                {results.length} نتائج برائے "{query}":
              </p>
              <div className="space-y-2">
                {results.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectChapter(res.chapterId);
                      onClose();
                    }}
                    className="cursor-pointer p-4 rounded-2xl bg-[var(--surface-hover)] hover:bg-[#C29B38]/10 border border-[var(--surface-border)] hover:border-[#C29B38] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#0A3D27] text-white font-urdu text-xs font-bold flex items-center justify-center">
                          {res.chapterId}
                        </span>
                        <h4 className="font-bold font-urdu text-base text-[var(--text-primary)] group-hover:text-[var(--brand-emerald)]">
                          {res.chapterTitle}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#0A3D27]/10 text-[var(--brand-emerald)] font-urdu text-[10px] font-bold">
                        {res.matchType === "title" && "عنوان"}
                        {res.matchType === "content" && "متن"}
                        {res.matchType === "verse" && "قرآنی آیت"}
                        {res.matchType === "hadith" && "حدیث"}
                        {res.matchType === "reflection" && "محاسبہ"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-urdu text-[var(--text-secondary)] line-clamp-2">
                      {res.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
