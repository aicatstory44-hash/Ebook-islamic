import React from "react";
import { BOOK_REFERENCES, AUTHOR_CLOSING_NOTE } from "../data/finalPages";
import { BookMarked, Feather, ShieldCheck, Heart } from "lucide-react";

export const ReferencesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] border border-[#0A3D27]/20 font-urdu font-bold text-sm mb-3">
          کتاب: اللہ کی طرف واپسی
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] mb-3">
          قرآن و حدیث کے مآخذ اور مستند حوالہ جات
        </h1>
        <p className="text-base sm:text-lg font-urdu text-[var(--text-secondary)] max-w-2xl mx-auto">
          اس کتاب میں پیش کی گئی تمام آیاتِ قرآنیہ اور احادیثِ نبویہ صحیح، متفق علیہ اور مستند مصادر سے اخذ کی گئی ہیں۔
        </p>
      </div>

      {/* References Grid */}
      <div className="space-y-4 mb-16">
        {BOOK_REFERENCES.map((ref, idx) => (
          <div
            key={idx}
            className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 shadow-xs hover:border-[#C29B38] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-[#C29B38]" />
                <h3 className="text-xl font-bold font-urdu text-[var(--text-primary)]">
                  {ref.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] text-xs font-urdu font-bold">
                {ref.category}
              </span>
            </div>

            <p className="text-sm font-urdu font-semibold text-[var(--brand-gold)] mb-2">
              مؤلف / جمع کنندہ: {ref.author}
            </p>

            <p className="text-xs sm:text-sm font-urdu text-[var(--text-secondary)] leading-[2.1]">
              {ref.description}
            </p>
          </div>
        ))}
      </div>

      {/* Author's Closing Message Card */}
      <div className="bg-gradient-to-br from-[#0A3D27] via-[#0E472E] to-[#14532D] text-[#FAF7F0] rounded-3xl p-8 sm:p-12 shadow-xl border-2 border-[#C29B38]/50">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0]/10 text-[#C29B38] flex items-center justify-center mx-auto mb-6">
          <Feather className="w-7 h-7" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold font-urdu text-[#D4AF37] text-center mb-2">
          {AUTHOR_CLOSING_NOTE.title}
        </h2>
        <p className="text-center font-urdu text-lg text-[#F4E8C1] font-bold mb-6">
          از: {AUTHOR_CLOSING_NOTE.author}
        </p>

        <div className="w-24 h-1 bg-[#C29B38] mx-auto mb-8" />

        <div className="font-urdu text-base sm:text-lg text-[#FAF7F0] leading-[2.5] whitespace-pre-line urdu-reading-text">
          {AUTHOR_CLOSING_NOTE.content}
        </div>

        <div className="mt-8 pt-6 border-t border-[#C29B38]/30 flex items-center justify-center gap-2 text-xs font-urdu text-[#F4E8C1]">
          <ShieldCheck className="w-4 h-4 text-[#C29B38]" />
          <span>تمام دینی اور فقہی مسائل میں جید علماء و مفتیانِ کرام سے رجوع فرمائیں۔</span>
        </div>
      </div>
    </div>
  );
};
