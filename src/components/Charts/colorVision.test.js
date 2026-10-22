import React from 'react';
import { render } from '@testing-library/react';
import { CHART_COLOR_VISION, COLOR_VISIONS, chartColorVisionCSS } from './colorVision';
import { OmniDesignProvider } from '../../OmniDesignProvider';

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
/* Checked against plain white / near-black AND Surf's Up's own grounds: the
   values are shared by every brand, so they must pass on the hardest ground. */
const GROUNDS = { light: ['#ffffff', '#fffcf7'], dark: ['#121212', '#322e25'] };

describe('chart color-vision sets', () => {
  test('seven sets, each ten series and four states', () => {
    expect(COLOR_VISIONS).toEqual(['red-weak', 'red-blind', 'green-weak', 'green-blind', 'blue-weak', 'blue-blind', 'blue-cone']);
    for (const set of Object.values(CHART_COLOR_VISION)) {
      expect(set.series).toHaveLength(10);
      expect(Object.keys(set.states)).toEqual(['Error', 'Warning', 'Success', 'Info']);
    }
  });

  test('every color clears 3:1 on its ground', () => {
    const fails = [];
    for (const [attr, set] of Object.entries(CHART_COLOR_VISION)) {
      const all = [...set.series.map((p, i) => [`Chart-${i + 1}`, p]), ...Object.entries(set.states)];
      for (const [name, [light, dark]] of all) {
        for (const g of GROUNDS.light) if (contrast(light, g) < 3) fails.push(`${attr} ${name} light ${light} on ${g}`);
        for (const g of GROUNDS.dark) if (contrast(dark, g) < 3) fails.push(`${attr} ${name} dark ${dark} on ${g}`);
      }
    }
    expect(fails).toEqual([]);
  });

  test('light half on Surface-Brightest, dark half on Surface-Dimmest', () => {
    const css = chartColorVisionCSS();
    const block = (attr, level) => { const s = css.indexOf(`[data-color-vision="${attr}"] [data-surface="${level}"]`); return css.slice(s, css.indexOf('}', s)); };
    expect(block('red-blind', 'Surface-Brightest')).toContain('--Chart-1: #060b24;');
    expect(block('red-blind', 'Surface-Dimmest')).toContain('--Chart-1: #ffdbc6;');
    expect(block('green-weak', 'Surface-Dimmest')).toContain('--Chart-3: #ffa4ad;');
  });

  test('OmniDesignProvider injects the sets, whatever CSS the app loads', () => {
    render(<OmniDesignProvider><span>app</span></OmniDesignProvider>);
    const tag = document.getElementById('omni-color-vision');
    expect(tag).not.toBeNull();
    expect(tag.textContent).toContain('[data-color-vision="blue-cone"]');
  });
});
