import { useState, useEffect } from 'react';

const THEME_MODES = {
  light: 'Light-Mode-Tonal',
  professional: 'Light-Mode-Professional',
  dark: 'Dark-Mode',
};

export function useThemeMode(initialMode = 'light') {
  const [mode, setMode] = useState(initialMode);

  const switchMode = (newMode) => {
    if (!THEME_MODES[newMode]) {
      console.error(`Unknown theme mode: ${newMode}`);
      return;
    }

    const oldLink = document.querySelector('link[data-theme]');
    if (oldLink) oldLink.remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/styles/${THEME_MODES[newMode]}.css`;
    link.setAttribute('data-theme', newMode);
    document.head.appendChild(link);

    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    console.log(`✅ Switched to ${newMode} theme`);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || initialMode;
    if (savedMode !== mode) {
      switchMode(savedMode);
    }
  }, []);

  return { mode, switchMode };
}
