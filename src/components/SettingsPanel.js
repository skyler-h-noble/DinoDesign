// src/components/SettingsPanel.js
import React, { useState, useEffect } from 'react';
import { useOmniDesign } from '../OmniDesignProvider';
import { Settings as SettingsIcon, Close as CloseIcon } from '@omni-design/icons';
import { Button } from './Button/Button';
import { Drawer } from './Drawer/Drawer';
import { H5, BodySmall, Caption, EyebrowSmall } from './Typography';
import { registerStaticStyles, useStaticStyles } from './_staticStyles';

/* Static sheet. The stacks keep MUI's own selectors (and so their weight):
   a child's margin is reset and the gap is a margin on every child after the
   first. The dividers are MUI's hr, with the border color the panel gave it. */
registerStaticStyles('omni-settings-panel', [
  '.omni-sp-fab{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;'
    + 'background-color:var(--Buttons-Tertiary-Button);color:var(--Buttons-Tertiary-Text);display:flex;-webkit-box-align:center;align-items:center;'
    + '-webkit-box-pack:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:999;'
    + 'transition:transform 0.15s ease,box-shadow 0.15s ease}',
  '.omni-sp-fab:hover{transform:scale(1.08);box-shadow:0 6px 16px rgba(0,0,0,0.2)}',
  '.omni-sp-inner{padding:24px;height:100%;display:flex;flex-direction:column}',
  '.omni-sp-head{display:flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:center;align-items:center;margin-bottom:16px}',
  '.omni-sp-hr{margin:0;flex-shrink:0;border-width:0 0 thin;border-style:solid;border-color:var(--Border)}',
  '.omni-sp-hr-top{margin:0 0 24px}',
  '.omni-sp-hr-bottom{margin:24px 0}',
  '.omni-sp-body{flex:1;overflow-y:auto}',
  '.omni-sp-col,.omni-sp-row{display:flex;flex-direction:column}',
  '.omni-sp-row{flex-direction:row}',
  '.omni-sp-col>:not(style):not(style),.omni-sp-row>:not(style):not(style){margin:0}',
  '.omni-sp-col>:not(style)~:not(style){margin-top:var(--_sp-gap)}',
  '.omni-sp-row>:not(style)~:not(style){margin-left:var(--_sp-gap)}',
  '.omni-sp-opt{padding:12px;border-radius:var(--Style-Border-Radius);cursor:pointer;border:1px solid var(--Border);'
    + 'background-color:transparent;display:flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:center;align-items:center;transition:all 0.15s ease}',
  '.omni-sp-opt-on{border:2px solid var(--Buttons-Primary-Button);background-color:var(--Background)}',
  '.omni-sp-opt:hover{background-color:var(--Hover)}',
  '.omni-sp-dot{width:8px;height:8px;border-radius:50%;background-color:var(--Buttons-Primary-Button);flex-shrink:0}',
].join('\n'));

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
  useStaticStyles('omni-settings-panel');

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
      <div onClick={() => setPanelOpen(true)} role="button" aria-label="Open settings"
        className="MuiBox-root omni-sp-fab">
        <SettingsIcon style={{ fontSize: 24 }} />
      </div>

      {/* Drawer — our own component carries data-theme + data-surface on
          its panel automatically, so child token references resolve correctly
          in both light and dark modes. */}
      <Drawer
        anchor="right"
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        hideBackdrop
        size="small"
        style={{ width: 320, zIndex: 99999999 }}
      >
        {/* Inner padding wrapper — the Drawer's own panel already supplies
            data-surface; this wrapper just provides padding + layout. */}
        <div className="MuiBox-root omni-sp-inner">

          {/* Header */}
          <div className="MuiBox-root omni-sp-head">
            <H5>Settings</H5>
            <Button iconOnly variant="ghost" size="small" onClick={() => setPanelOpen(false)}
              aria-label="Close settings">
              <CloseIcon fontSize="small" />
            </Button>
          </div>

          <hr className="MuiDivider-root MuiDivider-fullWidth omni-sp-hr omni-sp-hr-top" />

          <div className="MuiBox-root omni-sp-body">
            <div className="MuiStack-root omni-sp-col" style={{ '--_sp-gap': '32px' }}>

              {/* Mode */}
              <div className="MuiBox-root">
                <EyebrowSmall style={{ color: 'var(--Text)', opacity: 0.85, display: 'block', marginBottom: 12, fontWeight: 600 }}>
                  MODE
                </EyebrowSmall>
                <div className="MuiStack-root omni-sp-row" style={{ '--_sp-gap': '8px' }}>
                  <Button
                    variant={mode === 'light' ? 'primary' : 'primary-outline'}
                    size="small"
                    onClick={() => switchMode('light')}
                    style={{ flex: 1 }}>
                    Light
                  </Button>
                  <Button
                    variant={mode === 'dark' ? 'primary' : 'primary-outline'}
                    size="small"
                    onClick={() => switchMode('dark')}
                    style={{ flex: 1 }}>
                    Dark
                  </Button>
                </div>
              </div>

              {/* Platform */}
              <div className="MuiBox-root">
                <EyebrowSmall style={{ color: 'var(--Text)', opacity: 0.85, display: 'block', marginBottom: 12, fontWeight: 600 }}>
                  PLATFORM
                </EyebrowSmall>
                <div className="MuiStack-root omni-sp-col" style={{ '--_sp-gap': '8px' }}>
                  {PLATFORMS.map(({ value, label, note }) => {
                    const isSel = platform === value;
                    return (
                      <div key={value} onClick={() => handlePlatformChange(value)}
                        className={'MuiBox-root omni-sp-opt' + (isSel ? ' omni-sp-opt-on' : '')}>
                        <div className="MuiBox-root">
                          <BodySmall style={{
                            color: isSel ? 'var(--Buttons-Primary-Button)' : 'var(--Text)',
                            fontWeight: isSel ? 600 : 400,
                          }}>
                            {label}
                          </BodySmall>
                          <Caption style={{ color: 'var(--Text)', opacity: 0.7 }}>{note}</Caption>
                        </div>
                        {isSel && (
                          <div className="MuiBox-root omni-sp-dot" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          <hr className="MuiDivider-root MuiDivider-fullWidth omni-sp-hr omni-sp-hr-bottom" />

          <Button variant="primary-outline" size="small" onClick={handleReset}
            style={{ width: '100%' }}>
            Reset to Defaults
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default SettingsPanel;