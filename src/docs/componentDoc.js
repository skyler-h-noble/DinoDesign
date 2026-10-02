/**
 * The per-component reference an AI agent is handed to build with the system.
 *
 * The reader is a coding agent, not a designer, so every section has to change
 * what it WRITES. That test removed three sections a human doc would carry:
 *
 *   Anatomy       a visual decomposition. An agent does not place parts, it
 *                 passes props. Anything load-bearing moved to Composition.
 *   Dependencies  a used-by graph is impact analysis, a maintainer's concern.
 *                 An agent can read imports.
 *   Change log    it cares about the API in front of it, not its history.
 *
 * And added three no human doc has, because they are where this system differs
 * from every other:
 *
 *   Theming       where the theme goes IN CODE and IN FIGMA, as two columns.
 *                 Agents write in both, and the answers differ: `data-theme`
 *                 on an element, versus a variable mode on one specific node.
 *                 A themed node that also carries a shadow tints the shadow.
 *   Tokens        what each one sets, whether it varies, and which Figma
 *                 variable it comes from. That last column is written nowhere
 *                 else in the system, and it is what an agent working in Figma
 *                 needs to change a value rather than guess at one.
 *   Gotchas       a value or behaviour that LOOKS wrong until explained, and
 *                 that someone has already got wrong. Not a tip and not a
 *                 preference — that rule is what stops it becoming a junk
 *                 drawer, which is the failure mode of every section like it.
 *
 * Content is hand-authored rather than extracted. Props could be read from the
 * source, but "use TextArea for multiline" cannot, and a doc that is half
 * generated and half written drifts in the half nobody is watching.
 */

/* The Figma SECTION of a doc is not here.
   Rendering it needs the user's LINKED Figma file — which component set maps to
   which page, and the node ids inside it — and that is a studio concept, not a
   library one. The library owns what a component IS; the studio owns which
   Figma file a particular person has linked. `renderComponentDoc` therefore
   takes the already-rendered section as a string, so the library never imports
   the studio's linking code to produce it. */

/**
 * One CSS custom property, and where it comes from.
 *
 * `variesWith` is the question an agent cannot answer from the name: a token
 * that changes with the size mode has Sm-/Lg- siblings and must not be
 * hardcoded, one that changes with theme+surface resolves differently inside
 * every zone, and a fixed one is safe to reason about directly.
 */

/**
 * The three mode collections that carry color, and what each one moves.
 *
 * This is the fact a component doc cannot carry on its own, because getting it
 * wrong sends an agent to the right node in the wrong collection — and the
 * change appears to do nothing rather than erroring.
 *
 * `Icons` is new: its colors lived as ~27 flat variables inside Surface, so a
 * component had to bind to ONE of them. Badge bound to `Icons/Error` and could
 * therefore only ever be an error badge in Figma, while the library offered
 * nine colors. Collapsing them into 3 variables × 10 modes fixed that the same
 * way Buttons already had.
 */
export const COLOR_COLLECTIONS = [{
  name: 'Theme',
  moves: 'the whole surface — background, text, border, quiet, hover, pressed',
  inCode: '`data-theme` on the element or any ancestor',
  inFigma: 'set the Theme mode on a `Theme-*` layer'
}, {
  name: 'Buttons',
  moves: 'an accent fill and its border, hover and pressed',
  inCode: 'the `variant` / `color` prop — `variant="success"`',
  inFigma: 'set the Buttons mode on a `Button-Theme-*` layer'
}, {
  name: 'Icons',
  moves: 'an icon or badge color, plus its variant and on-color',
  inCode: 'the `color` prop on `Icon` — `<Icon color="primary">`',
  inFigma: 'set the Icons mode on an `Icon-Theme-*` layer'
}];
export function renderColorSystem() {
  const out = ['## How color works', '', 'Three mode collections carry color, and they are not interchangeable.', 'Changing the right node in the wrong collection appears to do nothing —', 'it does not error.', ''];
  out.push('| Collection | What it moves | In code | In Figma |');
  out.push('| --- | --- | --- | --- |');
  for (const c of COLOR_COLLECTIONS) {
    out.push(`| **${c.name}** | ${c.moves} | ${c.inCode} | ${c.inFigma} |`);
  }
  out.push('', 'A `Theme-*`, `Button-Theme-*` or `Icon-Theme-*` layer marks **where** a', 'mode goes. Most are unpinned, which means the component inherits — set the', 'mode on the frame around it. A pinned one is a deliberate choice: Alert', 'pins Error and Warning because there the color *is* the message.', '', 'A component with no such layer has nothing of its own to recolor.', '');
  return out.join('\n');
}

