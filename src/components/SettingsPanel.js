// src/components/SettingsPanel.js
import React, { useState, useEffect } from 'react';
import { Box, Drawer, Stack, Divider } from '@mui/material';
import { Settings as SettingsIcon, Close as CloseIcon } from '@mui/icons-material';
import { useThemeMode } from '../theme/useThemeMode';
import { Button } from './Button/Button';
import { H5, BodySmall, Caption, OverlineSmall } from './Typography';

const PLATFORMS = [
  { value: 'desktop',    label: 'Desktop',    note: '32px touch targets (WCAG)' },
  { value: 'ios-mobile', label: 'iOS Mobile', note: '44px touch targets (HIG)' },
  { value: 'ios-tablet', label: 'iOS Tablet', note: '44px touch targets (HIG)' },
  { value: 'android',    label: 'Android',    note: '48px touch targets (M3)' },
];

const PLATFORM_BUTTON_HEIGHT = {
  'desktop':    '32px',
  'ios-mobile': '44px',
  'ios-tablet': '44px',
  'android':    '48px',
};

export function SettingsPanel() {
  const { mode, switchMode } = useThemeMode('light');
  const [panelOpen, setPanelOpen] = useState(false);
  const [platform, setPlatform]   = useState('desktop');

  useEffect(() => {
    const savedPlatform = localStorage.getItem('dino-platform') || 'desktop';
    const savedTheme    = localStorage.getItem('themeMode')     || 'light';
    setPlatform(savedPlatform);
    document.documentElement.style.setProperty('--Button-Height', PLATFORM_BUTTON_HEIGHT[savedPlatform] || '32px');
    if (savedTheme === 'dark') switchMode('dark');
  }, []);

  const handlePlatformChange = (value) => {
    setPlatform(value);
    localStorage.setItem('dino-platform', value);
    document.documentElement.style.setProperty('--Button-Height', PLATFORM_BUTTON_HEIGHT[value] || '32px');
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

      {/* Drawer */}
      <Drawer anchor="right" open={panelOpen} onClose={() => setPanelOpen(false)}
        hideBackdrop
        ModalProps={{ keepMounted: true }}
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'var(--Background)',
            color: 'var(--Text)',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.12)',
          },
        }}>

        {/* Inner wrapper with surface context */}
        <Box
          data-theme="Default"
          data-surface="Surface-Dim"
          sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--Background)' }}>

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
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                  MODE
                </OverlineSmall>
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
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 12 }}>
                  PLATFORM
                </OverlineSmall>
                <Stack spacing={1}>
                  {PLATFORMS.map(({ value, label, note }) => {
                    const isSel = platform === value;
                    return (
                      <Box key={value} onClick={() => handlePlatformChange(value)}
                        sx={{
                          p: 1.5, borderRadius: 'var(--Style-Border-Radius)', cursor: 'pointer',
                          border: isSel ? '2px solid var(--Buttons-Primary-Button)' : '1px solid var(--Border)',
                          backgroundColor: isSel ? 'var(--Surface)' : 'transparent',
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
                          <Caption style={{ color: 'var(--Text-Quiet)' }}>{note}</Caption>
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