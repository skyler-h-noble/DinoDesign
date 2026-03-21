// src/components/Stack/StackShowcase.js
import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DynoStack } from './Stack';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Chip } from '../Chip/Chip';
import { Link } from '../Link/Link';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H3, H5, BodySmall, Caption, OverlineSmall, Body,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (e) { console.error(e); }
  };
  return (
    <Button iconOnly variant="ghost" size="small" onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code'}
      sx={{ color: copied ? '#4ade80' : '#9ca3af' }}>
      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
    </Button>
  );
}

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'primary' : 'primary-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

function CodeBlock({ code }) {
  return (
    <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 2, py: 1, borderBottom: '1px solid #333' }}>
        <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
        <CopyButton code={code} />
      </Box>
      <Box sx={{ p: 2 }}>
        <Box component="code" sx={{
          fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'block',
        }}>
          {code}
        </Box>
      </Box>
    </Box>
  );
}

function StatusBadge({ passes }) {
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1.5, py: 0.5, borderRadius: '20px',
      backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
      color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
      fontSize: '12px', fontWeight: 600,
    }}>
      {passes
        ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
        : <WarningAmberIcon sx={{ fontSize: 14 }} />}
      {passes ? 'WCAG Pass' : 'WCAG Fail'}
    </Box>
  );
}

function SideBySideDemo({ leftLabel, rightLabel, leftContent, rightContent, leftCode, rightCode, leftPasses, rightPasses }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 2, border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)', backgroundColor: 'var(--Background)', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <BodySmall style={{ fontWeight: 600 }}>{leftLabel}</BodySmall>
            <StatusBadge passes={leftPasses} />
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'var(--Surface-Dim, var(--Surface))', borderRadius: 'var(--Style-Border-Radius)', minHeight: 80 }}>
            {leftContent}
          </Box>
          <CodeBlock code={leftCode} />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 2, border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)', backgroundColor: 'var(--Background)', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <BodySmall style={{ fontWeight: 600 }}>{rightLabel}</BodySmall>
            <StatusBadge passes={rightPasses} />
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'var(--Surface-Dim, var(--Surface))', borderRadius: 'var(--Style-Border-Radius)', minHeight: 80 }}>
            {rightContent}
          </Box>
          <CodeBlock code={rightCode} />
        </Box>
      </Grid>
    </Grid>
  );
}

// ─── Playground ───────────────────────────────────────────────────────────────

