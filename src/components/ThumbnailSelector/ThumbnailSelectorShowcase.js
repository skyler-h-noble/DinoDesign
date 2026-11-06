// src/components/ThumbnailSelector/ThumbnailSelectorShowcase.js
import React, { useState } from 'react';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { ThumbnailSelector } from './ThumbnailSelector';
import { Body, BodySmall } from '../Typography';
import { Section } from '../Section';
import { CodeBlock } from '../CodeBlock';
import { DEMO_ITEMS } from './demoImages';

const CODE = `<ThumbnailSelector
  aria-label="Product images"
  value={image}
  onChange={setImage}
  items={[
    { src: '/img/front.jpg', alt: 'Front view' },
    { src: '/img/back.jpg', alt: 'Back view' },
  ]}
/>`;

export function ThumbnailSelectorShowcase() {
  const [i, setI] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ShowcaseHeader title="Thumbnail Selector" />
      <Body>
        Pick one image from a row of thumbnails — a product gallery&apos;s views. It is a radio group: Tab lands on the
        selected thumbnail, the arrow keys move and select, Home / End jump, and the disabled one is skipped. Each
        thumbnail is named by its alt text; the picture inside is decorative so the name is read once.
      </Body>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <img src={DEMO_ITEMS[i].src} alt={DEMO_ITEMS[i].alt} style={{ width: 240, height: 240, objectFit: 'cover' }} />
        <ThumbnailSelector aria-label="Product images" orientation="vertical" size="small"
          items={DEMO_ITEMS} value={i} onChange={setI} />
      </div>

      {['small', 'medium', 'large'].map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BodySmall color="quiet">size=&quot;{s}&quot;</BodySmall>
          <ThumbnailSelector aria-label={'Product images, ' + s} size={s} items={DEMO_ITEMS} defaultValue={1} />
        </div>
      ))}

      <BodySmall color="quiet">On a dark band (Primary · Surface-Dimmest): the edge, selected ring and focus ring follow the surface.</BodySmall>
      <Section theme="Primary" surface="Surface-Dimmest" padding="small">
        <ThumbnailSelector aria-label="Product images on a dark band" items={DEMO_ITEMS} defaultValue={2} />
      </Section>

      <CodeBlock language="JSX" code={CODE} />
    </div>
  );
}

export default ThumbnailSelectorShowcase;
