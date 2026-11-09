import fs from "fs";
import path from "path";
import { ALL_CHAPTERS, BOOK_META, DEDICATION, AUTHORS_MESSAGE, PREFACE, COMPREHENSIVE_DUA, TAWBAH_DUAS, DAILY_ADHKAR, BOOK_REFERENCES, AUTHOR_CLOSING_NOTE } from "../src/data/bookIndex";

const outDir = path.resolve(process.cwd(), "public/Allah-Ki-Taraf-Wapsi");
const pagesDir = path.join(outDir, "pages");
const assetsDir = path.join(outDir, "assets/images");

fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

// Shared CSS
const sharedCss = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Outfit:wght@400;500;600;700&display=swap');

:root {
  --bg-page: #FAF7F0;
  --text-primary: #1C2B21;
  --text-secondary: #4A5B50;
  --surface: #FFFFFF;
  --surface-hover: #F3EFE6;
  --surface-border: #E6DFC5;
  --brand-emerald: #0A3D27;
  --brand-gold: #C29B38;
}

body.dark-mode {
  --bg-page: #0C1511;
  --text-primary: #EDE8D8;
  --text-secondary: #9EB0A4;
  --surface: #15211B;
  --surface-hover: #1B2C24;
  --surface-border: #23382D;
  --brand-emerald: #14532D;
  --brand-gold: #D4AF37;
}

body.sepia-mode {
  --bg-page: #F4ECD8;
  --text-primary: #2C2214;
  --text-secondary: #5C4A32;
  --surface: #FCF7ED;
  --surface-hover: #EFE4CC;
  --surface-border: #DFD0B0;
  --brand-emerald: #1B4332;
  --brand-gold: #B8860B;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-page);
  color: var(--text-primary);
  font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
  line-height: 2.4;
  direction: rtl;
  text-align: right;
  transition: background-color 0.2s, color 0.2s;
}

.font-quran {
  font-family: 'Amiri', 'Traditional Arabic', serif;
  line-height: 2.2;
}

.font-sans {
  font-family: 'Outfit', sans-serif;
}

.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* Header & Nav */
header.site-header {
  position: sticky;
  top: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--surface-border);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.nav-links a {
  margin-left: 16px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}
.nav-links a:hover { color: var(--brand-emerald); }

.reading-controls button {
  background: var(--surface-hover);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  margin-right: 6px;
}

