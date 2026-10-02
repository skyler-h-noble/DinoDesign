// src/components/Copyright/Copyright.js
import React from 'react';
import { BodySmall } from '../Typography';

/**
 * Copyright Component
 *
 * Bottom-of-footer copyright strip. Defaults to:
 *   © {year} {companyName}. All rights reserved.
 *
 * Renders on `--Primary-Color-1` (darkest brand tone) with light text so it
 * sits visually under the Footer (which uses `--Primary-Color-2`).
 *
 * Props:
 *   companyName — string, appended after the year
 *   year        — number, defaults to current year
 *   rights      — string, "All rights reserved" by default; pass '' to omit
 *   children    — override the entire text content
 *   className, style, ...rest — forwarded to the wrapper
 */
// Color presets mirror Footer's. Each maps to a (bg, fg) pair OR a
// data-theme/data-surface combo that lets the cascade resolve the tone.
/* Theme + surface, matching Figma. The Copyright instance inside the Footer
 * (9250:8302) pins Theme=Neutral, Surface=Surface-Dimmest and binds its fill
 * to Background — the same surface LEVEL as the Footer around it, differing by
 * theme. That is where the two-tone comes from.
 *
 * This used to paint `var(--Primary-Color-1)` against the Footer's
 * `--Primary-Color-2`: a tone-index pair chosen to look one step darker. It
 * worked, which is why it survived, but it painted the box without declaring a
 * surface — so the text, borders and links inside kept resolving against
 * whatever surface the parent had. */
const COLOR_PRESETS = {
  default:        { theme: 'Neutral', surface: 'Surface-Dimmest' },
  primary:        { theme: 'Primary', surface: 'Surface-Dim' },
  'primary-dark': { theme: 'Primary', surface: 'Surface-Dimmest' },
  white:          { bg: 'var(--Neutral-Color-11)', fg: 'var(--Neutral-Color-3)' },
  black:          { bg: 'var(--Neutral-Color-1)',  fg: 'var(--Neutral-Color-12)' },
};

export function Copyright({
  color = 'default',
  companyName = '',
  year = new Date().getFullYear(),
  rights = 'All rights reserved',
  children,
  className,
  style,
  ...rest
}) {
  const text =
    children ??
    `© ${year}${companyName ? ' ' + companyName : ''}.${rights ? ' ' + rights + '.' : ''}`;

  const preset = COLOR_PRESETS[color] || COLOR_PRESETS.default;
  const themeAttrs = preset.theme
    ? { 'data-theme': preset.theme, 'data-surface': preset.surface || 'Surface-Dim' }
    : {};
  const paintStyle = preset.theme
    ? { background: 'var(--Background)', color: 'var(--Text)' }
    : { background: preset.bg, color: preset.fg };

  return (
    <div
      {...themeAttrs}
      className={['dino-copyright', className].filter(Boolean).join(' ')}
      style={{
        /* Sizing-2 vertically, as Figma binds it. The horizontal padding is
           bound to `Margin` there, which the CSS generator does not emit at
           all — so 24px stands in until it does. */
        padding: 'var(--Sizing-2, 16px) 24px',
        textAlign: 'center',
        ...paintStyle,
        ...style,
      }}
      {...rest}
    >
      <BodySmall style={{ color: 'inherit', opacity: 0.85 }}>
        {text}
      </BodySmall>
    </div>
  );
}

export default Copyright;
