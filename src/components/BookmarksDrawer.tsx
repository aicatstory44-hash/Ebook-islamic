import React, { useState, useEffect } from "react";
import { getChapterById } from "../data/bookIndex";
import { Bookmark, X, Trash2, BookOpen, Edit3, Save, Download } from "lucide-react";

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: number[];
  onRemoveBookmark: (id: number) => void;
  onSelectChapter: (id: number) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedIds,
  onRemoveBookmark,
  onSelectChapter,
}) => {
  const [notes, setNotes] = useState<{ [chapterId: number]: string }>(() => {
    try {
      const saved = localStorage.getItem("islamic_book_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem("islamic_book_notes", JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  if (!isOpen) return null;

  const handleStartEdit = (id: number) => {
    setEditingId(id);
    setCurrentNoteText(notes[id] || "");
  };

  const handleSaveNote = (id: number) => {
    setNotes((prev) => ({
      ...prev,
      [id]: currentNoteText,
    }));
    setEditingId(null);
  };

  const handleExportNotes = () => {
    let content = `روحانی یادداشتیں — کتاب: اللہ کی طرف واپسی (مصنف: عبدالرشید زاہد)\n\n`;
    bookmarkedIds.forEach((id) => {
      const ch = getChapterById(id);
      content += `-------------------------\nباب ${id}: ${ch?.title}\nنوٹ: ${notes[id] || "کوئی نوٹ نہیں"}\n\n`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "My_Spiritual_Notes_Allah_Ki_Taraf_Wapsi.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--surface)] h-full border-l border-[var(--surface-border)] shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--surface-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#C29B38] fill-[#C29B38]" />
            <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)]">
              محفوظ شدہ ابواب اور نوٹس ({bookmarkedIds.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {bookmarkedIds.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-secondary)] font-urdu">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#C29B38]" />
              <p className="text-base font-bold mb-1">کوئی باب بُک مارک نہیں کیا گیا</p>
              <p className="text-xs">
                مطالعہ کے دوران کسی بھی باب کے اوپر 'بُک مارک' کا بٹن دبا کر اسے یہاں محفوظ کیا جا سکتا ہے۔
              </p>
            </div>
          ) : (
            bookmarkedIds.map((id) => {
              const chapter = getChapterById(id);
              if (!chapter) return null;
              const hasNote = Boolean(notes[id]);

              return (
                <div
                  key={id}
                  className="bg-[var(--surface-hover)] border border-[var(--surface-border)] rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      onClick={() => {
                        onSelectChapter(id);
                        onClose();
                      }}
                      className="cursor-pointer group flex-1"
                    >
                      <span className="text-[10px] font-sans-ui px-2 py-0.5 rounded-md bg-[#0A3D27]/10 text-[var(--brand-emerald)] font-bold">
                        باب {id}
                      </span>
                      <h4 className="text-lg font-bold font-urdu text-[var(--text-primary)] group-hover:text-[var(--brand-emerald)] mt-1">
                        {chapter.title}
                      </h4>
                      <p className="text-xs font-urdu text-[var(--brand-gold)] line-clamp-1">
                        {chapter.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveBookmark(id)}
                      title="بُک مارک سے ہٹائیں"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Notes Section for this bookmark */}
                  <div className="mt-3 pt-3 border-t border-[var(--surface-border)]">
                    {editingId === id ? (
                      <div className="space-y-2">
                        <textarea
                          value={currentNoteText}
                          onChange={(e) => setCurrentNoteText(e.target.value)}
                          placeholder="اس باب سے آپ نے کیا سیکھا؟ اپنا ذاتی تاثر یا دعا لکھیں..."
                          className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] text-xs font-urdu focus:outline-hidden focus:ring-1 focus:ring-[#C29B38]"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2 text-xs font-urdu">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg text-[var(--text-secondary)]"
                          >
                            منسوخ
                          </button>
                          <button
                            onClick={() => handleSaveNote(id)}
                            className="px-3 py-1 rounded-lg bg-[#0A3D27] text-white font-bold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>محفوظ کریں</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 text-xs font-urdu">
                        {hasNote ? (
                          <div className="flex-1 bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--surface-border)] text-[var(--text-primary)]">
                            <strong className="text-[var(--brand-gold)] block mb-1">آپ کی یادداشت:</strong>
                            <p className="whitespace-pre-line">{notes[id]}</p>
                          </div>
                        ) : (
                          <span className="text-[var(--text-secondary)] italic">کوئی ذاتی نوٹ درج نہیں ہے۔</span>
                        )}

                        <button
                          onClick={() => handleStartEdit(id)}
                          className="p-1.5 rounded-lg text-[var(--brand-emerald)] hover:bg-[var(--surface)] shrink-0"
                          title="نوٹ لکھیں / ترمیم کریں"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {bookmarkedIds.length > 0 && (
          <div className="p-4 border-t border-[var(--surface-border)] flex items-center justify-between font-urdu text-xs">
            <button
              onClick={handleExportNotes}
              className="px-4 py-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--surface-border)] font-bold text-[var(--text-primary)] flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-[#C29B38]" />
              <span>نوٹس ڈاؤن لوڈ کریں</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
