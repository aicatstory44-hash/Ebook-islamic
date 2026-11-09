import React, { useState, useEffect } from "react";
import { Compass, CheckCircle2, Circle, RotateCcw, Printer, Share2, Award, Sparkles } from "lucide-react";

interface ActionDay {
  day: number;
  week: number;
  title: string;
  focus: string;
  tasks: string[];
}

const ACTION_DAYS: ActionDay[] = [
  // Week 1
  { day: 1, week: 1, title: "توبہ اور سچی نیت کا دن", focus: "ماضی سے قطع تعلق اور نئے آغاز کا عزم", tasks: ["غسل کر کے دو رکعت صلاۃ التوبہ پڑھیں", "100 بار استغفار کریں", "رات کو موبائل فون دوسرے کمرے میں رکھ کر سوئیں"] },
  { day: 2, week: 1, title: "نمازِ فجر کا احیاء", focus: "دن کا آغاز اللہ کی حفاظت میں", tasks: ["فجر کی نماز وقت پر ادا کریں (مرد مسجد میں)", "نماز کے بعد 10 منٹ مصلے پر بیٹھ کر ذکر کریں", "والدین کے چہرے کو محبت سے دیکھ کر مسکرائیں"] },
  { day: 3, week: 1, title: "زبان کی پاکیزگی", focus: "خاموشی میں سلامتی ہے", tasks: ["آج پورا دن جھوٹ، غیبت اور بحث سے پرہیز کریں", "اگر منہ سے غلط بات نکلے تو 50 روپے صدقہ کریں", "دن بھر کلمہ طیبہ کا ورد جاری رکھیں"] },
  { day: 4, week: 1, title: "پانچوں نمازیں وقت پر", focus: "نماز مومن کا ستون ہے", tasks: ["اذان سنتے ہی تمام کام چھوڑ کر وضو بنائیں", "ظہر، عصر، مغرب اور عشاء کو اول وقت میں پڑھیں", "ہر نماز کے بعد آیۃ الکرسی پڑھیں"] },
  { day: 5, week: 1, title: "اسکرین ٹائم کی قربانی", focus: "آنکھوں اور دماغ کی آزادی", tasks: ["سوشل میڈیا اور شارٹس/ریلز کا استعمال بند رکھیں", "فالتو وقت میں استغفار یا ترجمہ قرآن پڑھیں", "اہل خانہ کے ساتھ بیٹھ کر وقت گزاریں"] },
  { day: 6, week: 1, title: "حقوق العباد کی ادائیگی", focus: "دلوں کا بوجھ ہلکا کرنا", tasks: ["اگر کسی کا دل دکھایا ہے تو فون کر کے معافی مانگیں", "اگر کسی کا ادھار باقی ہے تو ادا کریں یا مہلت مانگیں", "کسی ضرورت مند کو خاموشی سے کچھ صدقہ دیں"] },
  { day: 7, week: 1, title: "ہفتہ اول کا جائزہ اور شکرانہ", focus: "پہلے مرحلے کی تکمیل", tasks: ["پچھلے 6 دنوں کی کارکردگی کا مخلصانہ جائزہ لیں", "شکرانے کے دو رکعت نفل ادا کریں", "ہفتہ دوم کے لیے عزمِ صمیم کریں"] },

  // Week 2
  { day: 8, week: 2, title: "قرآن سے مصافحہ", focus: "آسمانی کلام کی محبت", tasks: ["قرآنِ مجید کی ایک رکوع تلاوت ترجمے کے ساتھ کریں", "اس آیت کے مفہوم پر 5 منٹ غور و فکر کریں", "صبح و شام کی مسنون حفاظت کی دعائیں پڑھیں"] },
  { day: 9, week: 2, title: "نظروں کی حفاظت کا پہرہ", focus: "حیا ایمان کا حصہ ہے", tasks: ["سوشل میڈیا اور بازار میں نگاہیں نیچی رکھیں", "نازیبا مواد کا خیال آتے ہی 'اعوذ باللہ' پڑھیں", "سچے باحیا نوجوانوں کے واقعات پڑھیں"] },
  { day: 10, week: 2, title: "والدین کی خصوصی خدمت", focus: "جنت کے دروازے کو چومنا", tasks: ["والدین کے ہاتھ یا پاؤں دبائیں", "ان کے لیے کوئی پسندیدہ کھانا یا تحفہ لائیں", "ان سے اپنے حق میں دلی دعائیں لیں"] },
  { day: 11, week: 2, title: "سورۃ الملک کی عادت", focus: "عذابِ قبر سے ڈھال", tasks: ["عشاء کے بعد یا سونے سے قبل سورۃ الملک پڑھیں", "اس کا اردو ترجمہ سمجھیں", "سونے کے مسنون اذکار ادا کریں"] },
  { day: 12, week: 2, title: "صلہ رحمی کا دن", focus: "رشتوں کو اللہ کی خاطر جوڑنا", tasks: ["کسی ایسے رشتہ دار سے رابطہ کریں جس سے دوری ہو", "ان کی خیریت دریافت کریں اور اچھے الفاظ کہیں", "نفرت اور پرانے شکوے مٹا دیں"] },
  { day: 13, week: 2, title: "حلال لقمے کی تصدیق", focus: "شکم کی پاکیزگی", tasks: ["اپنی کمائی اور کھانے پینے کا دیانت دارانہ جائزہ لیں", "کسی بھی مشتبہ چیز کو ترک کرنے کا فیصلہ کریں", "دعائے استغفار برائے حلال رزق مانگیں"] },
  { day: 14, week: 2, title: "ہفتہ دوم کا شکرانہ", focus: "باطنی نور کی افزائش", tasks: ["دو رکعت نفل شکرانہ ادا کریں", "اپنے باطن میں سکون اور تبدیلی کو محسوس کریں", "آئندہ ہفتے کے لیے تیاری کریں"] },

  // Week 3
  { day: 15, week: 3, title: "پہلی صلاۃ التہجد", focus: "رب سے خلوت کا سحر انگیز لمحہ", tasks: ["فجر کی اذان سے 25 منٹ پہلے اٹھیں", "وضو کر کے 2 یا 4 رکعت تہجد ادا کریں", "سجدے میں رو رو کر اپنے رب سے فریاد کریں"] },
  { day: 16, week: 3, title: "درودِ پاک کا سمندر", focus: "نبی کریم ﷺ سے سچی محبت", tasks: ["دن بھر میں کم از کم 300 مرتبہ درودِ پاک پڑھیں", "جمعہ کے دن کی مسنون سنتیں ادا کریں", "سورۃ الکہف کی تلاوت کریں"] },
  { day: 17, week: 3, title: "خفیہ صدقہ (صدقۃ السر)", focus: "ریاکاری سے پاک نیکی", tasks: ["اس طرح کسی غریب کی مدد کریں کہ بائیں ہاتھ کو خبر نہ ہو", "کسی بھوکے کو کھانا کھلائیں یا پرندوں کے لیے دانہ پانی رکھیں", "اللہ سے اخلاص کی دعا مانگیں"] },
  { day: 18, week: 3, title: "دل کی صفائی (حسد و کینہ کا خاتمہ)", focus: "قلبِ سلیم کی تیاری", tasks: ["جس شخص سے آپ کو رنجش ہو اس کے لیے غائبانہ دعا مانگیں", "اپنے دل کو تمام مسلمانوں کے لیے صاف کریں", "کہیں: یا اللہ! میں نے سب کو معاف کیا، تو مجھے معاف فرما"] },
  { day: 19, week: 3, title: "سنتِ مؤکدہ کی پابندی", focus: "فرائض کے گرد حفاظتی باڑ", tasks: ["فجر، ظہر، مغرب اور عشاء کی تمام سنتیں ذوق سے پڑھیں", "نماز میں جلدی بازی نہ کریں، اطمینان سے رکوع و سجود کریں", "تسبیح فاطمہ ہر نماز کے بعد پڑھیں"] },
  { day: 20, week: 3, title: "دوسری صلاۃ التہجد", focus: "عرشِ الٰہی پر پکار", tasks: ["فجر سے پہلے اٹھ کر تنہائی میں مناجات کریں", "اپنے گناہوں کی ایک ایک کر کے یاد پر توبہ کریں", "امتِ مسلمہ کے مظلوموں کے لیے گڑگڑائیں"] },
  { day: 21, week: 3, title: "ہفتہ سوم کا اختتام", focus: "قربِ الٰہی کے زینے", tasks: ["تین ہفتوں کی برکات کا شکر ادا کریں", "اپنی نیکیوں کو سنبھال کر رکھنے کی دعا مانگیں", "آخری اور فائنل ہفتے کا آغاز کریں"] },

  // Week 4
  { day: 22, week: 4, title: "پیر یا جمعرات کا نفلی روزہ", focus: "نفس کی سرکشی کو کچلنا", tasks: ["اللہ کی رضا اور شکرانے کی نیت سے روزہ رکھیں", "افطار کے وقت دعاؤں کا خاص اہتمام کریں", "کسی دوسرے روزہ دار کے افطار کا بندوبست کریں"] },
  { day: 23, week: 4, title: "حسنِ اخلاق کا مظاہرہ", focus: "کردار کی خوشبو", tasks: ["ہر ملنے والے سے گرمجوشی اور مسکراہٹ کے ساتھ پیش آئیں", "اگر کوئی غصہ دلائے تو خاموشی سے مسکرا کر پی جائیں", "گھر والوں کی کسی غلطی کو نظر انداز کر کے نرمی دکھائیں"] },
  { day: 24, week: 4, title: "دعوتِ دین اور خیر خواہی", focus: "دوسروں کو بھی روشنی دکھانا", tasks: ["کسی دوست یا عزیز کو پیار سے نماز یا اچھے کام کی ترغیب دیں", "اس کتاب کا کوئی سبق اپنے پیاروں کے ساتھ شیئر کریں", "کسی مایوس انسان کو اللہ کی رحمت کا یقین دلائیں"] },
  { day: 25, week: 4, title: "موت کی یاد اور وصیت کا ادراک", focus: "فانی دنیا سے بیداری", tasks: ["قبرستان کا دورہ کریں یا اپنی موت کا چشمِ تصور میں مشاہدہ کریں", "سوچیں کہ اگر آج آخری دن ہو تو میں کیا کروں گا؟", "اپنے دینی معاملات کو صاف رکھیں"] },
  { day: 26, week: 4, title: "تیسری صلاۃ التہجد", focus: "سفرِ ہجرت کی معراج", tasks: ["رات کے سناٹے میں اللہ کے دربار میں حاضری دیں", "سید الاستغفار کو سچے دل سے بار بار پڑھیں", "حسنِ خاتمہ اور جنت الفردوس کا سوال کریں"] },
  { day: 27, week: 4, title: "تسبیحاتِ یومیہ کی استقامت", focus: "ذکرِ الٰہی دل کی غذا ہے", tasks: ["100 بار سبحان اللہ وبحمدہ سبحان اللہ العظیم", "100 بار لا حول ولا قوۃ الا باللہ", "100 بار استغفار اور 100 بار درود شریف"] },
  { day: 28, week: 4, title: "تمام نیکیوں کی حفاظت", focus: "عُجب اور فخر سے بچاؤ", tasks: ["یہ نہ سوچیں کہ میں بڑا متقی بن گیا ہوں", "عاجزی اختیار کریں اور اللہ سے قبولیت کی بھیک مانگیں", "کہیں: یا اللہ یہ تیرا ہی فضل تھا، میرا کوئی کمال نہیں"] },
  { day: 29, week: 4, title: "جامع دعا کا دن", focus: "کشکول پھیلانے کا وقت", tasks: ["اس کتاب کے آخر میں دی گئی جامع دعا پڑھیں", "اپنے والدین، اساتذہ، اور مصنف کے لیے دعا مانگیں", "اپنی زندگی کے مستقبل کا دینی خاکہ تیار کریں"] },
  { day: 30, week: 4, title: "یومِ تجدید و استقامت — مبارکباد!", focus: "ایک نئی پاکیزہ زندگی کا آغاز", tasks: ["شکرانے کے دو رکعت نفل ادا کریں", "ساری زندگی اس روش پر قائم رہنے کا سچا عہد کریں", "اللہ کے راستے پر ہمیشہ آگے بڑھتے رہنے کا پختہ ارادہ کریں"] },
];