/**
 * One entry per change that BREAKS or silently changes meaning.
 *
 * Not a full changelog — a cosmetic padding fix helps nobody here, and padding
 * the list with those is how people stop reading it. The audience is someone
 * whose code just broke, or an agent about to write the old API.
 *
 * `silent` is the field that earns its keep. The changes that have cost this
 * project most all share one property: the old code keeps working and means
 * something different. `Badge size="small"` still renders. `variant="x-light"`
 * still renders. Nothing fails, so nobody finds them from a diff — they find
 * them when something looks subtly wrong months later.
 *
 * Hand-written on purpose. Git messages are repo-shaped, not component-shaped
 * (one commit touches three components), git history does not travel inside the
 * published package, and `migrate` cannot be derived from a diff at all.
 */

/* ── The Figma block ───────────────────────────────────────────────────── */

/**
 * Three outcomes, and the middle one is where every existing user is.
 *
 * A link written by a plugin build that predates component reporting has a
 * file key and no map: the file opens, individual components do not. Telling
 * that user to "link your Figma file" sends them to do something they have
 * already done, so the two cases get different instructions.
 */
/* ── The document ──────────────────────────────────────────────────────── */

/* A pipe inside a cell IS the column separator, so a type like
   `number | string` silently splits the row and every cell after it shifts
   left. Escaped here rather than in the content, so an author writing a union
   type does not have to know. */
const cell = v => v.replace(/\|/g, '\\|');
const table = (head, rows) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map(r => `| ${r.map(cell).join(' | ')} |`)];
const bullets = (title, items) => items.length ? [`### ${title}`, '', ...items.map(i => `- ${i}`), ''] : [];
export function renderComponentDoc(doc, /* Already rendered by the caller — see the note above. */
figmaSection = '') {
  const out = [`## ${doc.name}`, '', doc.summary, ''];
  if (doc.insteadUse.length) {
    out.push('### Reach for something else when', '');
    out.push(...doc.insteadUse.map(i => `- ${i.when} → \`${i.use}\``));
    out.push('');
  }
  if (doc.props.length) {
    out.push('### Props', '');
    out.push(...table(['Prop', 'Type', 'Values', 'Default'], doc.props.map(p => [`\`${p.name}\``, p.type, p.values?.length ? p.values.map(v => `\`${v}\``).join(' · ') : '—', `\`${p.default}\``])));
    const noted = doc.props.filter(p => p.note);
    if (noted.length) {
      out.push('');
      out.push(...noted.map(p => `- \`${p.name}\` — ${p.note}`));
    }
    out.push('');
  }
  if (doc.states.length) {
    out.push('### States', '');
    out.push(...table(['State', 'Set by'], doc.states.map(s => [s.state, s.setBy === 'interaction' ? 'interaction — not a prop' : s.setBy])));
    const noted = doc.states.filter(s => s.note);
    if (noted.length) {
      out.push('');
      out.push(...noted.map(s => `- ${s.state} — ${s.note}`));
    }
    out.push('');
  }
  if (doc.theming.length) {
    out.push('### Theming', '');
    out.push(...table(['Collection', 'In code', 'In Figma'], doc.theming.map(t => [t.collection === '—' ? '—' : `**${t.collection}**`, t.inCode, t.inFigma])));
    if (doc.themingNotes?.length) {
      out.push('');
      out.push(...doc.themingNotes.map(n => `- ${n}`));
    }
    out.push('');
  }
  if (doc.tokens.length) {
    out.push('### Tokens it reads', '');
    out.push(...table(['Token', 'Sets', 'Varies with', 'Figma variable'], doc.tokens.map(t => [`\`${t.name}\``, t.sets, t.variesWith, t.figma === '—' ? '—' : `\`${t.figma}\``])));
    out.push('');
  }
  out.push(...bullets('Composition', doc.composition));
  out.push(...bullets('Accessibility', doc.accessibility));
  out.push(...bullets('Gotchas', doc.gotchas));
  const figma = figmaSection;
  if (figma.length) out.push(...figma, '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
