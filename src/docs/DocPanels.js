// src/docs/DocPanels.js
//
// The two written tabs every showcase gains: Summary and Change Log.
//
// Both read COMPONENT_DOCS, the same data the published package exports, so the
// gallery and a consumer's agent are looking at one source rather than two
// descriptions that drift. A component with no doc yet says so plainly instead
// of rendering an empty tab — a missing reference and an unwritten one look
// identical otherwise, and the first is a real answer.
import React from 'react';
import { Box, Stack } from '@mui/material';
import { COMPONENT_DOCS } from './components';
import { EXAMPLES, hasExample, PROP_EXAMPLES, hasPropExample } from './examples';
import { howToFor } from './figmaHowTo';
import { HowToSlot } from '../components/Foundations/HowToSlot';
import { PreviewSurface } from '../components/PreviewSurface';
import { docsSlug } from './docsLink';
import { H5, Body, BodySmall, Caption, EyebrowSmall } from '../components/Typography';
import { Link } from '../components/Link/Link';

const ISSUE_BASE = 'https://github.com/lwnoble/DinoDesign/issues/new';

export function docFor(component) {
  const want = docsSlug(String(component || '')).toLowerCase();
  return COMPONENT_DOCS.find(d => docsSlug(d.name).toLowerCase() === want) || null;
}

const Missing = ({ component, what }) => (
  <Box sx={{ p: 3 }}>
    <Body color="quiet">
      No {what} written for {component} yet.
    </Body>
  </Box>
);

/* The section is where a rule earns its place.
   One line per section tells you where you are; one line per ROW tells you
   nothing you could not see from the spacing, and eight of them turn a token
   list into a grid. Border-Variant rather than Border: this is decorative,
   and Border carries a 3:1 requirement because it outlines clickable things. */
const Section = ({ title, children }) => (
  <Box sx={{
    pt: 3, mt: 3,
    borderTop: '1px solid var(--Border-Variant)',
    '&:first-of-type': { borderTop: 'none', pt: 0, mt: 0 },
  }}>
    <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
      {title.toUpperCase()}
    </EyebrowSmall>
    {children}
  </Box>
);

/* No rule between rows.
   Every row used to draw a borderBottom, so a token list of eight became
   eight horizontal lines and the page read as a grid rather than as prose.
   Rows are separated by space; a RULE now means a section boundary, which is
   the only distinction worth drawing a line for. */
const Rows = ({ items }) => (
  <Stack spacing={0}>
    {items.map((it, i) => (
      <Box key={i} sx={{ py: 0.75 }}>
        <BodySmall>{it.head}</BodySmall>
        {it.sub ? (
          <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{it.sub}</Caption>
        ) : null}
      </Box>
    ))}
  </Stack>
);

/**
 * Everything written about the component, in reading order — led by ONE live
 * example.
 *
 * The example is here because a page of prose gives no recognition: you cannot
 * tell what a component IS from its prop table. It renders in the theme and
 * surface currently selected, so the picture matches the pickers rather than
 * showing some other configuration.
 *
 * It WORKS. This said the example "is not interactive — the Playground tab is
 * where you change things", and that reading produced a ButtonGroup whose
 * segments took the click and never moved: controlled with a no-op onChange.
 * A control that looks operable and is not does not read as "go to the
 * Playground", it reads as "this component is broken". Playground is where
 * you change its PROPS; the example is where you see it behave.
 *
 * Components that need state or a portal to be shown honestly (Modal, Drawer,
 * Snackbar) have no example, and simply lead with the summary instead of
 * rendering a half-working one.
 */
/* One reading order for every component's Props list.
 *
 * The order used to be whatever each doc happened to declare, so the same
 * question was answered in a different place on every page — color third on
 * one component and eighth on the next. That is a cost paid by the reader on
 * every visit, to save the writer a decision once.
 *
 * The sequence is the order the questions actually arrive: what KIND is it,
 * how big, what color, what state is it in, what is inside it, how does it
 * sit in the layout. Anything unlisted keeps its declared position at the end,
 * so adding a prop to a doc never needs a change here.
 */
const PROP_ORDER = [
  'variant', 'style', 'shape', 'type', 'contentType',
  'size',
  'color', 'variantColor',
  'selected', 'checked', 'open', 'loading', 'disabled', 'elevated',
  'label', 'children', 'icon', 'iconOnly', 'letterNumber', 'avatar',
  'startDecorator', 'endDecorator',
  'fullWidth', 'fit', 'orientation', 'placement',
];

/* The key a prop's sample and how-to are filed under. A prop may carry two
   independent axes — Button's `variant` is shape AND color — so the doc can
   split it into two rows that share a name and differ by `sample`. */