export const ActionPlanTracker: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("islamic_book_action_days");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeWeek, setActiveWeek] = useState<number>(1);

  useEffect(() => {
    try {
      localStorage.setItem("islamic_book_action_days", JSON.stringify(completedDays));
    } catch {
      // ignore
    }
  }, [completedDays]);

  const toggleDay = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleReset = () => {
    if (confirm("کیا آپ واقعی تمام 30 دنوں کی پروگریس ری سیٹ کرنا چاہتے ہیں؟")) {
      setCompletedDays([]);
    }
  };

  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  const currentWeekDays = ACTION_DAYS.filter((d) => d.week === activeWeek);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A3D27]/10 text-[var(--brand-emerald)] border border-[#0A3D27]/20 font-urdu font-bold text-sm mb-4">
          <Compass className="w-4 h-4 text-[#C29B38]" />
          <span>باب 19 کا خصوصی تربیتی چارٹ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-urdu text-[var(--brand-emerald)] mb-3">
          اللہ کے قریب ہونے کا 30 روزہ عملی منصوبہ
        </h1>
        <p className="text-base sm:text-lg font-urdu text-[var(--text-secondary)] max-w-2xl mx-auto">
          یہ 30 دن آپ کی عادات، باطن، اور زندگی کو بدل سکتے ہیں۔ ہر روز کے اہداف مکمل کرنے کے بعد چیک باکس پر ٹک لگائیں۔
        </p>
      </div>

      {/* Progress & Milestone Card */}
      <div className="bg-[var(--surface)] border-2 border-[var(--surface-border)] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#C29B38]" />
              <h3 className="text-xl font-bold font-urdu text-[var(--text-primary)]">
                آپ کے روحانی چیلنج کی پیش رفت
              </h3>
            </div>
            <p className="text-sm font-urdu text-[var(--text-secondary)] mt-1">
              30 میں سے {completedCount} دن مکمل ہو چکے ہیں ({progressPercent}%)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="پرنٹ کریں"
              className="px-3 py-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--surface-border)] text-xs font-urdu font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>پرنٹ چارٹ</span>
            </button>
            <button
              onClick={handleReset}
              title="دوبارہ شروع کریں"
              className="px-3 py-2 rounded-xl bg-[var(--surface-hover)] border border-[var(--surface-border)] text-xs font-urdu text-red-600 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ری سیٹ</span>
            </button>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-[var(--surface-border)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0A3D27] via-[#C29B38] to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {completedCount === 30 && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-center font-urdu font-bold text-base flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>ماشاءاللہ! آپ نے 30 روزہ روحانی سفر کامیابی سے مکمل کر لیا ہے۔ اللہ آپ کی استقامت میں برکت فرمائے!</span>
          </div>
        )}
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2 font-urdu">
        {[1, 2, 3, 4].map((w) => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all border ${
              activeWeek === w
                ? "bg-[#0A3D27] text-white border-[#0A3D27] shadow-sm"
                : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
            }`}
          >
            {w === 1 && "ہفتہ 1: بنیاد کی صفائی"}
            {w === 2 && "ہفتہ 2: قرآن و باطن"}
            {w === 3 && "ہفتہ 3: تہجد و نوافل"}
            {w === 4 && "ہفتہ 4: اخلاق و استقامت"}
          </button>
        ))}
      </div>

      {/* Days List for Active Week */}
      <div className="space-y-4">
        {currentWeekDays.map((item) => {
          const isDone = completedDays.includes(item.day);

          return (
            <div
              key={item.day}
              onClick={() => toggleDay(item.day)}
              className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition-all ${
                isDone
                  ? "bg-emerald-500/8 border-emerald-500/40 shadow-xs"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-[var(--surface-border)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-6 h-6 text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#0A3D27]/10 text-[var(--brand-emerald)] font-sans-ui text-xs font-bold">
                        دن {item.day}
                      </span>
                      <h3 className={`text-lg sm:text-xl font-bold font-urdu ${isDone ? "text-emerald-800 line-through opacity-80" : "text-[var(--text-primary)]"}`}>
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm font-urdu text-[var(--brand-gold)] font-medium mb-3">
                      مرکزی ہدف: {item.focus}
                    </p>

                    <ul className="space-y-1.5 text-xs sm:text-sm font-urdu text-[var(--text-secondary)]">
                      {item.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C29B38]" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="shrink-0 text-xs font-urdu font-bold">
                  {isDone ? (
                    <span className="text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                      مکمل
                    </span>
                  ) : (
                    <span className="text-[var(--text-secondary)] bg-[var(--surface-hover)] px-3 py-1 rounded-full">
                      باقی
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
