// src/components/Gradient/Gradient.js
import React from 'react';
import { Box } from '@mui/material';
import { Card, CardContent } from '../Card/Card';
import {
  getZone,
  getTextColor,
  buildLinearCSS,
  buildRadialCSS,
  buildMeshCSS,
  getPreset,
} from './gradientUtils';

/**
 * Gradient Component
 *
 * Three variants:
 *   linear     CSS linear-gradient with configurable angle + stops.
 *   mesh       Simulated mesh gradient (stacked radial-gradients).
 *   meshCard   Mesh gradient background with a Card overlay for content.
 *
 * ACCESSIBILITY:
 *   linear & mesh enforce an accessibility zone — all tones must be in the
 *   same zone (1-5 dark or 6-12 light) so a single text color works across
 *   the entire surface. meshCard is exempt because content lives inside the
 *   Card, which provides its own themed background.
 *
 * COLORS:
 *   Each stop/blob has a `family` (primary, secondary, tertiary, neutral,
 *   black, white, info, success, warning, error) and a `tone` (1-12).
 *   Cross-family gradients are supported.
 */

export function Gradient({
  variant = 'linear',
  color = 'primary',

  // Linear / Radial
  angle = 135,
  stops = null,
  position = null,       // radial center { x, y } — default { 50, 50 }

  // Mesh / MeshCard
  blobs = null,

  // MeshCard
  cardProps = {},

  // Common
  minHeight = 300,
  children,
  className = '',
  sx = {},
  ...props
}) {
  const isMeshCard = variant === 'meshCard';
  const isMesh = variant === 'mesh' || isMeshCard;
  const isRadial = variant === 'radial';
  const isStopBased = variant === 'linear' || isRadial;

  // Resolve defaults from presets
  const effectiveStops = stops || getPreset(color, isRadial ? 'radial' : 'linear');
  const effectiveBlobs = blobs || getPreset(color, isMeshCard ? 'meshCard' : 'mesh');

  // Build CSS
  const background = isMesh
    ? buildMeshCSS(effectiveBlobs)
    : isRadial
      ? buildRadialCSS(effectiveStops, position || { x: 50, y: 50 })
      : buildLinearCSS(effectiveStops, angle);

  // Determine text color from the hero (first item) zone
  const heroItem = isStopBased ? effectiveStops[0] : effectiveBlobs[0];
  const heroTone = heroItem?.tone || 8;
  const heroFamily = heroItem?.family || 'primary';
  const zone = getZone(heroTone, heroFamily);
  const textColor = getTextColor(zone);

  // ── MeshCard ──────────────────────────────────────────────────────────────
  if (isMeshCard) {
    return (
      <Box
        className={'gradient gradient-mesh-card ' + className}
        sx={{
          background,
          minHeight,
          borderRadius: 'var(--Card-Radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--Card-Padding)',
          position: 'relative',
          overflow: 'hidden',
          ...sx,
        }}
        {...props}
      >
        <Card variant="solid" {...cardProps}>
          <CardContent>{children}</CardContent>
        </Card>
      </Box>
    );
  }

  // ── Linear / Mesh ─────────────────────────────────────────────────────────
  return (
    <Box
      className={'gradient gradient-' + variant + ' ' + className}
      sx={{
        background,
        minHeight,
        borderRadius: 'var(--Card-Radius)',
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// ── Convenience Exports ─────────────────────────────────────────────────────

export const LinearGradient   = (p) => <Gradient variant="linear"   {...p} />;
export const RadialGradient   = (p) => <Gradient variant="radial"   {...p} />;
export const MeshGradient     = (p) => <Gradient variant="mesh"     {...p} />;
export const MeshCardGradient = (p) => <Gradient variant="meshCard" {...p} />;

export default Gradient;
