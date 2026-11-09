export interface QuranVerse {
  arabic: string;
  translation: string;
  reference: string;
}

export interface HadithNarrative {
  arabic?: string;
  urdu: string;
  source: string;
}

export interface Chapter {
  id: number;
  slug: string;
  pageNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  opening: string;
  sections: {
    heading: string;
    content: string[];
  }[];
  quranVerses: QuranVerse[];
  hadiths: HadithNarrative[];
  realLifeExample: {
    title: string;
    story: string;
    lesson: string;
  };
  spiritualReflection: string;
  practicalSteps: string[];
  reflectionQuestions: string[];
  closingDua: {
    arabic: string;
    translation: string;
    transliteration?: string;
  };
}

export interface Supplication {
  title: string;
  arabic: string;
  urduTranslation: string;
  source: string;
  virtue?: string;
  category: 'tawbah' | 'morning' | 'evening' | 'comprehensive';
}

export interface BookReference {
  category: string;
  title: string;
  author: string;
  description: string;
}
