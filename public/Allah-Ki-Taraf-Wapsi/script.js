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