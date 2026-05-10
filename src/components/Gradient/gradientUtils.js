// src/components/Gradient/gradientUtils.js
// Pure helpers for gradient CSS generation, accessibility zone validation,
// and color token resolution.

/**
 * Color family → CSS custom property prefix mapping.
 * Only brand + neutral families are available for gradients.
 */
const FAMILY_PREFIX = {
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  black:     'BW',
  white:     'BW',
};

const FAMILIES = Object.keys(FAMILY_PREFIX);

// ── Accessibility Zones ─────────────────────────────────────────────────────
// Tones 1-5 = dark (need light text overlay).
// Tones 6-12 = light (need dark text overlay).

const DARK_TONES  = [1, 2, 3, 4, 5];
const LIGHT_TONES = [6, 7, 8, 9, 10, 11, 12];
const ALL_TONES   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Get the visual zone for a tone.
 * For most families: tones 1-5 = dark, 6-12 = light.
 * BW is inverted: tones 1-5 = white (light), 6-12 = black (dark).
 */
function getZone(tone, family) {
  if (family === 'black' || family === 'white') {
    // BW tokens: 1-5 = #ffffff (light), 6-12 = #040404 (dark)
    return tone <= 5 ? 'light' : 'dark';
  }
  return tone <= 5 ? 'dark' : 'light';
}

/**
 * Get allowed tones for a given zone.
 * For brand families: dark = 1-5, light = 6-12.
 * For BW: dark = 6-12, light = 1-5.
 */
function getAllowedTonesForFamily(zone, family) {
  if (family === 'black' || family === 'white') {
    return zone === 'dark' ? LIGHT_TONES : DARK_TONES; // BW inverted
  }
  return zone === 'dark' ? DARK_TONES : LIGHT_TONES;
}

function getAllowedTones(heroTone, heroFamily) {
  const zone = getZone(heroTone, heroFamily);
  // Return brand-family tones (non-BW families use this by default)
  return zone === 'dark' ? DARK_TONES : LIGHT_TONES;
}

function getTextColor(zone) {
  // dark zone → light text (BW 1-5 = white)
  // light zone → dark text (BW 6-12 = black)
  return zone === 'dark' ? 'var(--BW-Color-1)' : 'var(--BW-Color-6)';
}

function validateZone(items) {
  if (!items || items.length === 0) return true;
  const zone = getZone(items[0].tone, items[0].family);
  return items.every((item) => getZone(item.tone, item.family) === zone);
}

// ── CSS Custom Property Resolution ──────────────────────────────────────────

function getColorVar(family, tone) {
  const prefix = FAMILY_PREFIX[family] || 'Primary';
  return 'var(--' + prefix + '-Color-' + tone + ')';
}

// ── CSS Generation ──────────────────────────────────────────────────────────

function buildLinearCSS(stops, angle) {
  if (!stops || stops.length === 0) return 'none';
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const parts = sorted.map(
    (s) => getColorVar(s.family, s.tone) + ' ' + s.position + '%'
  );
  return 'linear-gradient(' + angle + 'deg, ' + parts.join(', ') + ')';
}

function buildRadialCSS(stops, position) {
  if (!stops || stops.length === 0) return 'none';
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const parts = sorted.map(
    (s) => getColorVar(s.family, s.tone) + ' ' + s.position + '%'
  );
  const pos = position || { x: 50, y: 50 };
  return 'radial-gradient(circle at ' + pos.x + '% ' + pos.y + '%, ' + parts.join(', ') + ')';
}

function buildMeshCSS(blobs) {
  if (!blobs || blobs.length === 0) return 'none';
  const layers = blobs.map((blob) => {
    const color = getColorVar(blob.family, blob.tone);
    const spread = blob.spread || 40;
    return 'radial-gradient(circle at ' + blob.x + '% ' + blob.y + '%, ' +
      color + ' 0%, transparent ' + spread + '%)';
  });
  const base = getColorVar(blobs[0].family, blobs[0].tone);
  layers.push(base);
  return layers.join(', ');
}

// ── Per-Color Default Presets ───────────────────────────────────────────────