/* Reading Layout */
.chapter-box {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 20px;
  padding: 32px 28px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.quran-box {
  background: var(--surface);
  border: 2px solid var(--brand-gold);
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
}
.quran-arabic {
  font-size: 26px;
  color: var(--brand-emerald);
  margin-bottom: 12px;
}
.quran-trans {
  font-size: 17px;
  color: var(--text-primary);
}
.quran-ref {
  display: inline-block;
  background: rgba(10, 61, 39, 0.1);
  color: var(--brand-emerald);
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 8px;
}

.hadith-box {
  background: var(--surface-hover);
  border-right: 4px solid var(--brand-gold);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.story-box {
  background: rgba(194, 155, 56, 0.08);
  border-radius: 16px;
  padding: 24px;
  margin: 20px 0;
}

.dua-box {
  background: var(--brand-emerald);
  color: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
}
.dua-box .quran-arabic { color: #F4E8C1; }
.dua-box .quran-trans { color: #FAF7F0; }

.page-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--surface-border);
}
.btn-nav {
  background: var(--brand-emerald);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}
.btn-nav:hover { opacity: 0.9; }

footer.site-footer {
  text-align: center;
  padding: 30px;
  border-top: 1px solid var(--surface-border);
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 40px;
}
`;

fs.writeFileSync(path.join(outDir, "style.css"), sharedCss.trim());

// Shared JS
const sharedJs = `
function toggleTheme(mode) {
  document.body.classList.remove('dark-mode', 'sepia-mode');
  if (mode === 'dark') document.body.classList.add('dark-mode');
  if (mode === 'sepia') document.body.classList.add('sepia-mode');
  localStorage.setItem('ebook_theme', mode);
}

function adjustFontSize(delta) {
  const currentSize = parseFloat(getComputedStyle(document.body).fontSize) || 16;
  const newSize = Math.max(14, Math.min(26, currentSize + delta));
  document.body.style.fontSize = newSize + 'px';
  localStorage.setItem('ebook_font_size', newSize);
}

function markCompleted(chapterId) {
  let completed = JSON.parse(localStorage.getItem('ebook_completed') || '[]');
  if (!completed.includes(chapterId)) {
    completed.push(chapterId);
    localStorage.setItem('ebook_completed', JSON.stringify(completed));
    alert('ماشاءاللہ! یہ باب مکمل نشان زد ہو گیا ہے۔');
  }
}

function saveLastRead(chapterId) {
  localStorage.setItem('ebook_last_chapter', chapterId);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('ebook_theme');
  if (savedTheme) toggleTheme(savedTheme);

  const savedFontSize = localStorage.getItem('ebook_font_size');
  if (savedFontSize) document.body.style.fontSize = savedFontSize + 'px';
});
`;

fs.writeFileSync(path.join(outDir, "script.js"), sharedJs.trim());

function createHeaderHtml(currentPath: string) {
  const isPage = currentPath.includes("pages/");
  const rootPrefix = isPage ? "../" : "./";

  return `
  <header class="site-header">
    <div style="display:flex; align-items:center; gap:10px;">
      <a href="${rootPrefix}index.html" style="font-weight:bold; font-size:18px; color:var(--brand-emerald); text-decoration:none;">
        📖 اللہ کی طرف واپسی
      </a>
      <span style="font-size:12px; color:var(--text-secondary);">عبدالرشید زاہد</span>
    </div>

    <nav class="nav-links">
      <a href="${rootPrefix}index.html">سرورق</a>
      <a href="${rootPrefix}pages/p00.html">فہرستِ ابواب</a>
      <a href="${rootPrefix}pages/dua.html">دعائیں</a>
      <a href="${rootPrefix}pages/references.html">حوالہ جات</a>
    </nav>

    <div class="reading-controls">
      <button onclick="adjustFontSize(-1)">A-</button>
      <button onclick="adjustFontSize(1)">A+</button>
      <button onclick="toggleTheme('light')">روشن</button>
      <button onclick="toggleTheme('sepia')">ورق</button>
      <button onclick="toggleTheme('dark')">شبینہ</button>
    </div>
  </header>
  `;
}

function createFooterHtml() {
  return `
  <footer class="site-footer">
    <p><strong>اللہ کی طرف واپسی — دل سے رب تک: ایک روحانی سفر</strong></p>
    <p>مصنف: عبدالرشید زاہد | مکتبۂ روحانیات</p>
    <p style="margin-top:8px; opacity:0.8; font-size:11px;">حقوق اشاعت محفوظ ہیں۔ دینی مقاصد کے لیے بلا رد و بدل اشاعت کی مکمل اجازت ہے۔</p>
  </footer>
  `;
}

// Generate Homepage index.html
const homeHtml = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BOOK_META.title} — ${BOOK_META.subtitle} | ${BOOK_META.author}</title>
  <link rel="stylesheet" href="./style.css">
  <script src="./script.js"></script>
</head>
<body>
  ${createHeaderHtml("index.html")}

  <div class="container" style="text-align:center; padding-top:40px;">
    <div style="background:var(--brand-emerald); color:#fff; border-radius:24px; padding:48px 24px; border:3px solid var(--brand-gold); margin-bottom:32px;">
      <p class="font-quran" style="font-size:24px; color:#F4E8C1; margin-bottom:12px;">${BOOK_META.openingBismillah}</p>
      <h1 style="font-size:48px; line-height:1.5; margin-bottom:10px;">${BOOK_META.title}</h1>
      <p style="font-size:22px; color:#D4AF37; margin-bottom:24px;">${BOOK_META.subtitle}</p>
      <p style="font-size:16px; opacity:0.9; max-width:600px; margin:0 auto 28px;">
        ${BOOK_META.description}
      </p>

      <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
        <a href="./pages/p01.html" class="btn-nav" style="background:#C29B38; color:#0A3D27; font-size:16px; padding:12px 24px;">کتاب شروع کریں (باب 1)</a>
        <a href="./pages/p00.html" class="btn-nav" style="background:#061F13; border:1px solid #C29B38; font-size:16px; padding:12px 24px;">فہرستِ ابواب (20 ابواب)</a>
        <a href="./pages/dua.html" class="btn-nav" style="background:#061F13; border:1px solid #C29B38; font-size:16px; padding:12px 24px;">جامع دعائیں</a>
      </div>
    </div>

    <!-- Book Info Card -->
    <div class="chapter-box" style="text-align:right;">
      <h2 style="color:var(--brand-emerald); margin-bottom:16px;">معلوماتِ کتاب</h2>
      <ul style="list-style:none; line-height:2.2;">
        <li>✍️ <strong>مصنف:</strong> ${BOOK_META.author}</li>
        <li>🌐 <strong>زبان:</strong> ${BOOK_META.language}</li>
        <li>📚 <strong>ابواب:</strong> 20 مکمل ابواب + 30 روزہ عملی لائحہ عمل</li>
        <li>📖 <strong>موضوع:</strong> اسلامی اصلاح، توبہ، نماز، روحانیت اور قربِ الٰہی</li>
      </ul>
    </div>
  </div>

  ${createFooterHtml()}
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), homeHtml.trim());

// Generate Page 00 (Front Matter & Table of Contents)
const p00Html = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فہرستِ ابواب و پیش لفظ | ${BOOK_META.title}</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../script.js"></script>
</head>
<body>
  ${createHeaderHtml("pages/p00.html")}

  <div class="container">
    <!-- Dedication -->
    <div class="chapter-box">
      <h2 style="color:var(--brand-emerald); border-bottom:1px solid var(--surface-border); padding-bottom:8px; margin-bottom:16px;">${DEDICATION.title}</h2>
      <div style="white-space:pre-line;">${DEDICATION.content}</div>
    </div>

    <!-- Author's Message -->
    <div class="chapter-box">
      <h2 style="color:var(--brand-emerald); border-bottom:1px solid var(--surface-border); padding-bottom:8px; margin-bottom:16px;">${AUTHORS_MESSAGE.title}</h2>
      <div style="white-space:pre-line;">${AUTHORS_MESSAGE.content}</div>
    </div>

    <!-- Preface -->
    <div class="chapter-box">
      <h2 style="color:var(--brand-emerald); border-bottom:1px solid var(--surface-border); padding-bottom:8px; margin-bottom:16px;">${PREFACE.title}</h2>
      <div style="white-space:pre-line;">${PREFACE.content}</div>
    </div>

    <!-- Table of Contents -->
    <div class="chapter-box">
      <h2 style="color:var(--brand-emerald); border-bottom:2px solid var(--brand-gold); padding-bottom:8px; margin-bottom:24px;">فہرستِ مکمل 20 ابواب</h2>
      <div style="display:grid; grid-template-columns:1fr; gap:16px;">
        ${ALL_CHAPTERS.map(ch => `
          <div style="border:1px solid var(--surface-border); padding:16px; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="background:var(--brand-emerald); color:#fff; padding:2px 8px; border-radius:6px; font-size:12px;">باب ${ch.id}</span>
              <h3 style="margin-top:4px; font-size:18px;"><a href="./p${String(ch.id).padStart(2, "0")}.html" style="text-decoration:none; color:var(--text-primary); font-weight:bold;">${ch.title}</a></h3>
              <p style="color:var(--text-secondary); font-size:13px;">${ch.subtitle}</p>
            </div>
            <a href="./p${String(ch.id).padStart(2, "0")}.html" class="btn-nav" style="padding:6px 14px; font-size:12px;">مطالعہ کریں</a>
          </div>
        `).join("")}
      </div>
    </div>
  </div>

  ${createFooterHtml()}
</body>
</html>`;

fs.writeFileSync(path.join(pagesDir, "p00.html"), p00Html.trim());

// Generate All 20 Chapter Pages
ALL_CHAPTERS.forEach((ch, idx) => {
  const pageFile = `p${String(ch.id).padStart(2, "0")}.html`;
  const prevFile = ch.id > 1 ? `p${String(ch.id - 1).padStart(2, "0")}.html` : "p00.html";
  const nextFile = ch.id < 20 ? `p${String(ch.id + 1).padStart(2, "0")}.html` : "dua.html";

  const chapterHtml = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>باب ${ch.id}: ${ch.title} | ${BOOK_META.title}</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../script.js"></script>
</head>
<body onload="saveLastRead(${ch.id})">
  ${createHeaderHtml(`pages/${pageFile}`)}

  <div class="container">
    <div style="text-align:center; margin-bottom:24px;">
      <span style="background:rgba(10, 61, 39, 0.1); color:var(--brand-emerald); padding:4px 16px; border-radius:20px; font-size:14px; font-weight:bold;">باب نمبر ${ch.id} از 20</span>
      <h1 style="font-size:36px; line-height:1.6; color:var(--brand-emerald); margin-top:8px;">${ch.title}</h1>
      <p style="font-size:18px; color:var(--brand-gold); font-weight:bold;">${ch.subtitle}</p>
    </div>

    <!-- Opening -->
    <div class="chapter-box" style="border-right:5px solid var(--brand-gold);">
      <p style="font-size:18px; line-height:2.4;">${ch.opening}</p>
    </div>

    <!-- Quranic Verses -->
    ${ch.quranVerses.map(v => `
      <div class="quran-box">
        <p class="font-quran quran-arabic">${v.arabic}</p>
        <p class="quran-trans"><strong>ترجمہ: </strong>${v.translation}</p>
        <span class="quran-ref">${v.reference}</span>
      </div>
    `).join("")}

    <!-- Hadith -->
    ${ch.hadiths.map(h => `
      <div class="hadith-box">
        ${h.arabic ? `<p class="font-quran" style="font-size:22px; color:var(--brand-emerald); margin-bottom:8px;">${h.arabic}</p>` : ""}
        <p style="font-size:17px; line-height:2.2;">${h.urdu}</p>
        <div style="text-align:left; margin-top:6px;"><span class="quran-ref" style="background:#C29B38; color:#0A3D27;">${h.source}</span></div>
      </div>
    `).join("")}

    <!-- Detailed Sections -->
    ${ch.sections.map(sec => `
      <div class="chapter-box">
        <h2 style="color:var(--brand-emerald); border-bottom:1px solid var(--surface-border); padding-bottom:8px; margin-bottom:16px;">${sec.heading}</h2>
        ${sec.content.map(p => `<p style="margin-bottom:16px; font-size:17px; line-height:2.4;">${p}</p>`).join("")}
      </div>
    `).join("")}

    <!-- Real Life Story -->
    ${ch.realLifeExample ? `
      <div class="story-box">
        <h3 style="color:var(--brand-emerald); margin-bottom:8px;">💡 سبق آموز واقعہ: ${ch.realLifeExample.title}</h3>
        <p style="font-size:16px; line-height:2.3; margin-bottom:12px;">${ch.realLifeExample.story}</p>
        <p style="color:var(--brand-emerald); font-weight:bold;">سبق: ${ch.realLifeExample.lesson}</p>
      </div>
    ` : ""}

    <!-- Spiritual Reflection -->
    ${ch.spiritualReflection ? `
      <div class="chapter-box" style="background:var(--brand-emerald); color:#ffffff;">
        <h3 style="color:#F4E8C1; margin-bottom:8px;">🌿 روحانی محاسبہ و تدبر</h3>
        <p style="font-size:17px; line-height:2.4;">${ch.spiritualReflection}</p>
      </div>
    ` : ""}

    <!-- Practical Steps -->
    ${ch.practicalSteps.length > 0 ? `
      <div class="chapter-box">
        <h3 style="color:var(--brand-emerald); margin-bottom:12px;">🎯 عملی اقدامات (Practical Steps)</h3>
        <ol style="padding-right:20px; line-height:2.2;">
          ${ch.practicalSteps.map(step => `<li>${step}</li>`).join("")}
        </ol>
      </div>
    ` : ""}

    <!-- Reflection Questions -->
    ${ch.reflectionQuestions.length > 0 ? `
      <div class="chapter-box">
        <h3 style="color:var(--brand-emerald); margin-bottom:12px;">❓ محاسبۂ نفس کے سوالات</h3>
        <ul style="list-style:disc; padding-right:20px; line-height:2.2;">
          ${ch.reflectionQuestions.map(q => `<li>${q}</li>`).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Closing Dua -->
    ${ch.closingDua ? `
      <div class="dua-box">
        <h3 style="color:#D4AF37; margin-bottom:8px;">🤲 دعائے اختتام</h3>
        <p class="font-quran quran-arabic">${ch.closingDua.arabic}</p>
        <p class="quran-trans"><strong>ترجمہ: </strong>${ch.closingDua.translation}</p>
      </div>
    ` : ""}

    <!-- Mark complete button -->
    <div style="text-align:center; margin:24px 0;">
      <button onclick="markCompleted(${ch.id})" style="background:#0A3D27; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:bold; cursor:pointer;">
        ✓ اس باب کا مطالعہ مکمل نشان لگائیں
      </button>
    </div>

    <!-- Navigation -->
    <div class="page-nav">
      <a href="./${prevFile}" class="btn-nav">← پچھلا باب</a>
      <a href="./p00.html" style="text-decoration:none; color:var(--text-secondary); font-weight:bold;">فہرستِ ابواب</a>
      <a href="./${nextFile}" class="btn-nav">اگلا باب →</a>
    </div>
  </div>

  ${createFooterHtml()}
</body>
</html>`;

  fs.writeFileSync(path.join(pagesDir, pageFile), chapterHtml.trim());
});

// Generate dua.html
const duaHtml = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>جامع مسنون دعائیں و اذکار | ${BOOK_META.title}</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../script.js"></script>
</head>
<body>
  ${createHeaderHtml("pages/dua.html")}

  <div class="container">
    <div style="text-align:center; margin-bottom:24px;">
      <h1 style="font-size:36px; color:var(--brand-emerald);">${COMPREHENSIVE_DUA.title}</h1>
      <p class="font-quran" style="font-size:24px; color:var(--brand-gold); margin-top:8px;">${COMPREHENSIVE_DUA.arabicOpening}</p>
    </div>

    ${COMPREHENSIVE_DUA.sections.map(s => `
      <div class="chapter-box">
        <h2 style="color:var(--brand-emerald); border-bottom:1px solid var(--surface-border); padding-bottom:8px; margin-bottom:12px;">${s.title}</h2>
        <p style="font-size:17px; line-height:2.4; white-space:pre-line;">${s.content}</p>
      </div>
    `).join("")}

    <div class="chapter-box">
      <h2 style="color:var(--brand-emerald); border-bottom:2px solid var(--brand-gold); padding-bottom:8px; margin-bottom:16px;">توبہ و استغفار کی دعائیں</h2>
      ${TAWBAH_DUAS.map(d => `
        <div style="border-bottom:1px solid var(--surface-border); padding:16px 0;">
          <h3 style="color:var(--brand-emerald); font-size:18px;">${d.title}</h3>
          <p class="font-quran" style="font-size:24px; color:var(--brand-emerald); margin:8px 0;">${d.arabic}</p>
          <p><strong>ترجمہ: </strong>${d.urduTranslation}</p>
          <span class="quran-ref">${d.source}</span>
        </div>
      `).join("")}
    </div>

    <div class="chapter-box">
      <h2 style="color:var(--brand-emerald); border-bottom:2px solid var(--brand-gold); padding-bottom:8px; margin-bottom:16px;">روزانہ کے مسنون اذکار</h2>
      ${DAILY_ADHKAR.map(a => `
        <div style="border-bottom:1px solid var(--surface-border); padding:16px 0;">
          <h3 style="color:var(--brand-emerald); font-size:18px;">${a.title}</h3>
          <p class="font-quran" style="font-size:24px; color:var(--brand-emerald); margin:8px 0;">${a.arabic}</p>
          <p><strong>ترجمہ: </strong>${a.urduTranslation}</p>
          <span class="quran-ref">${a.source}</span>
        </div>
      `).join("")}
    </div>

    <div class="page-nav">
      <a href="./p20.html" class="btn-nav">← باب 20</a>
      <a href="./p00.html" style="text-decoration:none; color:var(--text-secondary); font-weight:bold;">فہرستِ ابواب</a>
      <a href="./references.html" class="btn-nav">حوالہ جات →</a>
    </div>
  </div>

  ${createFooterHtml()}
</body>
</html>`;

fs.writeFileSync(path.join(pagesDir, "dua.html"), duaHtml.trim());

// Generate references.html
const refHtml = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>قرآن و حدیث کے حوالہ جات | ${BOOK_META.title}</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../script.js"></script>
</head>
<body>
  ${createHeaderHtml("pages/references.html")}

  <div class="container">
    <div style="text-align:center; margin-bottom:24px;">
      <h1 style="font-size:36px; color:var(--brand-emerald);">قرآن و حدیث کے مآخذ اور حوالہ جات</h1>
      <p style="color:var(--text-secondary);">تمام مآخذ صحیح اور مستند کتب سے لیے گئے ہیں</p>
    </div>

    <div class="chapter-box">
      ${BOOK_REFERENCES.map(r => `
        <div style="border-bottom:1px solid var(--surface-border); padding:16px 0;">
          <h3 style="color:var(--brand-emerald); font-size:18px;">${r.title} (${r.category})</h3>
          <p style="color:var(--brand-gold); font-size:14px; font-weight:bold;">مؤلف: ${r.author}</p>
          <p style="font-size:15px; margin-top:4px;">${r.description}</p>
        </div>
      `).join("")}
    </div>

    <div class="chapter-box" style="background:var(--brand-emerald); color:#fff;">
      <h2 style="color:#D4AF37; margin-bottom:12px;">${AUTHOR_CLOSING_NOTE.title}</h2>
      <p style="color:#F4E8C1; font-weight:bold; margin-bottom:8px;">از: ${AUTHOR_CLOSING_NOTE.author}</p>
      <div style="white-space:pre-line; line-height:2.4;">${AUTHOR_CLOSING_NOTE.content}</div>
    </div>

    <div class="page-nav">
      <a href="./dua.html" class="btn-nav">← دعائیں</a>
      <a href="./p00.html" class="btn-nav">فہرستِ ابواب</a>
      <a href="../index.html" class="btn-nav">سرورق →</a>
    </div>
  </div>

  ${createFooterHtml()}
</body>
</html>`;

fs.writeFileSync(path.join(pagesDir, "references.html"), refHtml.trim());

console.log("Static e-book site generated successfully in public/Allah-Ki-Taraf-Wapsi!");
