import { useState, useEffect } from 'react';

function injectLink(href, id) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.id = id;
  document.head.appendChild(link);
}

export function useThemeMode(initialMode = 'light') {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    // Load base CSS files once
    injectLink('/styles/foundations.css', 'css-foundations');
    injectLink('/styles/core.css', 'css-core');
    injectLink('/styles/Light-Mode.css', 'css-mode');
    injectLink('/styles/base.css', 'css-base');
  }, []);

  const switchMode = (newMode) => {
    const modeLink = document.getElementById('css-mode');
    if (modeLink) modeLink.href = newMode === 'dark' ? '/styles/Dark-Mode.css' : '/styles/Light-Mode.css';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return { mode, switchMode };
}