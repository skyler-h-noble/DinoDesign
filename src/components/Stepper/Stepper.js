// src/components/Stepper/Stepper.js
import React, { createContext, useContext } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { Label } from '../Typography';
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * Stepper Component
 *
 * COMPONENTS:
 *   Stepper        — container (<ol>), sets orientation/size/color context
 *   Step           — individual step (<li>)
 *   StepIndicator  — circle showing number/icon
 *   StepConnector  — line between steps (auto-inserted)
 *
 * COLORS: 9 brand colors → maps to var(--Buttons-{Color}-*) tokens. The
 * default is `default`, not `primary`: the design's Count Step PINS NOTHING,
 * so the circle resolves whatever Buttons mode it inherits, which with nothing
 * above it is Default. Defaulting to primary painted --Buttons-Primary-Button
 * on a step that Figma draws in the brand's default button color, and because
 * both are real colors from the same system it looked like a design choice
 * rather than the wrong token.
 *   Selected:   bg var(--Buttons-{C}-Button), text var(--Buttons-{C}-Text),
 *               hover var(--Buttons-{C}-Hover), active var(--Buttons-{C}-Pressed)
 *   Unselected: bg transparent, text var(--Text),
 *               hover var(--Hover), active var(--Pressed)
 *   Border:     var(--Buttons-{C}-Border) always
 *   Focus:      var(--Focus-Visible)
 *
 * SIZES: Button-Height — 24 / 32 / 56. Large was 40, a number this file chose
 *        rather than read.
 * ORIENTATION: horizontal | vertical
 * BUTTONS: steps can be clickable StepButtons
 * DASHED: incomplete connector paths rendered dashed
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const COLOR_LABEL_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

/* connectorThickness comes from Component-Size `Step bar` — 1 / 2 / 4.
   It was a flat 2 at every size, which is the MEDIUM value, so small
   connectors were double weight and large ones half. The 1/2/4 ramp is also
   what the lib's Divider was using; the design assigns that one to the step
   bar and gives Divider a lighter 0.5 / 1 / 2, so the two were swapped. */
const SIZE_MAP = {
  /* fontSize is the Button-Numbers ramp, the same one Badge reads — the design
     binds Button/Button-Numbers on the step indicator. It was 11 / 13 / 16 in
     literal pixels, so a brand that re-picked its button heights moved the
     design's step numbers and not the lib's.
     dot is Component-Size `No Count Step` (8 / 12 / 16), the diameter of a
     noCount step. */
  /* labelFontSize is NOT here. It sat in this table as 13 / 14 / 16 literal
     pixels and nothing ever read it — the label renders through Label, which
     takes its size from the Dynamic-Label ramp already. A dead entry
     that looks like configuration is worse than none: the next person tunes it
     and nothing happens.

     connectorThickness and dot read their tokens with the DESIGN's numbers as
     fallbacks — Component-Size / Other / `Step bar` (1/2/4) and
     `No Count Step` (8/12/16), which componentSizePayload writes. Same idiom
     as Rail-Width and the Divider ramp: an unbound token renders the intended
     weight rather than an invented one. */
  small:  { indicator: 24, fontSize: 'var(--Sm-Button-Numbers, 10px)',
            dot: 'var(--Sm-No-Count-Step, 8px)',
            connectorThickness: 'var(--Sm-Step-Bar, 1px)', gap: 0 },
  medium: { indicator: 32, fontSize: 'var(--Button-Numbers, 14px)',
            dot: 'var(--No-Count-Step, 12px)',
            connectorThickness: 'var(--Step-Bar, 2px)', gap: 0 },
  large:  { indicator: 56, fontSize: 'var(--Lg-Button-Numbers, 16px)',
            dot: 'var(--Lg-No-Count-Step, 16px)',
            connectorThickness: 'var(--Lg-Step-Bar, 4px)', gap: 0 },
};

const SxBox = lazySxBox('Stepper');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/** A part's root: static classes, plus an MUI box only when given sx. */
function Part({ sx, component: Tag = 'div', ...props }) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} {...props} />;
  return <Tag {...props} />;
}