const keyOf = (pr) => pr.sample || pr.name;

const rankOf = (pr) => {
  const i = PROP_ORDER.indexOf(keyOf(pr));
  return i === -1 ? PROP_ORDER.length : i;
};

const inReadingOrder = (props) => props
  .map((pr, i) => ({ pr, i }))
  /* Stable: equal ranks keep their declared order, which is what makes an
     unlisted prop harmless rather than randomly placed. */
  .sort((a, b) => (rankOf(a.pr) - rankOf(b.pr)) || (a.i - b.i))
  .map(({ pr }) => pr);

export function DocSummary({ component, theme = null, surface = 'Surface' }) {
  const doc = docFor(component);
  if (!doc) return <Missing component={component} what="reference" />;
  const example = hasExample(doc.name) ? EXAMPLES[doc.name] : null;
  /* Only the components whose control is a variable mode on an inner frame
     have one of these — the rest are answered by the property panel itself. */
  const howTo = howToFor(doc.name);


  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {example ? (
          <PreviewSurface theme={theme} surface={surface} minHeight={120}>
            {/* The example gets a WIDTH to live in.
                This was a bare centred flex box, and a flex child with no
                intrinsic width collapses to nothing — so Slider rendered as
                its thumb alone, a single dot in the middle of an empty panel,
                and every other width-driven component (Input, Select,
                TextField, Table) was equally wrong in a way that looked less
                obviously like a bug.
                `maxWidth` rather than a fixed width, so a Button still hugs
                its label and centres: components that want the room take it,
                components that do not are unaffected. */}
            {/* `width: 100%` HERE, and this is the third attempt at this bug.
                PreviewSurface is a centring flex container, so this box is a
                flex item with no width of its own — its width comes from its
                content. The inner box's `width: 100%` then resolves against a
                parent whose width is its content, which is circular and falls
                back to content width. The Slider's content is its thumb, so
                the whole chain collapsed to a dot while every OTHER slider on
                the page, rendered through the sample wrappers rather than this
                one, looked fine.
                Two earlier fixes were both correct about the inner box and
                both landed one level too low. */}
            <Box sx={{ width: '100%', p: 3, display: 'flex', justifyContent: 'center' }}>
              {/* A BLOCK box, not a flex column.
                  The first attempt at this was `display: flex` with
                  `alignItems: center`, which fixed nothing: centring a column
                  makes every child shrink to its content, so Slider collapsed
                  to its thumb exactly as it had in the bare flex box before.
                  MUI's Slider is `display: inline-block; width: 100%`, so what
                  it needs is a parent with width to claim — and `text-align`
                  centres the inline-level examples (a Button, a Chip) without
                  taking that width away from the ones that fill. */}
              <Box sx={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
                {example({ theme, surface })}
              </Box>
            </Box>
          </PreviewSurface>
        ) : null}

        <Body>{doc.summary}</Body>

        {/* No Figma link here. ShowcaseHeader already puts one in the top
            right of every page, so adding a second put two links to the same
            place on one screen — and the one further down looked like it went
            somewhere else. The map in figmaLinks.js is what the header reads;
            rendering it twice was the mistake, not authoring it.

            These links are a different thing: where the component's CONTENT
            comes from when the library does not ship it. Icon renders Material
            Symbols and BrandIcon renders Font Awesome Brands, both by
            ligature, so using either means knowing a name that lives on
            somebody else's site. */}
        {doc.links && doc.links.length ? (
          <Box sx={{ display: 'flex', gap: 'var(--Sizing-3)', flexWrap: 'wrap' }}>
            {doc.links.map((l, i) => (
              <Link key={i} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </Link>
            ))}
          </Box>
        ) : null}


        {doc.insteadUse.length > 0 && (
          <Section title="Reach for something else when">
            <Rows items={doc.insteadUse.map(i => ({ head: i.when, sub: `Use ${i.use}` }))} />
          </Section>
        )}

        {doc.props.length > 0 && (
          <Section title="Props">
            {/* A sample sits beside the prop it illustrates rather than in one
                strip at the top: the picture then appears where the reader is
                already asking the question. Props whose meaning is plain from
                their values simply have none. */}
            <Stack spacing={0}>
              {inReadingOrder(doc.props).map((pr, i) => {
                const key = keyOf(pr);
                const sample = hasPropExample(doc.name, key)
                  ? PROP_EXAMPLES[doc.name][key]
                  : null;
                /* Directly beneath the sample it explains, so it reads in the
                   order the question arrives: here are the colors, here is
                   how you get them. Up by the summary it was an instruction
                   for something the reader had not seen yet. */
                const how = howTo && howTo.after === key ? howTo : null;
                const sub = [pr.values && pr.values.length ? pr.values.join(' | ') : null,
                             pr.default ? `default: ${pr.default}` : null,
                             pr.note].filter(Boolean).join('  ·  ');
                return (
                  <Box key={i} sx={{ py: 1 }}>
                    <BodySmall>{pr.label || pr.name} — {pr.type}</BodySmall>
                    {sub ? (
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{sub}</Caption>
                    ) : null}
                    {sample ? (
                      <Box sx={{ mt: 1.5 }}>
                        <PreviewSurface theme={theme} surface={surface} minHeight={0}>
                          <Box sx={{ p: 2 }}>{sample({ theme, surface })}</Box>
                        </PreviewSurface>
                      </Box>
                    ) : null}
                    {how ? (
                      <Box sx={{ mt: 2 }}>
                        <Stack spacing={1.5}>
                          <EyebrowSmall>{how.title}</EyebrowSmall>
                          <BodySmall>{how.body}</BodySmall>
                          <HowToSlot title={how.shot} />
                          {how.caveat ? (
                            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                              {how.caveat}
                            </Caption>
                          ) : null}
                        </Stack>
                      </Box>
                    ) : null}
                  </Box>
                );
              })}
            </Stack>
          </Section>
        )}

        {doc.states.length > 0 && (
          <Section title="States">
            <Rows items={doc.states.map(s => ({
              head: s.state,
              sub: [`set by ${s.setBy}`, s.note].filter(Boolean).join('  ·  '),
            }))} />
          </Section>
        )}

        {doc.theming.length > 0 && (
          <Section title="Theming">
            {/* Two columns because the answers genuinely differ: `data-theme` on
                an element against a variable mode on one specific Figma node. */}
            <Rows items={doc.theming.map(t => ({
              head: t.collection,
              sub: `In code: ${t.inCode}\nIn Figma: ${t.inFigma}`,
            }))} />
            {(doc.themingNotes || []).map((n, i) => (
              <Caption key={i} style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 8 }}>{n}</Caption>
            ))}
          </Section>
        )}

        {doc.tokens.length > 0 && (
          <Section title="Tokens">
            <Rows items={doc.tokens.map(t => ({
              head: t.name,
              sub: [t.sets, t.variesWith ? `varies with ${t.variesWith}` : null, t.figma]
                .filter(Boolean).join('  ·  '),
            }))} />
          </Section>
        )}

        {doc.composition.length > 0 && (
          <Section title="Composition">
            <Rows items={doc.composition.map(c => ({ head: c }))} />
          </Section>
        )}

        {doc.gotchas.length > 0 && (
          <Section title="Gotchas">
            <Rows items={doc.gotchas.map(g => ({ head: g }))} />
          </Section>
        )}
      </Stack>
    </Box>
  );
}

