// src/components/BackgroundPicker.js
import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Caption, OverlineSmall } from './Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * BackgroundPicker
 *
 * Dropdown control for selecting a preview background/surface theme.
 * Place in the playground tab. Passes selected theme to PreviewSurface.
 *
 * Usage:
 *   const [bgTheme, setBgTheme] = useState(null);
 *   <BackgroundPicker value={bgTheme} onChange={setBgTheme} />
 *   <PreviewSurface theme={bgTheme}>...</PreviewSurface>
 */

export const BACKGROUND_OPTIONS = [
  { label: 'Default',          theme: null },
  { label: 'Primary Light',    theme: 'Primary-Light' },
  { label: 'Secondary Light',  theme: 'Secondary-Light' },
  { label: 'Tertiary Light',   theme: 'Tertiary-Light' },
  { label: 'Neutral Light',    theme: 'Neutral-Light' },
  { label: 'Info Light',       theme: 'Info-Light' },
  { label: 'Success Light',    theme: 'Success-Light' },
  { label: 'Warning Light',    theme: 'Warning-Light' },
  { label: 'Error Light',      theme: 'Error-Light' },
  { label: 'Primary Medium',   theme: 'Primary' },
  { label: 'Secondary Medium', theme: 'Secondary' },
  { label: 'Tertiary Medium',  theme: 'Tertiary' },
  { label: 'Neutral Medium',   theme: 'Neutral' },
  { label: 'Info Medium',      theme: 'Info-Medium' },
  { label: 'Success Medium',   theme: 'Success-Medium' },
  { label: 'Warning Medium',   theme: 'Warning-Medium' },
  { label: 'Error Medium',     theme: 'Error-Medium' },
  { label: 'Primary Dark',     theme: 'Primary-Dark' },
  { label: 'Secondary Dark',   theme: 'Secondary-Dark' },
  { label: 'Tertiary Dark',    theme: 'Tertiary-Dark' },
  { label: 'Neutral Dark',     theme: 'Neutral-Dark' },
  { label: 'Info Dark',        theme: 'Info-Dark' },
  { label: 'Success Dark',     theme: 'Success-Dark' },
  { label: 'Warning Dark',     theme: 'Warning-Dark' },
  { label: 'Error Dark',       theme: 'Error-Dark' },
];

const GROUPS = [
  { label: 'Default', items: BACKGROUND_OPTIONS.slice(0, 1) },
  { label: 'Light',   items: BACKGROUND_OPTIONS.slice(1, 9) },
  { label: 'Medium',  items: BACKGROUND_OPTIONS.slice(9, 17) },
  { label: 'Dark',    items: BACKGROUND_OPTIONS.slice(17) },
];

// Swatch — a tiny circle showing the actual background color for a given theme
function Swatch({ theme }) {
  return (
    <Box
      data-theme={theme || undefined}
      data-surface="Surface"
      sx={{
        width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border)',
      }}
    />
  );
}

export function BackgroundPicker({ value = null, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = BACKGROUND_OPTIONS.find(o => o.theme === value) || BACKGROUND_OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <Box>
      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
        BACKGROUND
      </OverlineSmall>

      <Box ref={ref} sx={{ position: 'relative', display: 'inline-block' }}>
        {/* Trigger button */}
        <Box
          component="button"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            height: 'var(--Button-Height)',
            px: 1.5,
            border: open
              ? '2px solid var(--Buttons-Primary-Button)'
              : '1px solid var(--Border)',
            borderRadius: 'var(--Style-Border-Radius)',
            backgroundColor: 'var(--Background)',
            cursor: 'pointer', fontFamily: 'inherit',
            minWidth: 160,
            transition: 'border-color 0.15s ease',
            '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
          }}>
          <Swatch theme={selected.theme} />
          <Caption style={{ color: 'var(--Text)', flex: 1, textAlign: 'left' }}>
            {selected.label}
          </Caption>
          <ExpandMoreIcon sx={{
            fontSize: 16, color: 'var(--Quiet)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }} />
        </Box>

        {/* Dropdown */}
        {open && (
          <Box
            role="listbox"
            sx={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200,
              backgroundColor: 'var(--Background)',
              border: '1px solid var(--Border)',
              borderRadius: 'var(--Style-Border-Radius)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              maxHeight: 280, overflowY: 'auto', minWidth: 180,
            }}>
            {GROUPS.map(({ label, items }) => (
              <Box key={label}>
                {/* Group header */}
                <Box sx={{ px: 1.5, py: 0.5, backgroundColor: 'var(--Surface-Dim)', position: 'sticky', top: 0 }}>
                  <Caption style={{
                    color: 'var(--Text-Quiet)', fontSize: '10px',
                    fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {label}
                  </Caption>
                </Box>

                {items.map((opt) => {
                  const isSel = opt.theme === value;
                  return (
                    <Box
                      key={opt.label}
                      role="option"
                      aria-selected={isSel}
                      onClick={() => { onChange(opt.theme); setOpen(false); }}
                      sx={{
                        px: 1.5, py: 0.75, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 1,
                        backgroundColor: isSel ? 'var(--Surface)' : 'transparent',
                        '&:hover': { backgroundColor: 'var(--Hover)' },
                      }}>
                      <Swatch theme={opt.theme} />
                      <Caption style={{
                        color: 'var(--Text)',
                        fontWeight: isSel ? 600 : 400,
                        flex: 1,
                      }}>
                        {opt.label}
                      </Caption>
                      {isSel && (
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--Buttons-Primary-Button)', flexShrink: 0 }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default BackgroundPicker;