// src/theme/useThemeMode.js
//
// RETIRED. Use the Provider: `const { isDark, toggleDarkMode } = useOmniDesign()`.
//
// This hook injected its OWN full set of stylesheets — css-foundation,
// css-core, css-mode, css-base, css-typography-tokens — alongside the ones
// OmniDesignProvider manages as omni-*. Two complete cascades for one page.
//
// switchMode() then flipped only its own #css-mode href. The Provider's
// #omni-mode sat later in <head>, still pointing at Light-Mode.css, and won on
// equal specificity. So the dark-mode button changed a stylesheet nothing was
// reading, and nothing errored: both sheets were valid, both loaded, one was
// simply ignored.
//
// Kept as a throwing stub rather than deleted outright. A removed export is a
// build error that names the file; a silently absent behaviour is another hour
// of wondering why a toggle does nothing.
export function useThemeMode() {
  throw new Error(
    'useThemeMode has been retired — it injected a second set of stylesheets '
    + 'that fought the Provider\'s, which is what made the dark-mode toggle '
    + 'appear to do nothing. Use: const { isDark, toggleDarkMode } = useOmniDesign().',
  );
}

export default useThemeMode;
