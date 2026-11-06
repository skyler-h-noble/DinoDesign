// src/components/ThumbnailSelector/ThumbnailSelector.stories.js
import React, { useState } from 'react';
import { ThumbnailSelector } from './ThumbnailSelector';
import { DEMO_ITEMS } from './demoImages';

export default {
  title: 'Selection/ThumbnailSelector',
  component: ThumbnailSelector,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
  },
};

/* Click a thumbnail, or Tab in and use the arrow keys (they move and select;
   Home / End jump). The last one is disabled and skipped. */
export const Default = {
  args: { size: 'medium', orientation: 'horizontal', disabled: false },
  render: (args) => {
    const [i, setI] = useState(0);
    return (
      <div style={{ display: 'flex', gap: 16, flexDirection: args.orientation === 'vertical' ? 'row' : 'column' }}>
        <img src={DEMO_ITEMS[i].src} alt={DEMO_ITEMS[i].alt} style={{ width: 280, height: 280, objectFit: 'cover' }} />
        <ThumbnailSelector {...args} aria-label="Product images" items={DEMO_ITEMS} value={i} onChange={setI} />
      </div>
    );
  },
};

/* The same row on a dark band: every edge resolves on that surface. */
export const OnDarkSurface = {
  render: () => (
    <div data-theme="Primary" data-surface="Surface-Dimmest" style={{ padding: 24 }}>
      <ThumbnailSelector aria-label="Product images" items={DEMO_ITEMS} defaultValue={1} />
    </div>
  ),
};