/* ─── Static sheet ───
   Every declaration the parts used to hand emotion per render, as classes
   over the same tokens. The indicator's status colours differ per step and
   per palette, so they arrive as custom properties set on the indicator
   itself (--_st-bd / -bg / -fg / -hv / -pr) — declared there, so the Buttons
   and surface tokens resolve against the indicator's own theme and surface,
   as they did when emotion wrote them on it. Sizes are modifier classes.

   The digit wears the BUTTON face (see the notes in Step): Figma binds
   Buttons/Button-Font-Family on the step number, and --Font-Family-Body is a
   real second step because the lib's bundled CSS leaves --Font-Family-Button
   guaranteed-invalid. The weight is the button's, for the same reason.

   State rules weigh one class + one pseudo-class, as emotion's did. */
const sizeEntries = Object.entries(SIZE_MAP);
/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

registerStaticStyles('omni-stepper', webkitBox([
  '.omni-st{display:flex;list-style:none;margin:0;padding:0;width:100%;gap:0}',
  '.omni-st-h{flex-direction:row;align-items:flex-start}',
  '.omni-st-v{flex-direction:column;align-items:stretch}',
  '.omni-st-ind{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;'
    + 'border:var(--Button-Border-Width, 1px) solid var(--_st-bd);background-color:var(--_st-bg);color:var(--_st-fg);'
    + 'font-family:var(--Font-Family-Button, var(--Font-Family-Body, inherit));'
    + 'font-weight:var(--Button-Font-Weight, var(--Button-Small-Font-Weight, 700));line-height:1;flex-shrink:0;'
    + 'box-sizing:border-box;position:relative;'
    + 'transition:background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;'
    + 'cursor:default;outline:none;padding:0}',
  // The CURRENT step's ring is 2px — it is the outline that carries "you are here".
  '.omni-st-ind-cur{border:2px solid var(--_st-bd)}',
  '.omni-st-ind-click{cursor:pointer}',
  '.omni-st-ind-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  ...sizeEntries.map(([k, v]) => `.omni-st-ind-${k}{width:${v.indicator}px;height:${v.indicator}px;min-width:${v.indicator}px;min-height:${v.indicator}px;font-size:${v.fontSize}}`),
  ...sizeEntries.map(([k, v]) => `.omni-st-ind-dot-${k}{width:${v.dot};height:${v.dot};min-width:${v.dot};min-height:${v.dot};font-size:${v.fontSize}}`),
  // 24×24 minimum touch target via ::after for the small size
  '.omni-st-ind-small::after,.omni-st-ind-dot-small::after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:24px;height:24px;border-radius:50%}',
  /* Figma's Hover step wears Level-1 elevation (on Button-Effect); Pressed
     drops back to none. 2px focus ring, 1px out, as every control. */
  `.omni-st-ind-click:hover{background-color:var(--_st-hv);box-shadow:${SHADOW_LEVEL_1}}`,
  '.omni-st-ind-click:active{background-color:var(--_st-pr);box-shadow:none}',
  '.omni-st-ind-click:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  '.omni-st-band{display:flex;align-items:center;justify-content:center;flex-shrink:0}',
  ...sizeEntries.map(([k, v]) => `.omni-st-band-${k}{width:${v.indicator}px;height:${v.indicator}px}`),
  ...sizeEntries.map(([k, v]) => `.omni-st-band-dot-h-${k}{width:${v.dot};height:${v.indicator}px}`),
  ...sizeEntries.map(([k, v]) => `.omni-st-band-dot-v-${k}{width:${v.dot};height:${v.dot}}`),
  '.omni-st-con{flex:1;transition:background-color 0.15s ease}',
  '.omni-st-con-done{background-color:var(--_st-line)}',
  '.omni-st-con-todo{background-color:var(--Quiet)}',
  ...sizeEntries.map(([k, v]) => `.omni-st-con-h-${k}{height:${v.connectorThickness};min-width:20px;align-self:flex-start;margin-top:calc(${v.indicator / 2}px - ${v.connectorThickness} / 2)}`),
  ...sizeEntries.map(([k, v]) => `.omni-st-con-v-${k}{width:${v.connectorThickness};min-height:24px;margin-left:calc(${v.indicator / 2}px - ${v.connectorThickness} / 2)}`),
  ...sizeEntries.map(([k, v]) => `.omni-st-con-v-dot-${k}{width:${v.connectorThickness};min-height:24px;margin-left:calc(${v.dot} / 2 - ${v.connectorThickness} / 2)}`),
  /* 2 on, 2 off across and 4/4 down, copied from the file's dash arrays. */
  '.omni-st-con-dash-h{background-color:transparent;background-image:repeating-linear-gradient(90deg, var(--Quiet) 0px, var(--Quiet) 2px, transparent 2px, transparent 4px);background-size:4px 100%}',
  '.omni-st-con-dash-v{background-color:transparent;background-image:repeating-linear-gradient(180deg, var(--Quiet) 0px, var(--Quiet) 4px, transparent 4px, transparent 8px);background-size:100% 8px}',
  '.omni-st-col{display:flex;flex-direction:column;align-items:center;flex-shrink:0}',
  ...sizeEntries.map(([k, v]) => `.omni-st-col-${k}{width:${v.indicator}px}`),
  ...sizeEntries.map(([k, v]) => `.omni-st-col-dot-${k}{width:${v.dot}}`),
  '.omni-st-lbl{margin-top:var(--Sizing-Half);width:100%;display:flex;justify-content:center}',
  '.omni-st-lbl-dot{margin-top:0}',
  '.omni-st-row{display:flex;align-items:center;gap:var(--Sizing-1);flex-shrink:0}',
  ...sizeEntries.map(([k, v]) => `.omni-st-row-dot-${k}{height:${v.dot};overflow:visible}`),
  '.omni-st-step-h{display:flex;align-items:flex-start;flex:1}',
  '.omni-st-step-last{flex:none}',
  '.omni-st-step-v{display:flex;flex-direction:column;align-items:flex-start}',
  /* While the step is hovered, pressed or focused its label reads --Text, at
     every status — Figma's Hover / Pressed / Focus-Visible variants all bind
     Surface › Text on the label. The label's colour is an inline style, so
     the important flag is on purpose. */
  '.omni-st-step-click:has(.step-indicator:hover) .step-label,.omni-st-step-click:has(.step-indicator:active) .step-label,'
    + '.omni-st-step-click:has(.step-indicator:focus-visible) .step-label{color:var(--Text) !important}',
].join('\n')));

