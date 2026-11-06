'use strict';
/* Turning axe results into omni-check's report: one entry per rule, each
 * failing element counted once however many modes and widths it failed in. */

/* Fix hints written for an app built on @omni-design/components. A rule not
   listed falls back to axe's own help text and link. */
const HINTS = {
  'heading-order': 'Use <AutoHeading> for section, panel and card titles — its level comes from nesting (Section / HeadingLevel), so it cannot skip one. Pick the look with size="h4", not the tag.',
  'page-has-heading-one': 'Give the page exactly one <H1> (or component="h1" on a Display style) — its title, on every route including 404 and empty states.',
  'label-content-name-mismatch': 'Remove aria-label (or aria-labelledby) — the visible text already names it. Keep aria-label only on controls with no visible text.',
  'color-contrast': 'Remove the color / background override (style, sx, hex). The design system\'s tokens already pass; set theme / surface / variant instead.',
  'link-name': 'A link with no visible text needs aria-label naming where it goes; give images inside links alt="".',
  'button-name': 'An icon-only <Button iconOnly> needs aria-label naming the action ("Delete item").',
  'image-alt': 'Give every <img> an alt: what it shows, or alt="" when it is decoration or sits beside text that says the same.',
  'landmark-one-main': 'Wrap the page content in one <main>.',
  region: 'Put all content inside landmarks: <header> / <main> / <footer> / <nav> (AppBar and Footer already are).',
  'duplicate-id': 'Two elements share an id — make each id unique (useId()).',
  'duplicate-id-aria': 'An id used by aria-labelledby / aria-describedby appears twice — make it unique.',
  label: 'Give the field a label: <TextField label="…">, not a placeholder alone.',
  'html-has-lang': 'Add lang to <html> in index.html (<html lang="en">).',
  'document-title': 'Give index.html a <title>, and set document.title per route.',
  'nested-interactive': 'A control inside another control (a Button inside a link Card): move the inner one out, or drop the outer href.',
  'list': '<ul>/<ol> may only contain <li> — use <VStack component="ul"> with <HStack component="li"> rows.',
  'listitem': '<li> must sit inside a <ul> / <ol>.',
  'aria-allowed-attr': 'Remove the ARIA attribute this role does not support.',
  'scrollable-region-focusable': 'A scrolling region needs tabIndex={0} and a label so keyboard users can scroll it.',
};

const IMPACT_ORDER = { critical: 0, serious: 1, moderate: 2, minor: 3 };

/**
 * results: [{ route, mode, width, violations: axe violations (trimmed) }]
 * → [{ id, impact, help, helpUrl, fix, count, occurrences: [{ route, target, html, contexts }] }]
 */
function collectIssues(results) {
  const rules = new Map();
  for (const r of results) {
    for (const v of r.violations || []) {
      let rule = rules.get(v.id);
      if (!rule) {
        rule = { id: v.id, impact: v.impact || 'minor', help: v.help || '', helpUrl: v.helpUrl || '', fix: HINTS[v.id] || '', occ: new Map() };
        rules.set(v.id, rule);
      }
      for (const n of v.nodes || []) {
        const target = Array.isArray(n.target) ? n.target.join(' ') : String(n.target || '');
        const key = r.route + '\u0000' + target;
        let o = rule.occ.get(key);
        if (!o) { o = { route: r.route, target, html: n.html || '', contexts: [] }; rule.occ.set(key, o); }
        const ctx = r.mode + ' ' + r.width;
        if (!o.contexts.includes(ctx)) o.contexts.push(ctx);
      }
    }
  }
  return [...rules.values()]
    .map(({ occ, ...rule }) => ({ ...rule, count: occ.size, occurrences: [...occ.values()] }))
    .filter((r) => r.count > 0)
    .sort((a, b) => (IMPACT_ORDER[a.impact] ?? 9) - (IMPACT_ORDER[b.impact] ?? 9) || b.count - a.count || a.id.localeCompare(b.id));
}

