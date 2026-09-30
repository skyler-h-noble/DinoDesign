import { render } from '@testing-library/react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Input, floatingLabelGeometry, ADORNMENT_GAP, FLOATING_SIZE_MAP } from './Input';

/* The floating label has to start at exactly the same x as the text it labels,
   and the adornment has to sit on the same vertical band as that text. Both
   were arithmetic over numbers that lived in two places and drifted apart, so
   these pin the RELATIONSHIP rather than the tuned values. */

const css = () => Array.from(document.styleSheets)
  .flatMap(ss => { try { return Array.from(ss.cssRules); } catch { return []; } })
  .map(r => r.cssText).join('');

describe('the label starts where the text starts', () => {
  test.each(['small', 'medium', 'large'])('%s: labelX is the padding token plus the adornment box', (size) => {
    /* Text x = adornment marginLeft + adornment width + adornment marginRight,
       with the input contributing no left padding of its own. The label
       composes the same sum from the same parts — and the marginLeft is the
       TOKEN, not a number, so all three read one value. */
    const cfg = FLOATING_SIZE_MAP[size];
    const { labelX } = floatingLabelGeometry(cfg, true);
    expect(labelX).toBe(
      `calc(var(--Input-Padding, ${cfg.leftPad}px) + ${cfg.iconSize + ADORNMENT_GAP}px)`,
    );
  });

  test('with no adornment the label sits at the padding token', () => {
    const cfg = FLOATING_SIZE_MAP.medium;
    expect(floatingLabelGeometry(cfg, false).labelX)
      .toBe(`var(--Input-Padding, ${cfg.leftPad}px)`);
  });

  test('the adornment starts at that token too, not a literal', () => {
    /* One element over, the same mistake: a numeric marginLeft put the
       adornment at 14px while the text it precedes began at
       var(--Input-Padding). */
    render(<Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    expect(css()).toContain('margin-left: var(--Input-Padding');
  });

  test('the gap is ONE number, not a margin plus a padding', () => {
    /* It used to be a 4px marginRight plus a 4px input paddingLeft, while the
       label added only 4 — so the label sat 4px inside the text at every size.
       Anything that reintroduces an input paddingLeft here breaks the sum
       above without touching the maths that is supposed to mirror it. */
    render(<Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('margin-right:' + ADORNMENT_GAP + 'px');
    expect(c).toContain('padding-left:0');
  });

  test('the adornment is pinned to iconSize, so labelX is true not approximate', () => {
    /* labelX is computed FROM iconSize. A "$" glyph is not 18px wide, so
       without this the label missed the text by whatever the content measured. */
    const cfg = FLOATING_SIZE_MAP.medium;
    render(<Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('width:' + cfg.iconSize + 'px');
    expect(c).toContain('min-width:' + cfg.iconSize + 'px');
  });
});

describe('the adornment shares the input text band', () => {
  test('it takes the input own top and bottom padding', () => {
    /* Not a marginBottom guess. The input carries heavy top padding to clear
       the shrunken label; the adornment takes the SAME pair, so its centre is
       the text centre at every size with no number to keep in sync. */
    const cfg = FLOATING_SIZE_MAP.medium;
    render(<Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('padding-top:' + cfg.padTop + 'px');
    expect(c).toContain('padding-bottom:' + cfg.padBottom + 'px');
  });

  test('padTop/padBottom really are the padding shorthand values', () => {
    // They are duplicated by hand because the shorthand holds a var() and
    // cannot be parsed back out. If they disagree, the adornment sits off the
    // text band and nothing else reports it.
    for (const [size, cfg] of Object.entries(FLOATING_SIZE_MAP)) {
      const [top, , bottom] = cfg.padding.split(/\s+(?![^(]*\))/);
      // jest's expect takes no message argument — that is vitest.
      expect({ size, top: parseInt(top, 10), bottom: parseInt(bottom, 10) })
        .toEqual({ size, top: cfg.padTop, bottom: cfg.padBottom });
    }
  });

  test('the row stretches instead of bottom-aligning', () => {
    render(<Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    const c = css().replace(/\s+/g, '');
    expect(c).toContain('align-items:stretch');
    expect(c).not.toContain('margin-bottom:8px');
  });

  test("MUI's 2em cap is released", () => {
    // Without this the adornment cannot stretch, so the padding above does
    // nothing and it silently keeps centring in its own short box.
    render(<Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    expect(css().replace(/\s+/g, '')).toContain('max-height:none');
  });
});

describe('the shrunk label is a real text style', () => {
  test('no scale() on the shrink transform', () => {
    /* MUI shrinks its label with scale(0.75). The label becomes an actual
       Label-* style here — weight and tracking included — so a scale on top
       would render it at 0.75 of the style it was just given, and would move
       its x too.

       Scoped to OUR rule: MUI's own base rule carries scale(0.75) and always
       will, so an unscoped search finds it and fails on correct code. What
       matters is that the rule which WINS has no scale. */
    const { container } = render(
      <Input label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />
    );
    const own = [...container.querySelector('.MuiTextField-root').classList]
      .find(c => c.startsWith('css-'));
    const ours = Array.from(document.styleSheets)
      .flatMap(ss => { try { return Array.from(ss.cssRules); } catch { return []; } })
      .filter(r => r.selectorText
        && r.selectorText.includes(own)
        && r.selectorText.includes('MuiInputLabel-shrink'))
      .map(r => r.cssText).join('');

    expect(ours).toContain('translate(');
    expect(ours).not.toContain('scale(');
  });

  test('shrunk and resting share one x, so it does not jump sideways', () => {
    const cfg = FLOATING_SIZE_MAP.large;
    const g = floatingLabelGeometry(cfg, true);
    render(<Input size="large" label="Email" labelPosition="floating" startAdornment={<AttachMoneyIcon />} />);
    // labelX is a CSS length now, so no "px" is appended to it.
    const c = css().replace(/\s+/g, '');
    const x = g.labelX.replace(/\s+/g, '');
    expect(c).toContain('translate(' + x + ',' + g.restingY + 'px)');
    expect(c).toContain('translate(' + x + ',' + g.shrunkY + 'px)');
  });
});