/* ─── Context ─── */
const StepperContext = createContext({
  orientation: 'horizontal',
  size: 'medium',
  color: 'default',
  activeStep: 0,
  clickable: false,
  onStepClick: null,
  dashedIncomplete: false,
  totalSteps: 0,
  variant: 'count',
});
export const useStepperContext = () => useContext(StepperContext);

/* ─── Stepper ─── */
/* ZONE PROPS — `theme` and `surface`.
 *
 * They become data-theme / data-surface on the root, which redefines
 * --Background, --Text, --Border, --Quiet, --Hover and --Pressed for
 * everything inside, so the component takes its colors from the zone it sits
 * in rather than from a prop.
 *
 * Deliberately NOT derived from `color`. The two are different knobs: `color`
 * chooses which PALETTE a filled part draws from, while `theme` moves the whole
 * surface — including the parts that carry a contrast requirement and therefore
 * have to stay on zone tokens. Folding one into the other would make a palette
 * choice silently restyle the contrast-bearing parts too.
 *
 * Both undefined when not passed, so the component INHERITS its ancestor's
 * zone. An empty string would match [data-theme] selectors and pin it to
 * nothing, which is worse than absent. */
export function Stepper({
  theme,
  surface,
  children,
  orientation = 'horizontal',
  size = 'medium',
  /* `default`, matching the Count Step's unpinned Buttons mode — see COLORS
     above. Pass a palette name only where the design pins one. */
  color = 'default',
  activeStep = 0,
  clickable = false,
  onStepClick,
  dashedIncomplete = false,
  /* 'count' draws a numbered circle, 'noCount' a plain dot — the design's
     Style axis. Named `variant`, not `style`: React already owns `style` as
     the inline-style prop, so the Figma property name cannot be used verbatim
     here. The VALUES match exactly, which is what a converter reads. */
  variant = 'count',
  /* Where each step's label sits: 'bottom' (under the circle) or 'right'
     (beside it) — Figma's Count Step Bottom Label / Right Label booleans.
     Unset, it follows the orientation: under in a horizontal stepper, beside
     in a vertical one. */
  labelPosition,
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-stepper');
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const totalSteps = items.length;
  const isHorizontal = orientation === 'horizontal';

  return (
    <StepperContext.Provider value={{ orientation, size, color, activeStep, clickable, onStepClick, dashedIncomplete, totalSteps, variant, labelPosition }}>
      <Part
        component="ol"
        role="list"
        aria-label="Progress"
        data-theme={theme || undefined}
        data-surface={surface || undefined}
        className={'stepper stepper-' + orientation + ' stepper-' + size + ' stepper-' + color + ' ' + className
          + ' MuiBox-root omni-st ' + (isHorizontal ? 'omni-st-h' : 'omni-st-v')}
        sx={sx}
        {...props}
      >
        {items.map((child, index) =>
          React.cloneElement(child, { _index: index, key: child.key || index })
        )}
      </Part>
    </StepperContext.Provider>
  );
}

let warnedDotClick = false;

/* ─── Step ─── */
export function Step({
  children,
  icon,
  label,
  disabled = false,
  _index = 0,
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-stepper');
  const { orientation, size, color, activeStep, clickable: groupClickable, onStepClick, dashedIncomplete, totalSteps, variant, labelPosition } = useStepperContext();
  /* `clickable` is a Stepper-level switch, so before this a step you cannot
     reach yet was styled and announced exactly like one you can. Folding
     disabled into it here drops the role, tabIndex, key handler and onClick
     together rather than only dimming the indicator. */
  /* A No-Count step (a dot) is NEVER clickable — Figma's No-Count Step has no
     interactive states by design: the dot is progress, not navigation. A
     stepper that lets you jump between steps uses Count steps. */
  const clickable = groupClickable && !disabled && variant !== 'noCount';
  if (groupClickable && variant === 'noCount' && process.env.NODE_ENV !== 'production' && !warnedDotClick) {
    warnedDotClick = true;
    // eslint-disable-next-line no-console
    console.warn('[Stepper] clickable is ignored with variant="noCount": dots are progress, not navigation. '
      + 'Use variant="count" for a stepper you can jump around in.');
  }
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const C = COLOR_LABEL_MAP[color] || 'Default';
  const isHorizontal = orientation === 'horizontal';
  const labelBelow = labelPosition ? labelPosition === 'bottom' : isHorizontal;
  const isActive = _index === activeStep;
  const isCompleted = _index < activeStep;
  const isIncomplete = _index > activeStep;
  const isLast = _index === totalSteps - 1;

  const displayContent = icon || (_index + 1);
  const displayLabel = label || children;

  /* The status ladder, three separable steps:
   *
   *   incomplete   Quiet outline, Quiet number,  no fill   — not reached
   *   complete     brand outline, --Text number, no fill   — done
   *   current      brand outline, brand FILL               — you are here
   *
   * Only the current step fills. This used to fill complete as well
   * (`isActive || isCompleted`), leaving those two a single pixel of border
   * apart while incomplete was the only one that looked different — so the
   * step you are ON was the hardest to pick out, which is backwards. It also
   * painted incomplete's ring in the brand color; the design uses Quiet, so a
   * column of unreached steps reads as quiet rather than as a row of buttons.
   * (Same reasoning as Checkbox's default box, which draws in --Quiet for
   * exactly that.)
   *
   * The number on a FILLED indicator takes --Buttons-<C>-Text, the token
   * paired with that fill, rather than --Text. The design binds --Text there,
   * which resolves legibly on the current theme but is the surface's text
   * color, not the fill's: per invariant 3 the label is derived from the
   * fill, so a palette whose button is light would put light text on it. */
  const borderToken = isIncomplete ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';
  /* --Background, not transparent. The design fills every unselected circle
     with Background rather than letting the surface through, which is the
     same picture on a plain surface and a different one the moment a step
     sits on a Container: transparent shows the container tone through the
     ring, Background punches the surface back out. */
  /* FILLED = COMPLETE, 2px RING = CURRENT (swapped 2026-10-26, in Figma and
     here). The steps behind you and the traversed connector share the fill,
     so the path reads as one solid track and the current step is its leading
     edge; each status has a non-colour cue — filled, thick ring, thin ring. */
  const isFilled    = isCompleted;
  const bgToken     = isFilled ? 'var(--Buttons-' + C + '-Button)'
                    // A dot is an OUTLINE: Figma's No-Count Step draws no fill.
                    : variant === 'noCount' ? 'transparent'
                    : 'var(--Background)';
  /* The COMPLETE circle has no fill, which makes it an outline button, so its
     digit is the outline button's text token. The CURRENT one is filled, so
     per invariant 3 its digit is the token paired with that fill.
     The file binds Outline-Text to BOTH. On this brand's default palette that
     happens to read (dark on pink), but Outline-Text is tuned for text on the
     SURFACE — on a palette whose Button is dark it would be dark on dark. See
     docs/figma-parity.md; this is a file fix, not a lib one. */
  const textToken   = isFilled     ? 'var(--Buttons-' + C + '-Text)'
                    : isIncomplete ? 'var(--Quiet)'
                    : 'var(--Buttons-' + C + '-Outline-Text)';
  /* Hover and Pressed follow the FILL. The current step is a filled button,
     so it takes the palette's --Buttons-<C>-Hover / -Pressed. Complete and
     incomplete are filled with the surface's --Background, so they take the
     surface's --Hover / --Pressed — which is what Figma's Button-Fill binds on
     those ten variants. Buttons tokens there tinted an outline step in the
     palette color on hover, a step Figma does not draw. */
  const hoverToken  = isFilled ? 'var(--Buttons-' + C + '-Hover)' : 'var(--Hover)';
  const activeToken = isFilled ? 'var(--Buttons-' + C + '-Pressed)' : 'var(--Pressed)';
  const isDot       = variant === 'noCount';

  /* The indicator's geometry and status, as classes (see the sheet):
     - `dot` is a token string and `indicator` a number, so the 'px' goes on
       the number only — appending it to a var() would emit
       `var(--No-Count-Step, 12px)px`, which the browser drops silently.
     - The COMPLETE ring is 1px (--Button-Border-Width) and the CURRENT one
       2px: the current step is an outline, and its ring is what carries
       "you are here". A literal in the file as well as here — Button-Fill's
       strokeWeight is a plain 2, bound to nothing — so it cannot follow a
       brand that moves its border width. Flagged in docs/figma-parity.md.
     - The BUTTON face and weight, not whatever is around it: the count step
       IS a Button in the file. `inherit` took the page's face, so the digit
       came out in the body font on a docs page.
     - line-height 1: the digit is centred by the flex box, so the line box
       only has to not add leading of its own.
     - border-box: the border counts inside the 32px. A <button> gets
       border-box from the UA sheet and a <div> does not, so a step that was
       not clickable — every disabled one — drew 2px wider. */
  const IndicatorTag = clickable ? 'button' : 'div';
  const indicatorEl = (
    <IndicatorTag
      onClick={clickable ? () => onStepClick?.(_index) : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStepClick?.(_index); }
      } : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? 'Go to step ' + (_index + 1) : undefined}
      aria-current={isActive ? 'step' : undefined}
      aria-disabled={disabled || undefined}
      className={
        'step-indicator step-indicator-' + size
        + (isActive ? ' step-indicator-active' : '')
        + (isCompleted ? ' step-indicator-completed' : '')
        + (isIncomplete ? ' step-indicator-incomplete' : '')
        + (clickable ? ' step-indicator-clickable' : '')
        + ' MuiBox-root omni-st-ind ' + (isDot ? 'omni-st-ind-dot-' : 'omni-st-ind-') + sizeKey
        + (isActive ? ' omni-st-ind-cur' : '')
        + (disabled ? ' omni-st-ind-off' : clickable ? ' omni-st-ind-click' : '')
      }
      style={{
        '--_st-bd': borderToken, '--_st-bg': bgToken, '--_st-fg': textToken,
        ...(clickable && { '--_st-hv': hoverToken, '--_st-pr': activeToken }),
      }}
    >
      {isDot ? null : displayContent}
    </IndicatorTag>
  );

  /* THE BAND. Every step — numbered circle or bare dot — sits in a slot one
     Button-Height tall, and the connector's rule is centred on that same
     height. That is what lets a 12px dot and a 32px circle share one rule:
     the dot is not centred on itself, it is centred in the band.
     ACROSS the band differs from DOWN it. Horizontally the dot's slot is the
     DOT's width, because the file butts the line straight against the dot's
     edge — a 12px dot at x 0 and the line starting at x 12. Vertically the
     slot is the full Button-Height, so the rule running down the column
     passes through the dot's centre. */
  /* A dot's slot is the dot either way: Figma's No-Count Step is the 12px
     dot at x 0 with its label 8px beyond, and a rule down a column of dots
     still passes through their centres. */
  const bandedIndicator = (
    <div className={'MuiBox-root omni-st-band '
      + (isDot ? (isHorizontal ? 'omni-st-band-dot-h-' : 'omni-st-band-dot-v-') : 'omni-st-band-') + sizeKey}>
      {indicatorEl}
    </div>
  );

  // Connector line
  const connectorTraversed = _index < activeStep;
  /* Horizontally the rule sits at half the BAND, for count and noCount alike
     — measured in the file, the dot's Ellipse sits at relY 10 of a 32 row
     (centre 16) and the rule centres on 16 too: the dot is not centred on
     itself, it is centred in the band. calc, not arithmetic: the thickness
     is a token. Vertically it runs through the CENTRE of what it joins: a
     32px circle's 16, or a dot's half-width.
     Step-Line binds its stroke to Border when complete and Quiet when not.
     Border is a BUTTONS token and Quiet a SURFACE one, so a traversed
     segment follows the palette and an untravelled one follows the page.
     Dashed: 2 on, 2 off across and 4/4 down, copied from the file's dash
     arrays. */
  const connectorEl = !isLast ? (
    <div
      className={
        /* A connector is about the SEGMENT between two steps, not about the
           step it hangs off — so it is traversed or not, with no third case.
           It used to reuse the step's own isCompleted / isIncomplete, and the
           ACTIVE step is neither, so the connector leading out of the step you
           are on got no class at all. That also meant dashedIncomplete never
           dashed it: the one segment you have most clearly not travelled yet
           rendered solid. */
        'step-connector'
        + (connectorTraversed ? ' step-connector-completed' : ' step-connector-incomplete')
        + (dashedIncomplete && !connectorTraversed ? ' step-connector-dashed' : '')
        + ' MuiBox-root omni-st-con '
        + (isHorizontal ? 'omni-st-con-h-' : isDot ? 'omni-st-con-v-dot-' : 'omni-st-con-v-') + sizeKey
        + (connectorTraversed ? ' omni-st-con-done' : ' omni-st-con-todo')
        + (dashedIncomplete && !connectorTraversed ? (isHorizontal ? ' omni-st-con-dash-h' : ' omni-st-con-dash-v') : '')
      }
      style={connectorTraversed ? { '--_st-line': 'var(--Buttons-' + C + '-Border)' } : undefined}
      aria-hidden="true"
    />
  ) : null;

  /* The LABEL type style, not Caption or BodySmall. Every step label in the
     file binds Labels/Label-Font-Family and the Dynamic-Label ramp for size,
     spacing, line-height and weight — so a brand that picks a label face was
     moving the design's step labels and not the lib's. One component at every
     size, because the ramp is already per size mode.
     Its color tracks status the way the circle does: Quiet before you reach
     it, Text on the one you are on, and the palette's Border tone once it is
     behind you. That last one is a 3:1 token carrying text — see
     docs/figma-parity.md. */
  /* The current step's label is --Text; every other step's is --Quiet — the
     step you are on stands out in words as well as in the mark. (Complete was
     the palette's Border tone, a 3:1 token carrying text.) */
  const labelToken = isActive ? 'var(--Text)' : 'var(--Quiet)';
  /* While the step is hovered, pressed or focused its label reads --Text, at
     every status — Figma's Hover / Pressed / Focus-Visible variants all bind
     Surface › Text on the label. The indicator is the button and the label
     its sibling, hence :has on the step. Inline style would beat this, so
     the important flag is on purpose. */
  const labelInteractionClass = clickable ? ' omni-st-step-click' : '';
  const labelEl = displayLabel ? (
    <Label className="step-label" style={{
      /* No fontWeight: Label's own (the Label ramp) at every status. The
         file binds Dynamic-Label on all fifteen variants; bolding only the
         current step, and dropping the rest to 400, was this file's idea. */
      color: labelToken,
      textAlign: labelBelow ? 'center' : 'left',
      whiteSpace: 'nowrap',
      /* A flex item, and one that must not be squeezed: the column it sits in
         is one circle wide and the label is routinely wider. */
      flexShrink: 0,
    }}>
      {displayLabel}
    </Label>
  ) : null;

  /* The circle and its label, laid out by labelPosition — under it or beside
     it — independently of which way the steps run. */
  const indicatorAndLabel = labelBelow ? (
    <div className={'MuiBox-root omni-st-col ' + (isDot ? 'omni-st-col-dot-' : 'omni-st-col-') + sizeKey}>
      {bandedIndicator}
      {/* width 100% so the nowrap label centres on the circle and spills
          evenly both ways; it adds height to the column but never width. */}
      {/* CENTRED BY FLEX, not by text-align. The wrapper is one circle
          wide and the label is wider, so `text-align: center` only
          centres it if the label is a block that fills the wrapper —
          Label is not, so it sat against the left edge and the whole
          caption read as shifted right of its circle. A flex container
          with justify-content: center centres the item on the box and
          lets it overflow both ways, whatever the child's display. */}
      {/* A dot's label sits right under its 32px band (Figma: gap 0). */}
      {labelEl && (
        <div className={'MuiBox-root omni-st-lbl' + (isDot ? ' omni-st-lbl-dot' : '')}>{labelEl}</div>
      )}
    </div>
  ) : (
    <div className={'MuiBox-root omni-st-row' + (isDot ? ' omni-st-row-dot-' + sizeKey : '')}>
      {bandedIndicator}
      {labelEl}
    </div>
  );

  if (isHorizontal) {
    return (
      <Part
        component="li"
        className={'step step-' + size + ' step-horizontal' +
          (isActive ? ' step-active' : '') + (isCompleted ? ' step-completed' : '') +
          (isIncomplete ? ' step-incomplete' : '') + ' ' + className
          + ' MuiBox-root omni-st-step-h' + (isLast ? ' omni-st-step-last' : '') + labelInteractionClass}
        sx={sx}
        {...props}
      >
        {/* THE STEP IS ONE CIRCLE WIDE AND THE LABEL HANGS OUT OF IT.
            Count Step is layoutSizingHorizontal FIXED at Button-Height with
            clipsContent false, and its Bottom Label sits at x = -6 — 44px of
            text centred on a 32px column, overflowing 6px each side. In the
            assembled row the steps are 32 wide at x 48 / 185 / 321 and the
            lines FILL everything between them.
            Without the explicit width this column sized to the LABEL, so a
            long one pushed the connector away from the circle. That is the
            rest of the gap: removing the 8px margins was necessary and not
            sufficient, because the column itself was too wide. */}
        {indicatorAndLabel}
        {/* Connector — centered to circle via negative margin for label height */}
        {connectorEl}
      </Part>
    );
  }

  // Vertical
  return (
    <Part
      component="li"
      className={'step step-' + size + ' step-vertical' +
        (isActive ? ' step-active' : '') + (isCompleted ? ' step-completed' : '') +
        (isIncomplete ? ' step-incomplete' : '') + ' ' + className
        + ' MuiBox-root omni-st-step-v' + labelInteractionClass}
      sx={sx}
      {...props}
    >
      {/* Step and Right Label binds itemSpacing -> Sizing-1. */}
      {/* A dot's row is the dot's height and the label overflows it, centred —
          Figma's Step and Right Label is 12 tall with its 24px label at y -6. */}
      {indicatorAndLabel}
      {connectorEl}
    </Part>
  );
}

export default Stepper;
