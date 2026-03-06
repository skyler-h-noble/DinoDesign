// src/utils/cssLoader.js
/**
 * Dynamic CSS Loader
 * Loads the appropriate mode CSS file based on the current mode setting
 */

export function loadModeCSS(mode = 'Light-Mode-Tonal') {
  // Remove any existing mode CSS link
  const existingLink = document.querySelector('link[data-theme-mode]');
  if (existingLink) {
    existingLink.remove();
  }

  // Determine which CSS file to load
  const cssFile = mode === 'Light-Mode-Tonal' 
    ? 'Light-Mode-Tonal.css' 
    : 'Light-Mode-Professional.css';

  // Create and append the new link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${process.env.PUBLIC_URL}/styles/${cssFile}`;
  link.setAttribute('data-theme-mode', mode);
  
  document.head.appendChild(link);

  console.log(`Loaded CSS: ${cssFile}`);
}

/**
 * Initialize CSS loader on app startup
 * Call this in your App.js useEffect
 */
export function initializeCSSLoader() {
  // Get the current mode from localStorage or default
  const savedMode = localStorage.getItem('--Light-Mode') || 'Light-Mode-Tonal';
  loadModeCSS(savedMode);
}

export default { loadModeCSS, initializeCSSLoader };