import React from "react";
import { BookOpen, Moon, Sun, Bookmark, Search, Type, CheckCircle, Sparkles, Compass } from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, chapterId?: number) => void;
  theme: "light" | "dark" | "sepia";
  onToggleTheme: (theme: "light" | "dark" | "sepia") => void;
  fontSize: "sm" | "md" | "lg" | "xl";
  onChangeFontSize: (delta: number) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenAI: () => void;
  completedCount: number;
  totalChapters: number;
  bookmarkedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  fontSize,
  onChangeFontSize,
  onOpenSearch,
  onOpenBookmarks,
  onOpenAI,
  completedCount,
  totalChapters,
  bookmarkedCount,
}) => {
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--surface-border)] shadow-xs transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A3D27] to-[#155734] border border-[#C29B38]/40 flex items-center justify-center text-[#F4E8C1] shadow-xs group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-[var(--brand-emerald)] tracking-tight font-urdu">
                اللہ کی طرف واپسی
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-[#C29B38]/15 text-[#916F1E] border border-[#C29B38]/30">
                ای بک
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-urdu hidden md:block">
              دل سے رب تک — ایک روحانی سفر | عبدالرشید زاہد
            </p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium font-urdu">
          <button
            onClick={() => onNavigate("home")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === "home"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            سرورق
          </button>
          <button
            onClick={() => onNavigate("toc")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === "toc"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            فہرستِ ابواب
          </button>
          <button
            onClick={() => onNavigate("action-plan")}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === "action-plan"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#C29B38]" />
            <span>30 روزہ لائحہ عمل</span>
          </button>
          <button
            onClick={() => onNavigate("duas")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === "duas"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            مسنون دعائیں و اذکار
          </button>
          <button
            onClick={() => onNavigate("references")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === "references"
                ? "bg-[#0A3D27] text-white font-bold"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            حوالہ جات
          </button>
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Spiritual Companion Button */}
          <button
            onClick={onOpenAI}
            title="روحانی مشیر و سوال جواب (AI)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0A3D27] to-[#14532D] text-[#F4E8C1] hover:brightness-110 transition-all shadow-xs text-xs sm:text-sm font-urdu font-semibold border border-[#C29B38]/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C29B38] animate-pulse" />
            <span className="hidden sm:inline">روحانی معاون</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            title="کتاب میں تلاش کریں"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            title="بُک مارکس اور نوٹس"
            className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C29B38] text-[#0A3D27] font-bold text-[10px] flex items-center justify-center font-sans-ui">
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Font Size Adjuster */}
          <div className="hidden sm:flex items-center bg-[var(--surface-hover)] rounded-lg p-0.5 border border-[var(--surface-border)]">
            <button
              onClick={() => onChangeFontSize(-1)}
              title="فونٹ چھوٹا کریں"
              className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="font-bold">A-</span>
            </button>
            <span className="text-[10px] px-1 text-[var(--text-secondary)] font-sans-ui uppercase">
              {fontSize}
            </span>
            <button
              onClick={() => onChangeFontSize(1)}
              title="فونٹ بڑا کریں"
              className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="font-bold">A+</span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center bg-[var(--surface-hover)] rounded-lg p-0.5 border border-[var(--surface-border)]">
            <button
              onClick={() => onToggleTheme("light")}
              title="روشن تھیم (Light)"
              className={`p-1.5 rounded-md transition-colors ${
                theme === "light"
                  ? "bg-white text-[#0A3D27] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleTheme("sepia")}
              title="کتابی ورق تھیم (Sepia)"
              className={`px-2 py-0.5 text-xs font-urdu font-bold rounded-md transition-colors ${
                theme === "sepia"
                  ? "bg-[#EADCB8] text-[#2C2214] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              ورق
            </button>
            <button
              onClick={() => onToggleTheme("dark")}
              title="شبینہ تھیم (Dark)"
              className={`p-1.5 rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-[#1E2922] text-[#D4AF37] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Pill */}
          <div
            onClick={() => onNavigate("toc")}
            title={`مطالعہ کی پیش رفت: ${completedCount} از ${totalChapters} ابواب مکمل`}
            className="cursor-pointer hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] border border-[#0A3D27]/20 text-xs font-medium font-sans-ui"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#0A3D27]" />
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
