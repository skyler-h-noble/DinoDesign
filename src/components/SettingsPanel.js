// src/components/SettingsPanel.js
import React, { useState, useEffect } from 'react';
import { useOmniDesign } from '../OmniDesignProvider';
import { Box, Stack, Divider } from '@mui/material';
import { Settings as SettingsIcon, Close as CloseIcon } from '@mui/icons-material';
import { Button } from './Button/Button';
import { Drawer } from './Drawer/Drawer';
import { H5, BodySmall, Caption, EyebrowSmall } from './Typography';

const PLATFORMS = [
  { value: 'desktop',    label: 'Desktop',    note: '32px touch targets (WCAG)' },
  { value: 'ios-mobile', label: 'iOS Mobile', note: '44px touch targets (HIG)' },
  { value: 'ios-tablet', label: 'iOS Tablet', note: '44px touch targets (HIG)' },
  { value: 'android',    label: 'Android',    note: '48px touch targets (M3)' },
];

/* The panel's value -> the [data-platform] scope the generated CSS emits.
 *
 * This used to be PLATFORM_BUTTON_HEIGHT, a hardcoded map of four pixel
 * values, and changing platform set exactly ONE token inline on <html>:
 * --Button-Height. Everything else the platform governs — the whole
 * typography ramp, 354 variables' worth — never moved, because nothing ever
 * set data-platform. The attribute is the entire mechanism and the panel
 * was not using it.
 *
 * The four names below are what the CSS actually contains. Figma has SEVEN
 * modes: it distinguishes tablet orientation (IOS-Tablet-Vertical from
 * -Horizontal, and the Android pair) and splits Android-Mobile from the
 * Android tablets. The generator collapses those, so there is nothing here
 * to select — that gap is in exportToCSS, not in this panel. */
const PLATFORM_SCOPE = {
  'desktop':    'Desktop',
  'ios-mobile': 'IOS-Mobile',
  'ios-tablet': 'IOS-Tablet',
  'android':    'Android',
};

function applyPlatform(value) {
  const scope = PLATFORM_SCOPE[value] || 'Desktop';
  /* BOTH attributes, deliberately.
     The generator now emits [data-device="…"], but a design system's CSS is
     FROZEN in Storage and cannot be regenerated — an older system's sheet
     still selects on [data-platform="…"]. Setting only the new name would
     leave every existing system with no platform block at all, which fails
     silently: the selectors simply match nothing and every metric falls back.
     Same reasoning as the Overline -> Eyebrow alias, which is kept emitted for
     exactly this reason. */
  document.documentElement.setAttribute('data-device', scope);
  document.documentElement.setAttribute('data-platform', scope);
}

