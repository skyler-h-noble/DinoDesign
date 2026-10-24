// src/components/Sheet/Sheet.stories.js
import React, { useState } from 'react';
import { Sheet } from './Sheet';
import { Button } from '../Button/Button';

export default { title: 'Surfaces/Sheet', component: Sheet };

function Demo(props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} aria-label="Share" {...props}>
        <strong>Share</strong>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Sheet>
    </>
  );
}

export const Default = { render: () => <Demo /> };
export const NoScrim = { render: () => <Demo hideBackdrop /> };
export const BrightSurface = { render: () => <Demo surface="Surface-Bright" /> };
