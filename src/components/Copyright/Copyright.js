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
const COLOR_PRESETS = {
  default:        { bg: 'var(--Primary-Color-1)',  fg: 'var(--Primary-Color-12)' },
  primary:        { theme: 'Primary',      surface: 'Surface-Dim' },
  'primary-dark': { bg: 'var(--Primary-Color-1)',  fg: 'var(--Primary-Color-12)' },
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
        padding: '14px 24px',
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
