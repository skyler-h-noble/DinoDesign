// src/components/Section/SectionShowcase.js
import React, { useState } from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { Section } from './Section';
import { H3, Body, BodySmall } from '../Typography';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { DocSummary } from '../../docs/DocPanels';
import { ToggleButtonGroup } from '../ToggleButtonGroup/ToggleButtonGroup';
import { EDGE_NAMES, EDGE_SIZES, SIZED_EDGES, edgeDefaultHeight } from './edges';

export function SectionShowcase() {
  const [animate, setAnimate] = useState(false);
  const [size, setSize] = useState('large');
  const [seed, setSeed] = useState(0);
  /* Each section's bottom padding clears the NEXT section's edge, which
     reaches up into it — otherwise a 96px curve covers the label above. */
  const heightOf = (name) => (SIZED_EDGES.includes(name) ? EDGE_SIZES[size] : edgeDefaultHeight(name));
  return (
    <div>
      <H3 style={{ marginBottom: 12 }}>Section</H3>
      <Body color="quiet" style={{ marginBottom: 32, maxWidth: 720 }}>
        <code>{'<Section>'}</code> bundles <code>data-theme</code> +{' '}
        <code>data-surface</code> + background paint into one component. Use
        anywhere you'd otherwise reach for{' '}
        <code>{'<section data-theme data-surface style={{ background: var(--Background) }}>'}</code>.
        For wrapping without painting (e.g. AppBar's themed zone), use{' '}
        <code>{'<ThemedZone>'}</code>.
      </Body>

      <H3 style={{ marginTop: 24, marginBottom: 12 }}>Theme + surface</H3>
      <BodySmall color="quiet" style={{ marginBottom: 16, display: 'block' }}>
        Sets data-theme="Primary" + data-surface="Surface", paints --Background.
      </BodySmall>
      <Section theme="Primary" surface="Surface" padding="32px" style={{ borderRadius: 8 }}>
        <ShowcaseHeader title="Primary-Light surface" component="Section" />
        <Body>Body text picks up --Text automatically.</Body>
        <BodySmall color="quiet">Quiet text picks up --Text-Quiet.</BodySmall>
        <div style={{ marginTop: 12 }}>
          <Button variant="primary">Primary button</Button>
        </div>
      </Section>

      <H3 style={{ marginTop: 32, marginBottom: 12 }}>Container surface</H3>
      <Section surface="Container" padding="32px" style={{ borderRadius: 8 }}>
        <H3>Container surface (inherits theme)</H3>
        <Body>Useful for card-like regions.</Body>
      </Section>

      <H3 style={{ marginTop: 32, marginBottom: 12 }}>Edges</H3>
      <BodySmall color="quiet" style={{ marginBottom: 16, display: 'block' }}>
        <code>edgeTop</code> / <code>edgeBottom</code>: the section reaches into its neighbour in its
        own color. Wave, scallop, zigzag, steps and random-wave repeat; curve and slant stretch.
        Scallop, zigzag and steps take <code>edgeSize</code>; random-wave, curve and slant default to 96px.
      </BodySmall>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Switch checked={animate} onChange={(e) => setAnimate(e.target.checked)} label="Drift (edgeAnimate)" />
        <ToggleButtonGroup value={size} onChange={setSize} size="small">
          {Object.keys(EDGE_SIZES).map((s) => <Button key={s} value={s} size="small">{s}</Button>)}
        </ToggleButtonGroup>
        <Button size="small" variant="default-outline" onClick={() => setSeed((n) => n + 1)}>New random wave</Button>
      </div>
      <div style={{ borderRadius: 8, overflow: 'hidden' }}>
        {/* A plain strip first, so the first edge has something to reach into. */}
        <Section theme="Neutral" surface="Surface" padding={'16px 32px ' + (heightOf(EDGE_NAMES[0]) + 16) + 'px'}>
          <BodySmall>edgeSize="{size}"{seed ? ` · edgeSeed={${seed}}` : ''}</BodySmall>
        </Section>
        {EDGE_NAMES.map((name, i) => {
          const sized = SIZED_EDGES.includes(name);
          const props = ['edgeTop="' + name + '"'];
          if (sized && size !== 'large') props.push('edgeSize="' + size + '"');
          if (name === 'random-wave' && seed) props.push('edgeSeed={' + seed + '}');
          return (
            <Section key={name} theme={i % 2 ? 'Secondary' : 'Primary'} surface="Surface"
                     edgeTop={name} edgeSize={size} edgeSeed={seed} edgeAnimate={animate}
                     padding={'16px 32px ' + ((EDGE_NAMES[i + 1] ? heightOf(EDGE_NAMES[i + 1]) : 0) + 24) + 'px'}>
              <BodySmall>{props.join(' ')}</BodySmall>
            </Section>
          );
        })}
      </div>

      <H3 style={{ marginTop: 32, marginBottom: 12 }}>Reference</H3>
      <DocSummary component="Section" />

      <H3 style={{ marginTop: 32, marginBottom: 12 }}>Different element</H3>
      <BodySmall color="quiet" style={{ marginBottom: 16, display: 'block' }}>
        Pass <code>as="article"</code>, <code>as="footer"</code>, etc.
      </BodySmall>
      {/* Neutral at its dimmest surface — what theme="Neutral" used to mean.
          The shade names were removed: a shade and a surface level were two ways
          of saying one thing, and an unmatched [data-theme] paints nothing. */}
      <Section as="article" theme="Neutral" surface="Surface-Dimmest" padding="32px" style={{ borderRadius: 8 }}>
        <H3>Neutral / Surface-Dimmest article</H3>
        <Body>Renders as an &lt;article&gt; element.</Body>
      </Section>
    </div>
  );
}

export default SectionShowcase;
