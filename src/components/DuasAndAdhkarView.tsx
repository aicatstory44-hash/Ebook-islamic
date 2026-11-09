import React, { useState } from "react";
import { COMPREHENSIVE_DUA, TAWBAH_DUAS, DAILY_ADHKAR, Supplication } from "../data/finalPages";
import { Copy, Check, Heart, Sparkles, Volume2, Printer, Plus, RotateCcw } from "lucide-react";

export const DuasAndAdhkarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"comprehensive" | "tawbah" | "adhkar">("comprehensive");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [adhkarCounters, setAdhkarCounters] = useState<{ [key: number]: number }>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const incrementCounter = (idx: number) => {
    setAdhkarCounters((prev) => ({
      ...prev,
      [idx]: (prev[idx] || 0) + 1,
    }));
  };

  const resetCounter = (idx: number) => {
    setAdhkarCounters((prev) => ({
      ...prev,
      [idx]: 0,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] border border-[#0A3D27]/20 font-urdu font-bold text-sm mb-3">
          کتاب: اللہ کی طرف واپسی
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] mb-3">
          مسنون دعائیں، استغفار اور روزانہ کے اذکار
        </h1>
        <p className="text-base sm:text-lg font-urdu text-[var(--text-secondary)] max-w-2xl mx-auto">
          قرآن و سنت کی مستند اور پرتاثیر دعائیں جو دل کو سکون، گناہوں کی معافی اور اللہ کی حفاظت عطا کرتی ہیں۔
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mt-8 font-urdu">
          <button
            onClick={() => setActiveTab("comprehensive")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all border ${
              activeTab === "comprehensive"
                ? "bg-[#0A3D27] text-white border-[#0A3D27] shadow-sm"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
            }`}
          >
            جامع رقت آمیز دعا
          </button>
          <button
            onClick={() => setActiveTab("tawbah")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all border ${
              activeTab === "tawbah"
                ? "bg-[#0A3D27] text-white border-[#0A3D27] shadow-sm"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
            }`}
          >
            توبہ و استغفار کی دعائیں
          </button>
          <button
            onClick={() => setActiveTab("adhkar")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all border ${
              activeTab === "adhkar"
                ? "bg-[#0A3D27] text-white border-[#0A3D27] shadow-sm"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
            }`}
          >
            صبح و شام کے اذکار
          </button>
        </div>
      </div>

      {/* Tab 1: Comprehensive Heartfelt Dua */}
      {activeTab === "comprehensive" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#0A3D27] via-[#0E472E] to-[#14532D] text-[#FAF7F0] rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-[#C29B38]/50 text-center relative">
            <button
              onClick={() => {
                const fullDuaText = `${COMPREHENSIVE_DUA.arabicOpening}\n\n` + COMPREHENSIVE_DUA.sections.map(s => `${s.title}:\n${s.content}`).join("\n\n");
                handleCopy(fullDuaText, "comp-all");
              }}
              title="پوری دعا کاپی کریں"
              className="absolute top-6 left-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              {copiedKey === "comp-all" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <span className="text-3xl mb-3 block">🤲</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-urdu text-[#D4AF37] mb-4">
              {COMPREHENSIVE_DUA.title}
            </h2>
            <p className="font-quran text-2xl sm:text-3xl leading-[2.2] text-[#F4E8C1] max-w-2xl mx-auto mb-4">
              {COMPREHENSIVE_DUA.arabicOpening}
            </p>
            <div className="w-24 h-0.5 bg-[#C29B38] mx-auto" />
          </div>

          <div className="space-y-6">
            {COMPREHENSIVE_DUA.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 sm:p-8 shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)]">
                    {sec.title}
                  </h3>
                  <button
                    onClick={() => handleCopy(sec.content, `sec-${idx}`)}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    title="کاپی کریں"
                  >
                    {copiedKey === `sec-${idx}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="font-urdu text-base sm:text-lg text-[var(--text-primary)] leading-[2.4] whitespace-pre-line urdu-reading-text">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Authentic Repentance Duas */}
      {activeTab === "tawbah" && (
        <div className="space-y-6">
          {TAWBAH_DUAS.map((dua, idx) => (
            <div
              key={idx}
              className="bg-[var(--surface)] border-2 border-[var(--surface-border)] rounded-2xl p-6 sm:p-8 relative shadow-xs hover:border-[#C29B38] transition-colors"
            >
              <button
                onClick={() =>
                  handleCopy(`${dua.arabic}\n\n${dua.urduTranslation}\n(${dua.source})`, `tawbah-${idx}`)
                }
                title="کاپی کریں"
                className="absolute top-4 left-4 p-2 rounded-lg bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {copiedKey === `tawbah-${idx}` ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)] mb-4 pl-10">
                {dua.title}
              </h3>

              <p className="font-quran text-2xl sm:text-3xl text-right text-[var(--brand-emerald)] leading-[2.2] mb-4">
                {dua.arabic}
              </p>

              <div className="pt-4 border-t border-[var(--surface-border)]">
                <p className="font-urdu text-base sm:text-lg text-[var(--text-primary)] leading-[2.2]">
                  <strong className="text-[var(--brand-gold)]">ترجمہ: </strong>
                  {dua.urduTranslation}
                </p>
              </div>

              {dua.virtue && (
                <div className="mt-4 p-3 rounded-xl bg-[#0A3D27]/5 border-r-3 border-[#0A3D27] text-xs font-urdu text-[var(--text-secondary)]">
                  <strong>فضیلت: </strong>{dua.virtue}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <span className="px-3 py-1 rounded-md bg-[#C29B38]/15 text-[#916F1E] font-urdu text-xs font-bold">
                  حوالہ: {dua.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Daily Adhkar with Interactive Counters */}
      {activeTab === "adhkar" && (
        <div className="space-y-6">
          {DAILY_ADHKAR.map((adhkar, idx) => {
            const count = adhkarCounters[idx] || 0;
            return (
              <div
                key={idx}
                className="bg-[var(--surface)] border-2 border-[var(--surface-border)] rounded-2xl p-6 sm:p-8 relative shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-urdu text-[var(--brand-emerald)]">
                    {adhkar.title}
                  </h3>

                  {/* Interactive Tasbeeh Counter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => incrementCounter(idx)}
                      className="px-4 py-1.5 rounded-xl bg-[#0A3D27] text-[#F4E8C1] font-sans-ui font-bold text-sm flex items-center gap-1.5 hover:bg-[#14532D] active:scale-95 transition-all shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>تسبیح: {count}</span>
                    </button>
                    {count > 0 && (
                      <button
                        onClick={() => resetCounter(idx)}
                        title="کاؤنٹر ری سیٹ کریں"
                        className="p-2 rounded-xl bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="font-quran text-2xl sm:text-3xl text-right text-[var(--brand-emerald)] leading-[2.2] mb-4">
                  {adhkar.arabic}
                </p>

                <div className="pt-4 border-t border-[var(--surface-border)]">
                  <p className="font-urdu text-base sm:text-lg text-[var(--text-primary)] leading-[2.2]">
                    <strong className="text-[var(--brand-gold)]">ترجمہ: </strong>
                    {adhkar.urduTranslation}
                  </p>
                </div>

                {adhkar.virtue && (
                  <div className="mt-4 p-3 rounded-xl bg-[#0A3D27]/5 border-r-3 border-[#0A3D27] text-xs font-urdu text-[var(--text-secondary)]">
                    <strong>فضیلت: </strong>{adhkar.virtue}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() =>
                      handleCopy(`${adhkar.arabic}\n\n${adhkar.urduTranslation}\n(${adhkar.source})`, `adhkar-${idx}`)
                    }
                    className="text-xs font-urdu text-[var(--brand-gold)] font-bold flex items-center gap-1"
                  >
                    {copiedKey === `adhkar-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>متن کاپی کریں</span>
                  </button>

                  <span className="px-3 py-1 rounded-md bg-[#C29B38]/15 text-[#916F1E] font-urdu text-xs font-bold">
                    حوالہ: {adhkar.source}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
