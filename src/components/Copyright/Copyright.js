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
export function Copyright({
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

  return (
    <div
      className={['dino-copyright', className].filter(Boolean).join(' ')}
      style={{
        padding: '14px 24px',
        textAlign: 'center',
        background: 'var(--Primary-Color-1)',
        color: 'var(--Primary-Color-12)',
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
