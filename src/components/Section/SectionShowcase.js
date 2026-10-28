// src/components/Section/SectionShowcase.js
import React, { useState } from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { Section } from './Section';
import { H3, Body, BodySmall } from '../Typography';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { DocSummary } from '../../docs/DocPanels';
import { EDGE_NAMES } from './edges';

export function SectionShowcase() {
  const [animate, setAnimate] = useState(false);
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
        own color. Wave, scallop, zigzag and steps repeat; curve and slant stretch.
      </BodySmall>
      <div style={{ marginBottom: 16 }}>
        <Switch checked={animate} onChange={(e) => setAnimate(e.target.checked)} label="Drift (edgeAnimate)" />
      </div>
      <div style={{ borderRadius: 8, overflow: 'hidden' }}>
        {EDGE_NAMES.map((name, i) => (
          <Section key={name} theme={i % 2 ? 'Secondary' : 'Primary'} surface="Surface"
                   edgeTop={name} edgeHeight={32} edgeAnimate={animate} padding="20px 32px 52px">
            <BodySmall>edgeTop="{name}"</BodySmall>
          </Section>
        ))}
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
