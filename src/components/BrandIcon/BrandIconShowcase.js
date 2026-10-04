// src/components/BrandIcon/BrandIconShowcase.js
//
// BrandIcon had a doc and no page. It was reachable from nothing in the
// gallery, so the component that renders somebody else's trademark — the one
// with rules you cannot derive from the design system — was the one with
// nowhere to read them.
//
// It belongs under Foundations rather than with the components: a brand mark
// is an ASSET, like a color or a type scale, not a control with states. It
// sits beside Icon for the same reason the two are separate components —
// Icon is the system's own vocabulary and this is not.
import React, { useState } from 'react';
import { A11yScopeNote, ContrastBadge } from '../a11yPanel';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { BackgroundPicker } from '../BackgroundPicker';
import { DocSummary, DocChanges } from '../../docs/DocPanels';
import { Box, Stack, Grid } from '@mui/material';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs';
import { BrandIcon, BRAND_ICON_NAMES, hasBrandIcon } from './BrandIcon';
import { CodeBlock } from '../CodeBlock';
import { Body, BodySmall, Caption, EyebrowSmall, H3 } from '../Typography';
import { Link } from '../Link';

/* No curated list. An earlier version offered fifteen buttons, which was a
   guess at which marks matter dressed up as a feature: this build carries
   609, so the grid was hiding 594 of them behind a decision nobody made.
   A name field reaches all of them, and the datalist means it does not have
   to be typed from memory. */
const SUGGEST_LIMIT = 600;

const BROWSE_URL = 'https://fontawesome.com/search?f=brands&ic=free-collection';

