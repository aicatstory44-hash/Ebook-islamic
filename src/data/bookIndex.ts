import { Chapter } from "./types";
import { CHAPTERS_1_TO_5 } from "./chapters/ch01_to_ch05";
import { CHAPTERS_6_TO_10 } from "./chapters/ch06_to_ch10";
import { CHAPTERS_11_TO_15 } from "./chapters/ch11_to_ch15";
import { CHAPTERS_16_TO_20 } from "./chapters/ch16_to_ch20";

export * from "./types";
export * from "./bookMeta";
export * from "./finalPages";

export const ALL_CHAPTERS: Chapter[] = [
  ...CHAPTERS_1_TO_5,
  ...CHAPTERS_6_TO_10,
  ...CHAPTERS_11_TO_15,
  ...CHAPTERS_16_TO_20,
];

export function getChapterById(id: number): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.id === id);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.slug === slug || `ch-${c.id}` === slug);
}

export function getNextChapter(currentId: number): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.id === currentId + 1);
}

export function getPreviousChapter(currentId: number): Chapter | undefined {
  return ALL_CHAPTERS.find((c) => c.id === currentId - 1);
}

export interface SearchResult {
  chapterId: number;
  chapterTitle: string;
  snippet: string;
  matchType: "title" | "content" | "verse" | "hadith" | "reflection";
}

export function searchBook(query: string): SearchResult[] {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  const results: SearchResult[] = [];

  for (const chapter of ALL_CHAPTERS) {
    if (chapter.title.toLowerCase().includes(clean) || chapter.subtitle.toLowerCase().includes(clean)) {
      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        snippet: chapter.subtitle,
        matchType: "title",
      });
      continue;
    }

    if (chapter.opening.toLowerCase().includes(clean)) {
      const idx = chapter.opening.toLowerCase().indexOf(clean);
      const start = Math.max(0, idx - 40);
      const snippet = "..." + chapter.opening.slice(start, start + 120) + "...";
      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        snippet,
        matchType: "content",
      });
      continue;
    }

    let found = false;
    for (const sec of chapter.sections) {
      for (const p of sec.content) {
        if (p.toLowerCase().includes(clean)) {
          const idx = p.toLowerCase().indexOf(clean);
          const start = Math.max(0, idx - 40);
          results.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            snippet: "..." + p.slice(start, start + 120) + "...",
            matchType: "content",
          });
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) continue;

    for (const v of chapter.quranVerses) {
      if (v.translation.toLowerCase().includes(clean) || v.arabic.includes(clean)) {
        results.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          snippet: `${v.reference}: ${v.translation.slice(0, 100)}...`,
          matchType: "verse",
        });
        found = true;
        break;
      }
    }
    if (found) continue;

    for (const h of chapter.hadiths) {
      if (h.urdu.toLowerCase().includes(clean) || (h.arabic && h.arabic.includes(clean))) {
        results.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          snippet: `${h.source}: ${h.urdu.slice(0, 100)}...`,
          matchType: "hadith",
        });
        found = true;
        break;
      }
    }
    if (found) continue;

    if (chapter.spiritualReflection.toLowerCase().includes(clean)) {
      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        snippet: chapter.spiritualReflection.slice(0, 100) + "...",
        matchType: "reflection",
      });
    }
  }

  return results;
}
