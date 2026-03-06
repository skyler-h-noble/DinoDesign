// src/components/SettingsPanel.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
} from '@mui/material';
import { Settings as SettingsIcon, Close as CloseIcon } from '@mui/icons-material';
import { useThemeMode } from '../theme/useThemeMode';
import { loadModeCSS } from '../utils/cssLoader';

/**
 * SettingsPanel Component
 * Allows users to customize:
 * - Light/Dark mode
 * - Background variant (Default, Primary, Secondary, Tertiary, Neutral, Neutral-Variant)
 * - Surface theme
 */
export function SettingsPanel() {
  const { mode, switchMode } = useThemeMode('light');
  const [panelOpen, setPanelOpen] = useState(false);
  const [lightModeType, setLightModeType] = useState('Light-Mode-Tonal');
  const [backgroundVariant, setBackgroundVariant] = useState('Default');
  const [surfaceTheme, setSurfaceTheme] = useState('Surface');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('--Light-Mode') || 'Light-Mode-Tonal';
    const savedBg = localStorage.getItem('--Background-Variant') || 'Default';
    const savedSurface = localStorage.getItem('--Surface-Theme') || 'Surface';

    setLightModeType(savedMode);
    setBackgroundVariant(savedBg);
    setSurfaceTheme(savedSurface);
  }, []);

  // Handle Light Mode type change
  const handleLightModeChange = (e) => {
    const newMode = e.target.value;
    setLightModeType(newMode);
    localStorage.setItem('--Light-Mode', newMode);
    loadModeCSS(newMode);
  };

  // Handle Background variant change
  const handleBackgroundChange = (e) => {
    const newBg = e.target.value;
    setBackgroundVariant(newBg);
    localStorage.setItem('--Background-Variant', newBg);
    
    // Update CSS variable
    document.documentElement.style.setProperty('--Background-Variant', newBg);
  };

  // Handle Surface theme change
  const handleSurfaceChange = (e) => {
    const newSurface = e.target.value;
    setSurfaceTheme(newSurface);
    localStorage.setItem('--Surface-Theme', newSurface);
    
    // Update CSS variable
    document.documentElement.style.setProperty('--Surface-Theme', newSurface);
  };

  // Reset all settings to defaults
  const handleReset = () => {
    setLightModeType('Light-Mode-Tonal');
    setBackgroundVariant('Default');
    setSurfaceTheme('Surface');
    
    localStorage.setItem('--Light-Mode', 'Light-Mode-Tonal');
    localStorage.setItem('--Background-Variant', 'Default');
    localStorage.setItem('--Surface-Theme', 'Surface');
    
    document.documentElement.style.setProperty('--Background-Variant', 'Default');
    document.documentElement.style.setProperty('--Surface-Theme', 'Surface');
    
    loadModeCSS('Light-Mode-Tonal');
  };

  return (
    <>
      {/* Floating Settings Button */}
      <Box
        onClick={() => setPanelOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--Buttons-Tertiary-Button)',
          color: 'var(--Buttons-Tertiary-Button-Text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease-in-out',
          zIndex: 999,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <SettingsIcon sx={{ fontSize: 28 }} />
      </Box>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        hideBackdrop={true} // No overlay backdrop
        sx={{
          zIndex: 1400,
        }}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 360,
            background: 'var(--Background)',
            color: 'var(--Text)',
            boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Settings
            </Typography>
            <Box
              onClick={() => setPanelOpen(false)}
              sx={{
                cursor: 'pointer',
                p: 1,
                borderRadius: 0.5,
                '&:hover': {
                  backgroundColor: 'var(--Container-Low)',
                },
              }}
            >
              <CloseIcon />
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'var(--Border)' }} />

          {/* Scrollable Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Stack spacing={4}>
              {/* Light Mode Type */}
              <FormControl>
                <FormLabel sx={{ color: 'var(--Text)', fontWeight: 600, mb: 1.5 }}>
                  Light Mode Style
                </FormLabel>
                <RadioGroup value={lightModeType} onChange={handleLightModeChange}>
                  <FormControlLabel
                    value="Light-Mode-Tonal"
                    control={<Radio />}
                    label="Tonal"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Light-Mode-Professional"
                    control={<Radio />}
                    label="Professional"
                    sx={{ color: 'var(--Text)' }}
                  />
                </RadioGroup>
              </FormControl>

              {/* Background Variant */}
              <FormControl>
                <FormLabel sx={{ color: 'var(--Text)', fontWeight: 600, mb: 1.5 }}>
                  Background Variant
                </FormLabel>
                <RadioGroup value={backgroundVariant} onChange={handleBackgroundChange}>
                  <FormControlLabel
                    value="Default"
                    control={<Radio />}
                    label="Default"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Primary"
                    control={<Radio />}
                    label="Primary"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Secondary"
                    control={<Radio />}
                    label="Secondary"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Tertiary"
                    control={<Radio />}
                    label="Tertiary"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Neutral"
                    control={<Radio />}
                    label="Neutral"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Neutral-Variant"
                    control={<Radio />}
                    label="Neutral-Variant"
                    sx={{ color: 'var(--Text)' }}
                  />
                </RadioGroup>
              </FormControl>

              {/* Surface Theme */}
              <FormControl>
                <FormLabel sx={{ color: 'var(--Text)', fontWeight: 600, mb: 1.5 }}>
                  Surface Theme
                </FormLabel>
                <RadioGroup value={surfaceTheme} onChange={handleSurfaceChange}>
                  <FormControlLabel
                    value="Surface"
                    control={<Radio />}
                    label="Surface"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Surface-Dim"
                    control={<Radio />}
                    label="Surface Dim"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="Surface-Bright"
                    control={<Radio />}
                    label="Surface Bright"
                    sx={{ color: 'var(--Text)' }}
                  />
                </RadioGroup>
              </FormControl>

              {/* Mode Toggle */}
              <FormControl>
                <FormLabel sx={{ color: 'var(--Text)', fontWeight: 600, mb: 1.5 }}>
                  Theme Mode
                </FormLabel>
                <RadioGroup value={mode} onChange={(e) => switchMode(e.target.value)}>
                  <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label="Light"
                    sx={{ color: 'var(--Text)' }}
                  />
                  <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label="Dark"
                    sx={{ color: 'var(--Text)' }}
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'var(--Border)' }} />

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleReset}
            sx={{
              width: '100%',
              color: 'var(--Text)',
              borderColor: 'var(--Border)',
              '&:hover': {
                backgroundColor: 'var(--Container-Low)',
              },
            }}
          >
            Reset to Defaults
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default SettingsPanel;