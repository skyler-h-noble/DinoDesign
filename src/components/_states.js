/**
 * Interaction states for controls with no fill of their own.
 *
 * Every clickable component needs the same four: hover, pressed,
 * focus-visible, disabled. Before this file each one spelled them out inline,
 * and the audit that prompted it found the same three mistakes repeated across
 * ToggleButton, ToggleButtonGroup, Sidebar, MainLayout, Header, CodeBlock and
 * CodeWithCopy:
 *
 *   1. A CONTAINER level (--Container-High, --Container) used as a hover.
 *      Container levels are an elevation axis, not a state one — they do not
 *      move with the control's surface, so the same rule reads as a strong
 *      tint on one surface and as nothing at all on the next.
 *   2. A literal rgba(0,0,0,0.04) scrim, which is invisible on a dark surface
 *      and ignores the brand.
 *   3. Selected-hover repainting the RESTING colour, so the one state users
 *      check most — "did my click land?" — gave no feedback.
 *
 * --Hover and --Pressed are emitted per theme AND per surface level, so a
 * control tinted through them follows wherever it is placed with no prop.
 *
 * `pressed` is deliberately a separate state from `hover`, not a darker
 * variant of it: a touch device fires both at once, and a pointer leaves hover
 * set while the button is held. Collapsing them loses the press entirely.
 */

/** Focus ring. Its own export because a few controls need it without a scrim. */
export const FOCUS_RING = {
  outline: '2px solid var(--Focus-Visible)',
  outlineOffset: '2px',
};

/** Disabled. 0.38 is the token Figma binds; the fallback is for a consumer
 *  who has loaded the components but not (yet) a generated brand sheet. */
export const DISABLED_STATE = {
  opacity: 'var(--Disabled, 0.38)',
  cursor: 'not-allowed',
};

/**
 * The four states for a transparent control.
 *
 * @param {object}  [opts]
 * @param {string}  [opts.selectedBg]    resting fill when selected
 * @param {string}  [opts.selectedText]  text colour when selected
 * @param {string}  [opts.selectedHover] fill on hover while selected
 * @param {string}  [opts.selectedPressed] fill on press while selected
 * @param {string}  [opts.muiPrefix]     'Mui' to use MUI's class-based
 *                                       selectors (.Mui-disabled /
 *                                       .Mui-focusVisible) instead of the
 *                                       pseudo-classes. MUI sets `disabled` on
 *                                       a real <button>, but its own
 *                                       components carry the class and often
 *                                       nothing else, so the plain selector
 *                                       silently matches nothing there.
 */
export function scrimStates(opts = {}) {
  const {
    selectedBg, selectedText, selectedHover, selectedPressed, muiPrefix,
  } = opts;

  const disabledSel = muiPrefix ? '&.Mui-disabled' : '&:disabled';
  const focusSel    = muiPrefix ? '&.Mui-focusVisible' : '&:focus-visible';

  const base = {
    '&:hover':  { backgroundColor: 'var(--Hover)' },
    '&:active': { backgroundColor: 'var(--Pressed)' },
    [focusSel]: FOCUS_RING,
    [disabledSel]: { ...DISABLED_STATE, color: 'var(--Quiet)' },
  };

  if (!selectedBg) return base;

  return {
    ...base,
    '&.Mui-selected': {
      backgroundColor: selectedBg,
      ...(selectedText ? { color: selectedText } : {}),
      // Never the resting colour — see note 3 above.
      '&:hover':  { backgroundColor: selectedHover || 'var(--Hover)' },
      '&:active': { backgroundColor: selectedPressed || 'var(--Pressed)' },
    },
  };
}
