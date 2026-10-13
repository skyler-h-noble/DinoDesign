// On a state surface the only palettes that mean anything are the state's
// own, Neutral and BlackWhite. Before the per-surface Buttons tones were
// fixed this was worse than a tidying rule: every palette resolved to the
// surface's own colour, so all eight accent choices rendered the SAME button
// and the picker looked broken rather than restricted.
import { allowedColors, colorGroupsFor, STATE_THEMES } from './colorChoices';

const GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'State', colors: ['info', 'success', 'warning', 'error'] },
];

describe('allowedColors', () => {
  test('brand themes are unrestricted', () => {
    for (const t of ['Primary', 'Secondary', 'Tertiary', 'Neutral', null, undefined]) {
      expect(allowedColors(t)).toBeNull();
    }
  });

  test.each(STATE_THEMES)('%s allows only itself, neutral and black-white', (t) => {
    expect(allowedColors(t)).toEqual([t.toLowerCase(), 'neutral', 'black-white']);
  });

  test('the theme name is matched without case', () => {
    expect(allowedColors('error')).toEqual(allowedColors('Error'));
  });
});

describe('colorGroupsFor', () => {
  test('hands back the same groups on a brand theme', () => {
    expect(colorGroupsFor(GROUPS, 'Primary')).toBe(GROUPS);
  });

  test('drops every other accent on a state theme', () => {
    const shown = colorGroupsFor(GROUPS, 'Warning').flatMap((g) => g.colors);
    expect(shown).toContain('warning');
    expect(shown).toContain('neutral');
    for (const gone of ['default', 'primary', 'secondary', 'tertiary',
                        'info', 'success', 'error']) {
      expect(shown).not.toContain(gone);
    }
  });

  /* BlackWhite is the one palette that cannot collapse into a themed ground,
     which is exactly why it should be reachable there — so it is added even
     when the showcase's own group list never offered it. */
  test('adds black-white even though the groups never listed it', () => {
    expect(GROUPS.flatMap((g) => g.colors)).not.toContain('black-white');
    expect(colorGroupsFor(GROUPS, 'Info').flatMap((g) => g.colors)).toContain('black-white');
  });

  test('leaves no empty group behind as a bare heading', () => {
    for (const g of colorGroupsFor(GROUPS, 'Success')) {
      expect(g.colors.length).toBeGreaterThan(0);
    }
  });
});
