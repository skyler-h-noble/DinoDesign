// src/components/Shape/ShapeShowcase.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { DocSummary } from '../../docs/DocPanels';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { BackgroundPicker } from '../BackgroundPicker';
import { BodySmall, Caption, EyebrowSmall } from '../Typography';
import { Shape } from './Shape';
import { SHAPE_NAMES, SHAPE_GROUPS } from './shapes';

const GROUP_LABEL = {
  radius: 'Radius — follow the brand', round: 'Round', polygon: 'Soft polygons',
  cookie: 'Cookies, suns and flowers — these morph', burst: 'Bursts', pixel: 'Pixel', cut: 'Cut',
};

export function ShapeShowcase() {
  const [bgTheme, setBgTheme] = useState('Default');
  const [bgSurface, setBgSurface] = useState('Surface');
  const groups = Object.keys(GROUP_LABEL).map((g) => [g, SHAPE_NAMES.filter((n) => SHAPE_GROUPS[n] === g)]);

  return (
    <Box sx={{ pb: 8 }}>
      <ShowcaseHeader title="Shape" component="Shape" />
      <Box sx={{ mt: 1 }}>
        <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
      </Box>
      <BodySmall color="quiet">
        A box cut to one of the system&rsquo;s shapes — for image frames, accents and the occasional sticker.
        The same paths build the Figma Shapes component.
      </BodySmall>
      <Box data-theme={bgTheme} data-surface={bgSurface} sx={{ mt: 2, backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
        <Tabs defaultValue={0} variant="standard">
          <TabList>
            <Tab>Summary</Tab>
            <Tab>All shapes</Tab>
          </TabList>
          <TabPanel value={0}>
            <DocSummary component="Shape" theme={bgTheme} surface={bgSurface} />
          </TabPanel>
          <TabPanel value={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--Sizing-4, 32px)', py: 2 }}>
              {groups.map(([g, names]) => (
                <Box key={g} sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--Sizing-2, 16px)' }}>
                  <EyebrowSmall>{GROUP_LABEL[g]}</EyebrowSmall>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 'var(--Sizing-2, 16px)' }}>
                    {names.map((n) => (
                      <Box key={n} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--Sizing-1, 8px)' }}>
                        <Shape shape={n} color="primary" width={64} decorative />
                        <Caption color="quiet">{n}</Caption>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    </Box>
  );
}

export default ShapeShowcase;
