import React, { useState } from "react";
import { ALL_CHAPTERS, Chapter } from "../data/bookIndex";
import { BookOpen, CheckCircle, Circle, Bookmark, ChevronLeft, Search, Filter } from "lucide-react";

interface TableOfContentsProps {
  onSelectChapter: (id: number) => void;
  completedChapterIds: number[];
  bookmarkedChapterIds: number[];
  lastOpenedChapterId: number | null;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  onSelectChapter,
  completedChapterIds,
  bookmarkedChapterIds,
  lastOpenedChapterId,
}) => {
  const [filter, setFilter] = useState<"all" | "completed" | "unread" | "bookmarked">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredChapters = ALL_CHAPTERS.filter((chapter) => {
    const isCompleted = completedChapterIds.includes(chapter.id);
    const isBookmarked = bookmarkedChapterIds.includes(chapter.id);

    if (filter === "completed" && !isCompleted) return false;
    if (filter === "unread" && isCompleted) return false;
    if (filter === "bookmarked" && !isBookmarked) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = chapter.title.toLowerCase().includes(q);
      const matchSubtitle = chapter.subtitle.toLowerCase().includes(q);
      const matchSummary = chapter.summary.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchSummary;
    }

    return true;
  });

  const completedPercent = Math.round((completedChapterIds.length / ALL_CHAPTERS.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] border border-[#0A3D27]/20 font-urdu font-bold text-sm mb-3">
          کتاب: اللہ کی طرف واپسی
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] mb-3">
          فہرستِ مکمل ابواب (20 ابواب)
        </h1>
        <p className="text-base sm:text-lg font-urdu text-[var(--text-secondary)] max-w-2xl mx-auto">
          کسی بھی باب پر کلک کر کے اس کا مکمل مطالعہ شروع کریں۔ آپ کے مطالعہ کی پیش رفت خود بخود محفوظ ہو جائے گی۔
        </p>

        {/* Progress bar in TOC */}
        <div className="max-w-md mx-auto mt-6 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs">
          <div className="flex items-center justify-between text-xs sm:text-sm font-urdu mb-2">
            <span className="font-bold text-[var(--text-primary)]">مجموعی مطالعہ</span>
            <span className="font-sans-ui text-[var(--brand-emerald)] font-bold">
              {completedChapterIds.length} / {ALL_CHAPTERS.length} ابواب مکمل ({completedPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--surface-border)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0A3D27] to-[#C29B38] rounded-full transition-all duration-500"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--surface-border)] shadow-xs">
        {/* Quick Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابواب میں تلاش کریں..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--surface-border)] text-sm font-urdu focus:outline-hidden focus:ring-2 focus:ring-[#C29B38]"
          />
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-2.5" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs sm:text-sm font-urdu">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === "all"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            تمام ابواب ({ALL_CHAPTERS.length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === "completed"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            مکمل شدہ ({completedChapterIds.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === "unread"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            غیر پڑھے ({ALL_CHAPTERS.length - completedChapterIds.length})
          </button>
          <button
            onClick={() => setFilter("bookmarked")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filter === "bookmarked"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            بُک مارکس ({bookmarkedChapterIds.length})
          </button>
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChapters.map((chapter) => {
          const isDone = completedChapterIds.includes(chapter.id);
          const isMarked = bookmarkedChapterIds.includes(chapter.id);
          const isCurrent = lastOpenedChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className={`cursor-pointer rounded-2xl p-6 transition-all border shadow-xs hover:shadow-md group flex flex-col justify-between ${
                isCurrent
                  ? "bg-gradient-to-br from-[#0A3D27]/8 via-[var(--surface)] to-[#C29B38]/8 border-[#C29B38]"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
              }`}
            >
              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#0A3D27] text-[#FAF7F0] font-urdu font-bold text-sm flex items-center justify-center shrink-0">
                      {chapter.id}
                    </span>
                    <span className="text-xs font-urdu text-[var(--text-secondary)] font-medium">
                      باب نمبر {chapter.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMarked && (
                      <span className="p-1 rounded-md bg-[#C29B38]/20 text-[#C29B38]" title="بُک مارک شدہ">
                        <Bookmark className="w-3.5 h-3.5 fill-[#C29B38]" />
                      </span>
                    )}
                    {isDone ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-xs font-urdu font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>مکمل</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--surface-hover)] text-[var(--text-secondary)] text-xs font-urdu">
                        <Circle className="w-3.5 h-3.5" />
                        <span>غیر پڑھا</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Chapter Title */}
                <h3 className="text-xl sm:text-2xl font-bold font-urdu text-[var(--text-primary)] group-hover:text-[var(--brand-emerald)] transition-colors mb-2">
                  {chapter.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm font-urdu font-semibold text-[var(--brand-gold)] mb-3">
                  {chapter.subtitle}
                </p>

                {/* Summary */}
                <p className="text-xs sm:text-sm font-urdu text-[var(--text-secondary)] leading-[2.1] line-clamp-3 mb-4">
                  {chapter.summary}
                </p>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 border-t border-[var(--surface-border)] flex items-center justify-between text-xs font-urdu font-bold">
                <span className="text-[var(--brand-emerald)] group-hover:underline flex items-center gap-1">
                  <span>مکمل باب پڑھیں</span>
                  <ChevronLeft className="w-4 h-4 text-[#C29B38] group-hover:-translate-x-1 transition-transform" />
                </span>

                <span className="text-[var(--text-secondary)] font-sans-ui text-[11px]">
                  ~1500 الفاظ
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-16 bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-8">
          <BookOpen className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
          <p className="text-base font-urdu text-[var(--text-secondary)]">
            کوئی باب تلاش کے مطابق نہیں ملا۔
          </p>
          <button
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#0A3D27] text-white text-xs font-urdu font-bold"
          >
            تمام ابواب دکھائیں
          </button>
        </div>
      )}
    </div>
  );
};
