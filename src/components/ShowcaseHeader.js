// src/components/ShowcaseHeader.js
//
// Every showcase's title row: the name on the left, "Open in Figma" hard right.
//
// A component rather than markup repeated 56 times, because the link needs the
// doc name to resolve its Figma page and the title is the only place that
// knows it. It also keeps the row's one real rule in one file: the link is
// pinned right with margin-left:auto, so it stays at the page edge however
// long the title is, instead of trailing after it.
//
// The link renders only when figmaUrlFor returns a URL. A component with no
// Figma page gets no link rather than one that lands on the file root, which
// is the same contract figmaLinks.js already made for itself.
import React from 'react';
import { Box } from '@mui/material';
import { H3 } from './Typography';
import { Link } from './Link/Link';
import { FigmaIcon } from './FigmaIcon';
import { figmaUrlFor } from '../docs/figmaLinks';

export function ShowcaseHeader({ title, component }) {
  const figma = component ? figmaUrlFor(component) : null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <H3>{title}</H3>
      {figma && (
        <Link
          href={figma}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
        >
          <FigmaIcon />
          Open in Figma
        </Link>
      )}
    </Box>
  );
}

export default ShowcaseHeader;