/** Breaking and silent changes, newest first, plus a way to report one. */
export function DocChanges({ component }) {
  const doc = docFor(component);
  const changes = (doc && doc.changes) || [];
  const title = encodeURIComponent(`[${component}] `);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {changes.length === 0 ? (
          <Body color="quiet">
            No breaking changes recorded for {component}. Only changes that break, or that
            silently change meaning, are listed here — not every fix.
          </Body>
        ) : (
          <Stack spacing={0}>
            {changes.map((c, i) => (
              <Box key={i} sx={{ py: 1 }}>
                {/* useFlexGap: Stack's default spacing is margin-left on every
                    child after the first, and that margin SURVIVES the wrap —
                    so the SILENT badge dropped to its own line and kept the
                    indent. CSS gap does not do that. */}
                <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <BodySmall style={{ fontWeight: 700 }}>{c.version}</BodySmall>
                  {c.silent ? (
                    /* The category that costs most: the old code still renders,
                       so nothing fails and nobody finds it from a diff. */
                    <Caption style={{ color: 'var(--Text-Warning)', fontWeight: 600 }}>
                      SILENT — old code still renders
                    </Caption>
                  ) : null}
                </Stack>
                <Body>{c.change}</Body>
                {c.migrate ? (
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>
                    Instead: {c.migrate}
                  </Caption>
                ) : null}
              </Box>
            ))}
          </Stack>
        )}

        <Box>
          <H5>Something wrong or missing?</H5>
          <BodySmall color="quiet">
            Report it against this component and it arrives with the name already filled in.
          </BodySmall>
          <Box sx={{ mt: 1 }}>
            <Link href={`${ISSUE_BASE}?title=${title}`} target="_blank" rel="noreferrer">
              Report an issue with {component}
            </Link>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
