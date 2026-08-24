// src/components/Section/SectionShowcase.js
import React from 'react';
import { Section } from './Section';
import { H3, Body, BodySmall } from '../Typography';
import { Button } from '../Button/Button';

export function SectionShowcase() {
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
        Sets data-theme="Primary-Light" + data-surface="Surface", paints --Background.
      </BodySmall>
      <Section theme="Primary-Light" surface="Surface" padding="32px" style={{ borderRadius: 8 }}>
        <H3>Primary-Light surface</H3>
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

      <H3 style={{ marginTop: 32, marginBottom: 12 }}>Different element</H3>
      <BodySmall color="quiet" style={{ marginBottom: 16, display: 'block' }}>
        Pass <code>as="article"</code>, <code>as="footer"</code>, etc.
      </BodySmall>
      <Section as="article" theme="Neutral-Dark" surface="Surface" padding="32px" style={{ borderRadius: 8 }}>
        <H3>Neutral-Dark article</H3>
        <Body>Renders as an &lt;article&gt; element.</Body>
      </Section>
    </div>
  );
}

export default SectionShowcase;