const SIZES = [
  { label: '1em — inherits', value: '1em' },
  { label: '16px', value: '16px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
  { label: '48px', value: '48px' },
];

/* The icon COLOR roles. A brand mark is somebody else's artwork, so the
   honest default is currentColor — it sits in running text and takes the
   color of the text around it. The named roles are here because a mark in a
   footer or a button row has to meet that surface, not because the brand's
   own color is ours to change. */
const COLORS = [
  { label: 'currentColor', value: 'currentColor' },
  { label: '--Icons-Default', value: 'var(--Icons-Default)' },
  { label: '--Icons-Primary', value: 'var(--Icons-Primary)' },
  { label: '--Icons-Secondary', value: 'var(--Icons-Secondary)' },
  { label: '--Icons-Neutral', value: 'var(--Icons-Neutral)' },
  { label: '--Text', value: 'var(--Text)' },
  { label: '--Quiet', value: 'var(--Quiet)' },
];

function ControlButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 10px', fontSize: 11, cursor: 'pointer',
        borderRadius: 'var(--Button-Radius, 6px)',
        border: '1px solid var(--Border)',
        background: selected ? 'var(--Buttons-Default-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Default-Text)' : 'var(--Text)',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

export function BrandIconShowcase() {
  const [bgTheme, setBgTheme] = useState(null);
  const [bgSurface, setBgSurface] = useState('Surface');

  const [name, setName] = useState('github');
  const [size, setSize] = useState('32px');
  const [color, setColor] = useState('currentColor');
  const [titled, setTitled] = useState(false);

  const known = hasBrandIcon(name);

  const generateCode = () => {
    const parts = [`name="${name}"`];
    if (size !== '1em') parts.push(`size="${size}"`);
    if (color !== 'currentColor') parts.push(`color="${color}"`);
    if (titled) parts.push(`title="${name}"`);
    return `<BrandIcon ${parts.join(' ')} />`;
  };

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Brand Icons" component="BrandIcon" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme}
                          surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>

      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Playground</Tab>
          <Tab>Accessibility</Tab>
          <Tab>Change Log</Tab>
        </TabList>

        <TabPanel value={0}>
          <DocSummary component="BrandIcon" theme={bgTheme} surface={bgSurface} />
        </TabPanel>

        <TabPanel value={1}>
          <Grid container sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 }, p: 3 }}>
              <Box
                data-theme={bgTheme || undefined}
                data-surface={bgSurface}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 200, padding: 4, borderRadius: 'var(--Card-Radius, 8px)',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)',
                  border: '1px solid var(--Border-Variant)',
                }}
              >
                {known ? (
                  <BrandIcon name={name} size={size} color={color}
                             title={titled ? name : undefined} />
                ) : (
                  <BodySmall style={{ color: 'var(--Quiet)' }}>
                    Nothing to draw — type a mark name.
                  </BodySmall>
                )}
              </Box>
              <CodeBlock code={generateCode()} language="JSX" wrap sx={{ mt: 2 }} />
            </Grid>

            <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0, minWidth: 0 }}>
              <Box sx={{ p: 3 }}>
                <Box>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    MARK
                  </EyebrowSmall>
                  <input
                    type="text"
                    list="brand-icon-names"
                    value={name}
                    onChange={(e) => setName(e.target.value.trim().toLowerCase())}
                    placeholder="github"
                    aria-label="Brand mark name"
                    aria-invalid={name && !known ? 'true' : undefined}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '8px 10px', fontSize: 12, fontFamily: 'inherit',
                      color: 'var(--Text)', background: 'var(--Background)',
                      borderRadius: 'var(--Input-Radius, 6px)',
                      border: `1px solid ${name && !known ? 'var(--Buttons-Error-Border)' : 'var(--Border)'}`,
                    }}
                  />
                  {/* All 609, so the name does not have to be typed from
                      memory. A datalist suggests without constraining —
                      anything Font Awesome adds still works by typing it. */}
                  <datalist id="brand-icon-names">
                    {BRAND_ICON_NAMES.slice(0, SUGGEST_LIMIT).map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>

                  {/* An unknown name renders NOTHING — the component returns
                      null and warns in the console. Without this the field's
                      failure mode is an empty square and no explanation, which
                      reads as the component being broken. */}
                  {name && !known ? (
                    <Caption style={{ color: 'var(--Text-Error)', display: 'block', marginTop: 6 }}>
                      No mark named “{name}”. Names are lowercase and hyphenated,
                      exactly as Font Awesome lists them.
                    </Caption>
                  ) : (
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                      {BRAND_ICON_NAMES.length} marks available. Lowercase and
                      hyphenated — `x-twitter`, `square-github`.
                    </Caption>
                  )}

                  <Box sx={{ mt: 1 }}>
                    <Link href={BROWSE_URL} target="_blank" rel="noopener noreferrer">
                      Browse Font Awesome Brands
                    </Link>
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    SIZE
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                    {SIZES.map((s) => (
                      <ControlButton key={s.value} label={s.label} selected={size === s.value}
                                     onClick={() => setSize(s.value)} />
                    ))}
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    `1em` is the default and makes the mark match the text it sits in.
                  </Caption>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    COLOR
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                    {COLORS.map((c) => (
                      <ControlButton key={c.value} label={c.label} selected={color === c.value}
                                     onClick={() => setColor(c.value)} />
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                    ACCESSIBLE NAME
                  </EyebrowSmall>
                  <Stack direction="row" spacing={1}>
                    <ControlButton label="Decorative" selected={!titled}
                                   onClick={() => setTitled(false)} />
                    <ControlButton label={`title="${name}"`} selected={titled}
                                   onClick={() => setTitled(true)} />
                  </Stack>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                    Decorative is `aria-hidden`. Give a title only when the mark is the
                    whole of the link or button — a title beside a visible “GitHub”
                    label is announced twice.
                  </Caption>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={2}>
          <A11yScopeNote />
          <Box sx={{ p: 3, pt: 0 }}>
            <Stack spacing={3}>
              <Box>
                <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  NAMING
                </EyebrowSmall>
                <BodySmall>
                  A brand mark is decorative by default — the SVG is `aria-hidden`
                  unless you pass `title`. That is the right default: a mark almost
                  always sits beside a visible label, and naming both announces the
                  control twice.
                </BodySmall>
                <BodySmall style={{ marginTop: 8 }}>
                  When the mark IS the whole control — an icon-only link to a profile —
                  it needs a name, and the name is the DESTINATION rather than the
                  logo: “GitHub profile”, not “github”.
                </BodySmall>
              </Box>

              <Box>
                <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  CONTRAST
                </EyebrowSmall>
                <BodySmall>
                  A brand mark is a non-text image. Where it carries meaning on its own
                  it needs 3:1 against its background, the same as any other
                  non-text content; where it is decorative beside a label, the LABEL
                  carries the requirement and the mark does not.
                </BodySmall>
                <BodySmall style={{ marginTop: 8 }}>
                  The marks are drawn in `currentColor` by default, so they inherit a
                  text color that has already been checked. Setting an explicit brand
                  color is where this stops being true — a brand's own blue was not
                  chosen against your surfaces.
                </BodySmall>
              </Box>

              <Box>
                <EyebrowSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
                  TRADEMARK
                </EyebrowSmall>
                <BodySmall>
                  These are other companies' marks. They are not the design system's to
                  restyle, which is why this is a separate component from `Icon` rather
                  than a `brand` prop on it — a prop would have quietly inherited the
                  system's color and sizing rules, and those do not apply here.
                </BodySmall>
              </Box>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={3}>
          <DocChanges component="BrandIcon" />
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default BrandIconShowcase;
