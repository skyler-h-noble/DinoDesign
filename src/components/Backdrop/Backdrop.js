// src/components/Backdrop/Backdrop.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Backdrop Component
 * A semi-transparent overlay that darkens the background
 * Typically used with modals, dialogs, and menus
 */
export function Backdrop({
  open = false,
  onClick,
  children,
  sx = {},
  zIndex = 1200,
  invisible = false,
  transitionDuration = 225,
  ...props
}) {
  if (!open) return null;

  return (
    <Box
      {...props}
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: invisible
          ? 'transparent'
          : 'rgba(0, 0, 0, 0.5)',
        zIndex,
        transition: `background-color ${transitionDuration}ms ease-in-out`,
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Variant: Dark Backdrop
 * Darker overlay (70% opacity)
 */
export function DarkBackdrop({
  open = false,
  onClick,
  children,
  sx = {},
  ...props
}) {
  return (
    <Backdrop
      open={open}
      onClick={onClick}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Backdrop>
  );
}

/**
 * Variant: Light Backdrop
 * Lighter overlay (30% opacity)
 */
export function LightBackdrop({
  open = false,
  onClick,
  children,
  sx = {},
  ...props
}) {
  return (
    <Backdrop
      open={open}
      onClick={onClick}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Backdrop>
  );
}

/**
 * Variant: Invisible Backdrop
 * No visual overlay, but still blocks clicks
 */
export function InvisibleBackdrop({
  open = false,
  onClick,
  children,
  sx = {},
  ...props
}) {
  return (
    <Backdrop
      open={open}
      onClick={onClick}
      invisible
      sx={sx}
      {...props}
    >
      {children}
    </Backdrop>
  );
}

/**
 * Variant: Blurred Backdrop
 * Adds blur effect to background
 */
export function BlurredBackdrop({
  open = false,
  onClick,
  children,
  sx = {},
  blur = '4px',
  ...props
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: `blur(${blur})`,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1200,
        display: open ? 'block' : 'none',
        transition: 'all 225ms ease-in-out',
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Variant: Custom Color Backdrop
 * Use custom color with opacity
 */
export function ColoredBackdrop({
  open = false,
  onClick,
  children,
  color = 'rgba(0, 0, 0, 0.5)',
  sx = {},
  ...props
}) {
  return (
    <Backdrop
      open={open}
      onClick={onClick}
      sx={{
        backgroundColor: color,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Backdrop>
  );
}

/**
 * Variant: Animated Backdrop
 * Animates in and out smoothly
 */
export function AnimatedBackdrop({
  open = false,
  onClick,
  children,
  sx = {},
  enterDuration = 225,
  exitDuration = 195,
  ...props
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: open ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
        zIndex: 1200,
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transition: `all ${open ? enterDuration : exitDuration}ms ease-in-out`,
        pointerEvents: open ? 'auto' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/**
 * Showcase Component - All Backdrop Variants
 */
export function BackdropShowcase() {
  const [backdrops, setBackdrops] = React.useState({
    basic: false,
    dark: false,
    light: false,
    invisible: false,
    blurred: false,
    colored: false,
    animated: false,
  });

  const handleToggle = (key) => {
    setBackdrops((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>Backdrop Showcase</h2>

      {/* Basic Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Basic Backdrop</h3>
        <button onClick={() => handleToggle('basic')}>
          {backdrops.basic ? 'Close' : 'Open'} Basic Backdrop
        </button>
        <Backdrop
          open={backdrops.basic}
          onClick={() => handleToggle('basic')}
        />
      </Box>

      {/* Dark Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Dark Backdrop</h3>
        <button onClick={() => handleToggle('dark')}>
          {backdrops.dark ? 'Close' : 'Open'} Dark Backdrop
        </button>
        <DarkBackdrop
          open={backdrops.dark}
          onClick={() => handleToggle('dark')}
        />
      </Box>

      {/* Light Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Light Backdrop</h3>
        <button onClick={() => handleToggle('light')}>
          {backdrops.light ? 'Close' : 'Open'} Light Backdrop
        </button>
        <LightBackdrop
          open={backdrops.light}
          onClick={() => handleToggle('light')}
        />
      </Box>

      {/* Invisible Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Invisible Backdrop</h3>
        <button onClick={() => handleToggle('invisible')}>
          {backdrops.invisible ? 'Close' : 'Open'} Invisible Backdrop
        </button>
        <InvisibleBackdrop
          open={backdrops.invisible}
          onClick={() => handleToggle('invisible')}
        />
      </Box>

      {/* Blurred Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Blurred Backdrop</h3>
        <button onClick={() => handleToggle('blurred')}>
          {backdrops.blurred ? 'Close' : 'Open'} Blurred Backdrop
        </button>
        <BlurredBackdrop
          open={backdrops.blurred}
          onClick={() => handleToggle('blurred')}
        />
      </Box>

      {/* Colored Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Colored Backdrop</h3>
        <button onClick={() => handleToggle('colored')}>
          {backdrops.colored ? 'Close' : 'Open'} Colored Backdrop
        </button>
        <ColoredBackdrop
          open={backdrops.colored}
          onClick={() => handleToggle('colored')}
          color="rgba(33, 150, 243, 0.5)"
        />
      </Box>

      {/* Animated Backdrop */}
      <Box sx={{ mb: 3 }}>
        <h3>Animated Backdrop</h3>
        <button onClick={() => handleToggle('animated')}>
          {backdrops.animated ? 'Close' : 'Open'} Animated Backdrop
        </button>
        <AnimatedBackdrop
          open={backdrops.animated}
          onClick={() => handleToggle('animated')}
        />
      </Box>
    </Box>
  );
}

export default Backdrop;