export function SettingsPanel() {
  /* The provider owns the mode sheet. useThemeMode injected a SECOND full set
     of stylesheets (css-foundation, css-mode, ...) alongside the provider's
     omni-* ones, and switchMode flipped only its own #css-mode. The provider's
     #omni-mode sits later in <head> and still pointed at Light-Mode.css, so it
     won the cascade and the toggle changed a sheet nothing was reading. */
  const { isDark, toggleDarkMode } = useOmniDesign();
  const mode = isDark ? 'dark' : 'light';
  const switchMode = (next) => {
    if ((next === 'dark') !== isDark) toggleDarkMode();
    try { localStorage.setItem('themeMode', next); } catch { /* private mode */ }
  };
  const [panelOpen, setPanelOpen] = useState(false);
  const [platform, setPlatform]   = useState('desktop');

  useEffect(() => {
    /* Platform only. The mode is restored by the Provider, which takes the
       saved value as defaultDarkMode and seeds its state with it.
       Restoring it HERE meant calling toggleDarkMode() in a mount effect, and
       React.StrictMode double-invokes those in development: the toggle ran
       twice, netted to nothing, and left the panel showing Dark over a Light
       stylesheet. Setting an attribute is idempotent; toggling is not. */
    const savedPlatform = localStorage.getItem('dino-platform') || 'desktop';
    setPlatform(savedPlatform);
    applyPlatform(savedPlatform);
  }, []);

  const handlePlatformChange = (value) => {
    setPlatform(value);
    localStorage.setItem('dino-platform', value);
    applyPlatform(value);
  };

  const handleReset = () => {
    handlePlatformChange('desktop');
    switchMode('light');
  };

  return (
    <>
      {/* FAB */}
      <Box onClick={() => setPanelOpen(true)} role="button" aria-label="Open settings"
        sx={{
          position: 'fixed', bottom: 24, right: 24,
          width: 52, height: 52, borderRadius: '50%',
          backgroundColor: 'var(--Buttons-Tertiary-Button)',
          color: 'var(--Buttons-Tertiary-Text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 999, transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': { transform: 'scale(1.08)', boxShadow: '0 6px 16px rgba(0,0,0,0.2)' },
        }}>
        <SettingsIcon sx={{ fontSize: 24 }} />
      </Box>

      {/* Drawer — our own component carries data-theme + data-surface on
          its panel automatically, so child token references resolve correctly
          in both light and dark modes. */}
      <Drawer
        anchor="right"
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        hideBackdrop
        size="small"
        sx={{ width: 320, zIndex: 99999999 }}
      >
        {/* Inner padding wrapper — the Drawer's own panel already supplies
            data-surface; this Box just provides padding + layout. */}
        <Box
          sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <H5>Settings</H5>
            <Button iconOnly variant="ghost" size="small" onClick={() => setPanelOpen(false)}
              aria-label="Close settings">
              <CloseIcon fontSize="small" />
            </Button>
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'var(--Border)' }} />

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Stack spacing={4}>

              {/* Mode */}
              <Box>
                <EyebrowSmall style={{ color: 'var(--Text)', opacity: 0.85, display: 'block', marginBottom: 12, fontWeight: 600 }}>
                  MODE
                </EyebrowSmall>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={mode === 'light' ? 'primary' : 'primary-outline'}
                    size="small"
                    onClick={() => switchMode('light')}
                    sx={{ flex: 1 }}>
                    Light
                  </Button>
                  <Button
                    variant={mode === 'dark' ? 'primary' : 'primary-outline'}
                    size="small"
                    onClick={() => switchMode('dark')}
                    sx={{ flex: 1 }}>
                    Dark
                  </Button>
                </Stack>
              </Box>

              {/* Platform */}
              <Box>
                <EyebrowSmall style={{ color: 'var(--Text)', opacity: 0.85, display: 'block', marginBottom: 12, fontWeight: 600 }}>
                  PLATFORM
                </EyebrowSmall>
                <Stack spacing={1}>
                  {PLATFORMS.map(({ value, label, note }) => {
                    const isSel = platform === value;
                    return (
                      <Box key={value} onClick={() => handlePlatformChange(value)}
                        sx={{
                          p: 1.5, borderRadius: 'var(--Style-Border-Radius)', cursor: 'pointer',
                          border: isSel ? '2px solid var(--Buttons-Primary-Button)' : '1px solid var(--Border)',
                          backgroundColor: isSel ? 'var(--Background)' : 'transparent',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          transition: 'all 0.15s ease', '&:hover': { backgroundColor: 'var(--Hover)' },
                        }}>
                        <Box>
                          <BodySmall style={{
                            color: isSel ? 'var(--Buttons-Primary-Button)' : 'var(--Text)',
                            fontWeight: isSel ? 600 : 400,
                          }}>
                            {label}
                          </BodySmall>
                          <Caption style={{ color: 'var(--Text)', opacity: 0.7 }}>{note}</Caption>
                        </Box>
                        {isSel && (
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--Buttons-Primary-Button)', flexShrink: 0 }} />
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

            </Stack>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

          <Button variant="primary-outline" size="small" onClick={handleReset}
            sx={{ width: '100%' }}>
            Reset to Defaults
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default SettingsPanel;