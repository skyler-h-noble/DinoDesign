// contrast.js
//
// One implementation of the WCAG contrast maths for every showcase's
// accessibility panel.
//
// There were fourteen copies of this, and thirteen of them accepted only
// `#rrggbb`. That matters because these values come from getComputedStyle,
// which returns whatever the cascade resolved to — and a token that passes
// through color-mix() or is authored as rgb() comes back in a form the hex-only
// parser rejected. It returned null, the panel printed "--", and a row with no
// measurement was drawn identically to a row that had failed. The version kept
// here is the one from the Button page, which parses #rgb / #rrggbb / #rrggbbaa
// and rgb()/rgba(), and alpha-composites a translucent colour over the surface
// behind it before measuring.
//
// getContrast returns null when it genuinely cannot measure. Callers must treat
// null as "unknown", never as "fails" — see UNMEASURED in the badges.

export function parseColor(str) {
  if (!str) return null;
  const s = str.trim();

  // #RGB
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    return {
      r: parseInt(s[1] + s[1], 16), g: parseInt(s[2] + s[2], 16),
      b: parseInt(s[3] + s[3], 16), a: 1,
    };
  }
  // #RRGGBB
  if (/^#[0-9a-f]{6}$/i.test(s)) {
    return {
      r: parseInt(s.substring(1, 3), 16), g: parseInt(s.substring(3, 5), 16),
      b: parseInt(s.substring(5, 7), 16), a: 1,
    };
  }
  // #RRGGBBAA
  if (/^#[0-9a-f]{8}$/i.test(s)) {
    return {
      r: parseInt(s.substring(1, 3), 16), g: parseInt(s.substring(3, 5), 16),
      b: parseInt(s.substring(5, 7), 16), a: parseInt(s.substring(7, 9), 16) / 255,
    };
  }
  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbaMatch = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/);
  if (rgbaMatch) {
    let a = 1;
    if (rgbaMatch[4] !== undefined) {
      a = rgbaMatch[4].endsWith('%') ? parseFloat(rgbaMatch[4]) / 100 : parseFloat(rgbaMatch[4]);
    }
    return {
      r: Math.round(parseFloat(rgbaMatch[1])), g: Math.round(parseFloat(rgbaMatch[2])),
      b: Math.round(parseFloat(rgbaMatch[3])), a,
    };
  }
  return null;
}

// Alpha-composite foreground over opaque background, return opaque {r,g,b,a:1}.
export function compositeOver(fg, bg) {
  if (!fg || !bg) return fg || bg;
  if (fg.a >= 1) return fg;
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1,
  };
}

export function getLuminance(color) {
  const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(color.r / 255) + 0.7152 * toLinear(color.g / 255) + 0.0722 * toLinear(color.b / 255);
}

// Compute contrast between two CSS color strings. Semi-transparent colors are
// composited: color1 is the foreground text/icon, color2 is the background.
// An optional bgBase is the opaque surface behind color2 (for when color2
// itself is semi-transparent, e.g. a hover overlay on a button fill).
export function getContrast(color1, color2, bgBase) {
  const fg = parseColor(color1);
  const bg2 = parseColor(color2);
  const base = parseColor(bgBase);
  if (!fg || !bg2) return null;
  // Resolve bg: composite color2 over bgBase if both exist, else use color2
  const resolvedBg = base ? compositeOver(bg2, base) : (bg2.a < 1 ? null : bg2);
  if (!resolvedBg) return null;
  // Composite fg over resolved bg (handles semi-transparent text)
  const resolvedFg = compositeOver(fg, resolvedBg);
  if (!resolvedFg) return null;
  const l1 = getLuminance(resolvedFg);
  const l2 = getLuminance(resolvedBg);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}
export function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}
export function getCssVarFrom(el, varName) {
  if (!el) return null;
  return getComputedStyle(el).getPropertyValue(varName).trim() || null;
}

