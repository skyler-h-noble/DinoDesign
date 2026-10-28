// src/components/Quote/QuoteShowcase.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary } from '../../docs/DocPanels';
import { BackgroundPicker } from '../BackgroundPicker';
import { BodySmall } from '../Typography';

export function QuoteShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Quote" component="Quote" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">A pull quote or a testimonial: the words, who said them, and what they are.</BodySmall>
      <Box data-theme={bgTheme} data-surface={bgSurface} sx={{ mt: 2, backgroundColor: 'var(--Background)', p: 2 }}>
        <DocSummary component="Quote" theme={bgTheme} surface={bgSurface} />
      </Box>
    </Box>
  );
}

export default QuoteShowcase;