function Playground() {
  const [direction, setDirection]   = useState('column');
  const [gap, setGap]               = useState(0.5);
  const [childSet, setChildSet]     = useState('small');
  const [enforceMinGap, setEnforce] = useState(true);
  const [flexWrap, setFlexWrap]     = useState(false);
  const [bgTheme, setBgTheme]       = useState(null);

  const childSets = {
    small:  {
      label: 'Small links ⚡',
      content: (
        <>
          <Link href="#" size="small">Terms of Service</Link>
          <Link href="#" size="small">Privacy Policy</Link>
          <Link href="#" size="small">Cookie Settings</Link>
        </>
      ),
    },
    chips: {
      label: 'Chips ⚡',
      content: (
        <>
          <Chip label="React" size="small" />
          <Chip label="TypeScript" size="small" />
          <Chip label="Design System" size="small" />
        </>
      ),
    },
    normal: {
      label: 'Normal buttons',
      content: (
        <>
          <Button variant="primary" size="medium">Primary</Button>
          <Button variant="secondary" size="medium">Secondary</Button>
        </>
      ),
    },
    mixed: {
      label: 'Mixed ⚡',
      content: (
        <>
          <Button variant="primary" size="medium">Save changes</Button>
          <Link href="#" size="small">Or discard</Link>
        </>
      ),
    },
  };

  const hasSmall = ['small', 'chips', 'mixed'].includes(childSet);
  const willEnforce = enforceMinGap && hasSmall;

  const generateCode = () => {
    const lines = ['<DynoStack'];
    if (direction !== 'column') lines.push('  direction="' + direction + '"');
    lines.push('  gap={' + gap + '}');
    if (!enforceMinGap) lines.push('  enforceMinGap={false}');
    if (flexWrap) lines.push('  flexWrap="wrap"');
    lines.push('>');
    lines.push('  {children}');
    lines.push('</DynoStack>');
    return lines.join('\n');
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={7}>
        <PreviewSurface theme={bgTheme}>
          <Box sx={{ width: '100%' }}>
            {willEnforce && (
              <Box sx={{
                mb: 2, px: 2, py: 1, borderRadius: 'var(--Style-Border-Radius)',
                backgroundColor: 'var(--Tags-Warning-BG)',
                color: 'var(--Tags-Warning-Text)',
                fontSize: '12px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <WarningAmberIcon sx={{ fontSize: 16 }} />
                Small child detected — gap raised to var(--min-stack-gap)
              </Box>
            )}
            <DynoStack
              direction={direction}
              gap={gap}
              enforceMinGap={enforceMinGap}
              flexWrap={flexWrap ? 'wrap' : undefined}
            >
              {childSets[childSet].content}
            </DynoStack>
          </Box>
        </PreviewSurface>
        <CodeBlock code={generateCode()} />
      </Grid>

      <Grid item xs={12} md={5}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <BackgroundPicker value={bgTheme} onChange={setBgTheme} />

          <Box>
            <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CHILDREN</OverlineSmall>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(childSets).map(([key, { label }]) => (
                <ControlButton key={key} label={label} selected={childSet === key} onClick={() => setChildSet(key)} />
              ))}
            </Box>
          </Box>

          <Box>
            <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>DIRECTION</OverlineSmall>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['row', 'column'].map((d) => (
                <ControlButton key={d} label={cap(d)} selected={direction === d} onClick={() => setDirection(d)} />
              ))}
            </Box>
          </Box>

          <Box>
            <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
              GAP — {gap} unit{willEnforce ? ' → raised to var(--min-stack-gap)' : ''}
            </OverlineSmall>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="input" type="range" min={0} max={6} step={0.5} value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                sx={{ flex: 1, accentColor: 'var(--Primary-Color-10)' }} />
              <Caption style={{ color: 'var(--Text)', minWidth: 24, textAlign: 'right' }}>{gap}</Caption>
            </Box>
          </Box>

          <Box>
            <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <BodySmall>Enforce min gap</BodySmall>
                  <Caption style={{ color: willEnforce ? 'var(--Tags-Warning-Text)' : 'var(--Text-Quiet)', display: 'block' }}>
                    {willEnforce ? '⚡ Active — small child detected' : hasSmall ? 'Off — WCAG 2.5.8 risk' : 'No small children detected'}
                  </Caption>
                </Box>
                <Switch checked={enforceMinGap} onChange={(e) => setEnforce(e.target.checked)} size="small" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <BodySmall>Flex wrap</BodySmall>
                <Switch checked={flexWrap} onChange={(e) => setFlexWrap(e.target.checked)} size="small" />
              </Box>
            </Box>
          </Box>

        </Box>
      </Grid>
    </Grid>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function StackShowcase() {
  return (
    <Box sx={{ pb: 8 }}>
      <H2>Stack</H2>
      <Body style={{ color: 'var(--Text-Quiet)', marginTop: 8, marginBottom: 32, maxWidth: 640 }}>
        DynoStack is a layout primitive built on MUI Stack with one intelligent addition:
        it automatically enforces a minimum gap between children when it detects small (24px)
        interactive components — protecting WCAG 2.5.8 compliance without any extra developer effort.
      </Body>

      <Tabs defaultValue={0} variant="standard" color="primary">
        <TabList>
          <Tab>Why it matters</Tab>
          <Tab>Playground</Tab>
          <Tab>API</Tab>
        </TabList>

        {/* ── Why it matters ── */}
        <TabPanel value={0}>
          <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Problem */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)' }}>
              <H3>The problem</H3>
              <Body style={{ color: 'var(--Text-Quiet)', marginTop: 8, marginBottom: 16 }}>
                WCAG 2.5.8 requires that small interactive targets (24px) have enough surrounding
                space that they don&#x2019;t overlap adjacent targets. Every layout library leaves
                this entirely to the developer — meaning it&#x2019;s silently violated constantly.
              </Body>
              <SideBySideDemo
                leftLabel="Plain MUI Stack — gap too small"
                rightLabel="DynoStack — gap auto-enforced"
                leftPasses={false}
                rightPasses={true}
                leftContent={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link href="#" size="small">Terms of Service</Link>
                    <Link href="#" size="small">Privacy Policy</Link>
                    <Link href="#" size="small">Cookie Settings</Link>
                  </Box>
                }
                rightContent={
                  <DynoStack gap={0.5}>
                    <Link href="#" size="small">Terms of Service</Link>
                    <Link href="#" size="small">Privacy Policy</Link>
                    <Link href="#" size="small">Cookie Settings</Link>
                  </DynoStack>
                }
                leftCode={`<Stack gap={0.5}>
  <Link size="small">Terms of Service</Link>
  <Link size="small">Privacy Policy</Link>
  <Link size="small">Cookie Settings</Link>
</Stack>
// ⚠ gap=4px — targets overlap`}
                rightCode={`<DynoStack gap={0.5}>
  <Link size="small">Terms of Service</Link>
  <Link size="small">Privacy Policy</Link>
  <Link size="small">Cookie Settings</Link>
</DynoStack>
// ✓ small child detected → gap enforced`}
              />
            </Box>

            {/* Mixed */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)' }}>
              <H3>Mixed component sizes</H3>
              <Body style={{ color: 'var(--Text-Quiet)', marginTop: 8, marginBottom: 16 }}>
                One small child is enough to trigger enforcement for the whole stack — the most
                common case is a normal button paired with a small cancel link.
              </Body>
              <SideBySideDemo
                leftLabel="Without enforcement"
                rightLabel="With enforcement"
                leftPasses={false}
                rightPasses={true}
                leftContent={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Button variant="primary" size="medium">Save changes</Button>
                    <Link href="#" size="small">Or discard</Link>
                  </Box>
                }
                rightContent={
                  <DynoStack gap={0.25}>
                    <Button variant="primary" size="medium">Save changes</Button>
                    <Link href="#" size="small">Or discard</Link>
                  </DynoStack>
                }
                leftCode={`<Stack gap={0.25}>
  <Button size="medium">Save changes</Button>
  <Link size="small">Or discard</Link>
</Stack>
// ⚠ Link is 24px — gap too tight`}
                rightCode={`<DynoStack gap={0.25}>
  <Button size="medium">Save changes</Button>
  <Link size="small">Or discard</Link>
</DynoStack>
// ✓ Link detected → gap enforced`}
              />
            </Box>

            {/* Detection */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)' }}>
              <H3>How detection works</H3>
              <Body style={{ color: 'var(--Text-Quiet)', marginTop: 8, marginBottom: 16 }}>
                DynoStack inspects children at render time using a priority-ordered signal chain.
                Any one signal is enough to trigger enforcement.
              </Body>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { signal: 'size="small" prop',      example: '<Link size="small" />'           },
                  { signal: 'data-size="small"',      example: '<div data-size="small" />'       },
                  { signal: 'height={24}',            example: '<Box height={24} />'             },
                  { signal: 'minHeight={24}',         example: '<Box minHeight={24} />'          },
                  { signal: 'sx.minHeight: 24',       example: '<Box sx={{ minHeight: 24 }} />'  },
                  { signal: 'Known component name',   example: 'Link, Chip, Badge, Caption…'    },
                ].map(({ signal, example }, i, arr) => (
                  <Box key={signal} sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    py: 1.5, borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none',
                  }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--Primary-Color-10)', flexShrink: 0 }} />
                    <BodySmall style={{ flex: '0 0 200px' }}>{signal}</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{example}</Caption>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Token */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)' }}>
              <H3>Token-driven minimum</H3>
              <Body style={{ color: 'var(--Text-Quiet)', marginTop: 8, marginBottom: 16 }}>
                The minimum gap is a CSS custom property, not a hardcoded value — so it respects
                your brand spacing scale and responds to theme changes without re-rendering.
              </Body>
              <CodeBlock code={`:root {
  --min-stack-gap: 8px; /* Set in your theme.css */
}

/* DynoStack substitutes the variable, not the value: */
gap: var(--min-stack-gap, 8px);

/* Dark mode, brand overrides, and media queries
   all work automatically — no re-render needed. */`} />
            </Box>

            {/* Opt-out */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Background)', border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)' }}>
              <H3>Auditable opt-out</H3>
              <Body style={{ color: 'var(--Text-Quiet)', marginTop: 8, marginBottom: 16 }}>
                Use <code>enforceMinGap=&#123;false&#125;</code> to opt out. This creates a searchable
                pattern accessibility audits can grep for — a conscious waiver, not a silent violation.
              </Body>
              <CodeBlock code={`<DynoStack gap={0.5} enforceMinGap={false}>
  {/* Explicitly waived — auditors can grep:
      enforceMinGap={false}
      to find all waivers in the codebase. */}
  <Link size="small">Terms</Link>
  <Link size="small">Privacy</Link>
</DynoStack>`} />
            </Box>

          </Box>
        </TabPanel>

        {/* ── Playground ── */}
        <TabPanel value={1}>
          <Playground />
        </TabPanel>

        {/* ── API ── */}
        <TabPanel value={2}>
          <Box sx={{ pt: 3 }}>

            <H3>DynoStack props</H3>
            <Body style={{ color: 'var(--Text-Quiet)', marginTop: 4, marginBottom: 16 }}>
              All standard MUI Stack props are supported. These are DynoStack additions:
            </Body>

            <Box sx={{ border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)', overflow: 'hidden', mb: 4 }}>
              {[
                { prop: 'enforceMinGap', type: 'boolean',        default: 'true',               desc: 'Enable/disable smart gap enforcement.' },
                { prop: 'minGapToken',   type: 'string',         default: '"--min-stack-gap"',  desc: 'CSS variable name for the minimum gap value.' },
                { prop: 'gap',           type: 'number|string',  default: 'undefined',          desc: 'Desired gap. Enforced against minGapToken when small children detected.' },
                { prop: 'direction',     type: 'string|object',  default: '"column"',           desc: 'Stack direction. Supports responsive breakpoint objects.' },
                { prop: 'flexWrap',      type: 'string',         default: 'undefined',          desc: '"wrap" | "nowrap" | "wrap-reverse"' },
                { prop: 'divider',       type: 'ReactNode',      default: 'undefined',          desc: 'Element rendered between each child.' },
              ].map(({ prop, type, default: def, desc }, i, arr) => (
                <Box key={prop} sx={{
                  display: 'grid', gridTemplateColumns: '160px 160px 1fr',
                  gap: 2, px: 2, py: 1.5, alignItems: 'start',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none',
                  backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--Surface-Dim, var(--Surface))',
                }}>
                  <Caption style={{ fontFamily: 'monospace', color: 'var(--Primary-Color-10)', fontWeight: 600 }}>{prop}</Caption>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{type}</Caption>
                  <Box>
                    <Caption style={{ color: 'var(--Text)' }}>{desc}</Caption>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 2 }}>Default: {def}</Caption>
                  </Box>
                </Box>
              ))}
            </Box>

            <H3>Convenience exports</H3>
            <Box sx={{ border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)', overflow: 'hidden', mb: 4 }}>
              {[
                { name: 'Stack',             desc: 'Alias for DynoStack — drop-in MUI Stack replacement' },
                { name: 'HStack',            desc: 'direction="row" alignItems="center"' },
                { name: 'VStack',            desc: 'direction="column"' },
                { name: 'CenteredStack',     desc: 'direction="column" alignItems="center" justifyContent="center"' },
                { name: 'SpaceBetweenStack', desc: 'direction="row" justifyContent="space-between"' },
                { name: 'WrapStack',         desc: 'direction="row" flexWrap="wrap"' },
                { name: 'ResponsiveStack',   desc: 'column on xs, row on sm+ (breakpoint configurable)' },
                { name: 'GridStack',         desc: 'Alias for WrapStack' },
                { name: 'InsetStack',        desc: 'DynoStack with px: 2 horizontal padding' },
                { name: 'ScrollStack',       desc: 'DynoStack with overflowY: auto' },
              ].map(({ name, desc }, i, arr) => (
                <Box key={name} sx={{
                  display: 'grid', gridTemplateColumns: '200px 1fr',
                  gap: 2, px: 2, py: 1.5,
                  borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none',
                  backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--Surface-Dim, var(--Surface))',
                }}>
                  <Caption style={{ fontFamily: 'monospace', color: 'var(--Primary-Color-10)', fontWeight: 600 }}>{name}</Caption>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>{desc}</Caption>
                </Box>
              ))}
            </Box>

            <H3>Debug attributes</H3>
            <CodeBlock code={`/* When enforcement is active, DynoStack adds: */
className="dyno-stack dyno-stack-min-gap-enforced"
data-min-gap-enforced="true"

/* Target in CSS: */
.dyno-stack-min-gap-enforced { outline: 2px dashed orange; }

/* Query in tests: */
container.querySelector('[data-min-gap-enforced="true"]')`} />

          </Box>
        </TabPanel>
      </Tabs>
    </Box>
  );
}

export default StackShowcase;