const total = (issues) => issues.reduce((n, r) => n + r.count, 0);

function oneLine(html, max = 160) {
  const s = String(html).replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/** "light, dark · 1280, 390" when every combination failed, else the list. */
function contextLabel(contexts, modes, widths) {
  const all = modes.length * widths.length;
  if (contexts.length === all && all > 1) return modes.join(', ') + ' · ' + widths.map((w) => w + 'px').join(', ');
  return contexts.map((c) => c.replace(/ (\d+)$/, ' $1px')).join('; ');
}

/** "omni-check: 3 issues", plus how many pages could not be checked. A run
 *  that skipped pages is never reported as plainly clean. */
function finalLine(issues, meta = {}) {
  const n = total(issues);
  const unchecked = uncheckedRoutes(meta).length;
  return 'omni-check: ' + n + (n === 1 ? ' issue' : ' issues')
    + (unchecked ? ' — ' + unchecked + (unchecked === 1 ? ' page' : ' pages') + ' NOT checked (see above)' : '');
}

/** Routes that failed or were never reached. */
function uncheckedRoutes(meta = {}) {
  const out = [];
  for (const f of meta.failed || []) if (!out.includes(f.route)) out.push(f.route);
  for (const r of meta.skipped || []) if (!out.includes(r)) out.push(r);
  return out;
}

/** The human report. meta: { pages: [route], modes: ['light','dark'], widths: [1280, 390], notes: [] } */
function formatReport(issues, meta = {}) {
  const pages = meta.pages || [];
  const modes = meta.modes || ['light', 'dark'];
  const widths = meta.widths || [1280, 390];
  const perRule = meta.examples || 3;
  const lines = [];
  lines.push('omni-check — ' + pages.length + (pages.length === 1 ? ' page' : ' pages')
    + ' × ' + modes.join('/') + ' × ' + widths.map((w) => w + 'px').join('/')
    + (pages.length ? '  (' + pages.slice(0, 8).join(' ') + (pages.length > 8 ? ' …' : '') + ')' : '')
    + (typeof meta.elapsed === 'number' ? '  in ' + (meta.elapsed / 1000).toFixed(1) + 's' : ''));
  for (const note of meta.notes || []) lines.push('note: ' + note);
  for (const f of meta.failed || []) lines.push('not checked: ' + f.route + ' — ' + f.error);
  for (const rule of issues) {
    lines.push('');
    lines.push(rule.id + ' (' + rule.impact + ') · ' + rule.count);
    if (rule.help) lines.push('  ' + rule.help);
    for (const o of rule.occurrences.slice(0, perRule)) {
      lines.push('  ' + o.route + '  ' + o.target + '  [' + contextLabel(o.contexts, modes, widths) + ']');
      if (o.html) lines.push('    ' + oneLine(o.html));
    }
    if (rule.occurrences.length > perRule) lines.push('  … +' + (rule.occurrences.length - perRule) + ' more');
    if (rule.fix) lines.push('  fix: ' + rule.fix);
    if (rule.helpUrl) lines.push('  ' + rule.helpUrl);
  }
  lines.push('');
  lines.push(finalLine(issues, meta));
  return lines.join('\n');
}

/** The --json report. */
function formatJSON(issues, meta = {}) {
  return JSON.stringify({
    issues: total(issues),
    pages: meta.pages || [],
    modes: meta.modes || ['light', 'dark'],
    widths: meta.widths || [1280, 390],
    notes: meta.notes || [],
    failed: meta.failed || [],
    skipped: meta.skipped || [],
    complete: uncheckedRoutes(meta).length === 0,
    ...(typeof meta.elapsed === 'number' ? { seconds: Math.round(meta.elapsed / 100) / 10 } : {}),
    rules: issues,
  }, null, 2);
}

module.exports = { HINTS, collectIssues, formatReport, formatJSON, finalLine, uncheckedRoutes, total };
