// src/components/SkipLink/SkipLinkShowcase.js
import React from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { SkipLink } from './SkipLink';
import { Body, BodySmall } from '../Typography';
import { CodeBlock } from '../CodeBlock';

export function SkipLinkShowcase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ShowcaseHeader title="SkipLink" />
      <Body>Click the text below, then press Tab: the link appears at the top-left of the window, on its own surface with the focus ring. Enter moves focus to the target.</Body>
      <SkipLink href="#skiplink-demo-target" />
      <div id="skiplink-demo-target" style={{ padding: 16 }}>
        <BodySmall color="quiet">The demo target (stands in for the page&apos;s main region).</BodySmall>
      </div>
      <CodeBlock language="JSX" code={'<SkipLink />            {/* first child of the app */}\n<AppBar brand="Acme" />\n<Section as="main" id="main">…</Section>'} />
    </div>
  );
}

export default SkipLinkShowcase;
