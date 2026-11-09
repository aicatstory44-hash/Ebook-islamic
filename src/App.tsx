/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { CoverHero } from "./components/CoverHero";
import { ChapterReader } from "./components/ChapterReader";
import { TableOfContents } from "./components/TableOfContents";
import { ActionPlanTracker } from "./components/ActionPlanTracker";
import { DuasAndAdhkarView } from "./components/DuasAndAdhkarView";
import { ReferencesView } from "./components/ReferencesView";
import { FrontMatterViews } from "./components/FrontMatterViews";
import { SearchModal } from "./components/SearchModal";
import { BookmarksDrawer } from "./components/BookmarksDrawer";
import { SpiritualCompanionModal } from "./components/SpiritualCompanionModal";
import {
  ALL_CHAPTERS,
  getChapterById,
  getNextChapter,
  getPreviousChapter,
  BOOK_META,
} from "./data/bookIndex";
import { Heart, Compass, Sparkles, BookOpen, Share2, ArrowUp } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "home" | "chapter" | "toc" | "action-plan" | "duas" | "references" | "dedication" | "author" | "preface"
  >("home");

  const [currentChapterId, setCurrentChapterId] = useState<number>(1);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark" | "sepia">(() => {
    try {
      const saved = localStorage.getItem("islamic_book_theme");
      if (saved === "dark" || saved === "sepia" || saved === "light") return saved;
    } catch {}
    return "light";
  });

  // Font size state
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">(() => {
    try {
      const saved = localStorage.getItem("islamic_book_font_size");
      if (saved === "sm" || saved === "md" || saved === "lg" || saved === "xl") return saved;
    } catch {}
    return "md";
  });

  // Reading progress and bookmarks in localStorage
  const [completedChapterIds, setCompletedChapterIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("islamic_book_completed_chapters");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedChapterIds, setBookmarkedChapterIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("islamic_book_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOpenedChapterId, setLastOpenedChapterId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem("islamic_book_last_chapter");
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Sync theme with body class
  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-sepia");
    if (theme === "dark") {
      document.body.classList.add("theme-dark");
    } else if (theme === "sepia") {
      document.body.classList.add("theme-sepia");
    }
    try {
      localStorage.setItem("islamic_book_theme", theme);
    } catch {}
  }, [theme]);

  // Sync font size with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("islamic_book_font_size", fontSize);
    } catch {}
  }, [fontSize]);

  // Sync completed chapters with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "islamic_book_completed_chapters",
        JSON.stringify(completedChapterIds)
      );
    } catch {}
  }, [completedChapterIds]);

  // Sync bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "islamic_book_bookmarks",
        JSON.stringify(bookmarkedChapterIds)
      );
    } catch {}
  }, [bookmarkedChapterIds]);

  // Sync last opened chapter
  useEffect(() => {
    if (lastOpenedChapterId) {
      try {
        localStorage.setItem("islamic_book_last_chapter", String(lastOpenedChapterId));
      } catch {}
    }
  }, [lastOpenedChapterId]);

  // Listen to hash changes for deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("ch-")) {
        const id = Number(hash.replace("ch-", ""));
        if (!isNaN(id) && id >= 1 && id <= 20) {
          setCurrentChapterId(id);
          setCurrentView("chapter");
          setLastOpenedChapterId(id);
          return;
        }
      }
      if (hash === "toc") setCurrentView("toc");
      else if (hash === "plan" || hash === "action-plan") setCurrentView("action-plan");
      else if (hash === "duas") setCurrentView("duas");
      else if (hash === "references") setCurrentView("references");
      else if (hash === "dedication") setCurrentView("dedication");
      else if (hash === "author") setCurrentView("author");
      else if (hash === "preface") setCurrentView("preface");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const openChapter = (id: number) => {
    setCurrentChapterId(id);
    setCurrentView("chapter");
    setLastOpenedChapterId(id);
    window.location.hash = `ch-${id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (view: string, chapterId?: number) => {
    if (view === "chapter" && chapterId) {
      openChapter(chapterId);
      return;
    }
    setCurrentView(view as any);
    window.location.hash = view === "home" ? "" : view;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeFontSize = (delta: number) => {
    const order: ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"];
    const curIdx = order.indexOf(fontSize);
    const newIdx = Math.max(0, Math.min(order.length - 1, curIdx + delta));
    setFontSize(order[newIdx]);
  };

  const toggleComplete = (id: number) => {
    setCompletedChapterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: number) => {
    setBookmarkedChapterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentChapter = getChapterById(currentChapterId) || ALL_CHAPTERS[0];
  const prevChapter = getPreviousChapter(currentChapterId);
  const nextChapter = getNextChapter(currentChapterId);
  const lastOpenedTitle = lastOpenedChapterId
    ? getChapterById(lastOpenedChapterId)?.title
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Sticky App Header & Reading Controls */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={setTheme}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        completedCount={completedChapterIds.length}
        totalChapters={ALL_CHAPTERS.length}
        bookmarkedCount={bookmarkedChapterIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === "home" && (
          <CoverHero
            onStartReading={() => openChapter(1)}
            onResumeReading={() => openChapter(lastOpenedChapterId || 1)}
            onOpenTOC={() => handleNavigate("toc")}
            onOpenActionPlan={() => handleNavigate("action-plan")}
            onOpenSection={(sec) => handleNavigate(sec)}
            completedCount={completedChapterIds.length}
            totalChapters={ALL_CHAPTERS.length}
            lastOpenedChapterId={lastOpenedChapterId}
            lastOpenedChapterTitle={lastOpenedTitle}
          />
        )}

        {currentView === "chapter" && (
          <ChapterReader
            chapter={currentChapter}
            fontSize={fontSize}
            isCompleted={completedChapterIds.includes(currentChapter.id)}
            isBookmarked={bookmarkedChapterIds.includes(currentChapter.id)}
            onToggleComplete={toggleComplete}
            onToggleBookmark={toggleBookmark}
            onNavigatePrev={prevChapter ? () => openChapter(prevChapter.id) : undefined}
            onNavigateNext={nextChapter ? () => openChapter(nextChapter.id) : undefined}
            onBackToTOC={() => handleNavigate("toc")}
            totalChapters={ALL_CHAPTERS.length}
          />
        )}

        {currentView === "toc" && (
          <TableOfContents
            onSelectChapter={openChapter}
            completedChapterIds={completedChapterIds}
            bookmarkedChapterIds={bookmarkedChapterIds}
            lastOpenedChapterId={lastOpenedChapterId}
          />
        )}

        {currentView === "action-plan" && <ActionPlanTracker />}

        {currentView === "duas" && <DuasAndAdhkarView />}

        {currentView === "references" && <ReferencesView />}

        {(currentView === "dedication" ||
          currentView === "author" ||
          currentView === "preface") && (
          <FrontMatterViews
            type={currentView}
            onNavigateTOC={() => handleNavigate("toc")}
            onStartChapter1={() => openChapter(1)}
          />
        )}
      </main>

      {/* Global Modals and Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={openChapter}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedIds={bookmarkedChapterIds}
        onRemoveBookmark={toggleBookmark}
        onSelectChapter={openChapter}
      />

      <SpiritualCompanionModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        currentChapterTitle={
          currentView === "chapter" ? currentChapter.title : undefined
        }
      />

      {/* Footer */}
      <footer className="mt-16 bg-[var(--surface)] border-t border-[var(--surface-border)] py-12 px-4 sm:px-6 text-center font-urdu">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0A3D27] text-[#FAF7F0] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#C29B38]" />
            </span>
            <span className="text-xl font-bold text-[var(--brand-emerald)]">
              {BOOK_META.title} — {BOOK_META.subtitle}
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-[2.2]">
            مصنف: <strong className="text-[var(--text-primary)]">{BOOK_META.author}</strong> | {BOOK_META.publisher}
            <br />
            "واپس آ جاؤ، تمہارا رب تمہیں جانتا ہے اور اس کی رحمت بہت وسیع ہے۔"
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[var(--brand-emerald)]">
            <button onClick={() => handleNavigate("home")} className="hover:underline">سرورق</button>
            <span>•</span>
            <button onClick={() => handleNavigate("toc")} className="hover:underline">فہرستِ ابواب</button>
            <span>•</span>
            <button onClick={() => handleNavigate("action-plan")} className="hover:underline">30 روزہ منصوبہ</button>
            <span>•</span>
            <button onClick={() => handleNavigate("duas")} className="hover:underline">دعائیں و اذکار</button>
            <span>•</span>
            <button onClick={() => handleNavigate("references")} className="hover:underline">حوالہ جات</button>
            <span>•</span>
            <button onClick={() => setIsAIOpen(true)} className="text-[#C29B38] hover:underline flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>روحانی معاون (AI)</span>
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] opacity-80 pt-4 border-t border-[var(--surface-border)]">
            حقوق اشاعت محفوظ ہیں۔ دینی مقاصد، اصلاحِ امت اور ایصالِ ثواب کے لیے بغیر کسی رد و بدل کے شیئر کرنے کی مکمل اجازت ہے۔
          </p>
        </div>
      </footer>
    </div>
  );
}
