/* ─── theme toggle ─── */
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const KEY = 'gbs-theme';
  const DEFAULT_THEME = 'dark';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }

  /* restore saved preference */
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    applyTheme(DEFAULT_THEME);
  }

  if (btn) {
    btn.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') || DEFAULT_THEME;
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }
})();