const COLOR_PRESETS = {
  primary: {
    linear:   [{ family: 'primary', tone: 8, position: 0 }, { family: 'primary', tone: 11, position: 100 }],
    radial:   [{ family: 'primary', tone: 8, position: 0 }, { family: 'primary', tone: 11, position: 100 }],
    mesh:     [{ family: 'primary', tone: 8, x: 20, y: 20, spread: 60 }, { family: 'primary', tone: 9, x: 80, y: 30, spread: 50 }, { family: 'primary', tone: 10, x: 50, y: 80, spread: 55 }],
    meshCard: [{ family: 'primary', tone: 3, x: 10, y: 10, spread: 60 }, { family: 'primary', tone: 6, x: 80, y: 20, spread: 50 }, { family: 'primary', tone: 9, x: 40, y: 80, spread: 55 }],
  },
  secondary: {
    linear:   [{ family: 'secondary', tone: 7, position: 0 }, { family: 'secondary', tone: 10, position: 100 }],
    radial:   [{ family: 'secondary', tone: 7, position: 0 }, { family: 'secondary', tone: 10, position: 100 }],
    mesh:     [{ family: 'secondary', tone: 7, x: 15, y: 25, spread: 55 }, { family: 'secondary', tone: 9, x: 75, y: 35, spread: 50 }, { family: 'secondary', tone: 11, x: 45, y: 75, spread: 60 }],
    meshCard: [{ family: 'secondary', tone: 2, x: 15, y: 15, spread: 55 }, { family: 'secondary', tone: 5, x: 85, y: 25, spread: 50 }, { family: 'secondary', tone: 8, x: 50, y: 75, spread: 60 }],
  },
  tertiary: {
    linear:   [{ family: 'tertiary', tone: 8, position: 0 }, { family: 'tertiary', tone: 11, position: 100 }],
    radial:   [{ family: 'tertiary', tone: 8, position: 0 }, { family: 'tertiary', tone: 11, position: 100 }],
    mesh:     [{ family: 'tertiary', tone: 8, x: 25, y: 15, spread: 55 }, { family: 'tertiary', tone: 10, x: 70, y: 40, spread: 50 }, { family: 'tertiary', tone: 11, x: 40, y: 85, spread: 55 }],
    meshCard: [{ family: 'tertiary', tone: 3, x: 20, y: 10, spread: 60 }, { family: 'tertiary', tone: 7, x: 75, y: 30, spread: 50 }, { family: 'tertiary', tone: 10, x: 45, y: 80, spread: 55 }],
  },
  black: {
    // Black linear/radial: BW (6-12 = black) + Neutral (1-5 = dark)
    linear:   [{ family: 'black', tone: 10, position: 0 }, { family: 'neutral', tone: 3, position: 100 }],
    radial:   [{ family: 'black', tone: 10, position: 0 }, { family: 'neutral', tone: 3, position: 100 }],
    mesh:     [{ family: 'black', tone: 10, x: 0, y: 0, spread: 100 }, { family: 'primary', tone: 3, x: 25, y: 25, spread: 50 }, { family: 'secondary', tone: 4, x: 75, y: 35, spread: 45 }, { family: 'tertiary', tone: 3, x: 50, y: 80, spread: 50 }],
    meshCard: [{ family: 'black', tone: 11, x: 0, y: 0, spread: 100 }, { family: 'primary', tone: 5, x: 20, y: 20, spread: 55 }, { family: 'secondary', tone: 8, x: 80, y: 30, spread: 45 }, { family: 'tertiary', tone: 10, x: 45, y: 80, spread: 50 }],
  },
  white: {
    // White linear/radial: BW (1-5 = white) + Neutral (6-12 = light)
    linear:   [{ family: 'white', tone: 2, position: 0 }, { family: 'neutral', tone: 9, position: 100 }],
    radial:   [{ family: 'white', tone: 2, position: 0 }, { family: 'neutral', tone: 9, position: 100 }],
    mesh:     [{ family: 'white', tone: 2, x: 0, y: 0, spread: 100 }, { family: 'primary', tone: 9, x: 25, y: 25, spread: 50 }, { family: 'secondary', tone: 8, x: 75, y: 35, spread: 45 }, { family: 'tertiary', tone: 9, x: 50, y: 80, spread: 50 }],
    meshCard: [{ family: 'white', tone: 1, x: 0, y: 0, spread: 100 }, { family: 'primary', tone: 4, x: 20, y: 20, spread: 55 }, { family: 'secondary', tone: 7, x: 80, y: 30, spread: 45 }, { family: 'tertiary', tone: 10, x: 45, y: 80, spread: 50 }],
  },
};

function getPreset(color, variant) {
  const presets = COLOR_PRESETS[color] || COLOR_PRESETS.primary;
  const items = presets[variant] || presets.linear;
  return items.map((item) => ({ ...item }));
}

export {
  FAMILY_PREFIX,
  FAMILIES,
  DARK_TONES,
  LIGHT_TONES,
  ALL_TONES,
  COLOR_PRESETS,
  getZone,
  getAllowedTones,
  getAllowedTonesForFamily,
  getTextColor,
  validateZone,
  getColorVar,
  buildLinearCSS,
  buildRadialCSS,
  buildMeshCSS,
  getPreset,
};
