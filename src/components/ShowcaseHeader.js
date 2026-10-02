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
import { BrandIcon } from './BrandIcon';
import { figmaUrlFor } from '../docs/figmaLinks';

export function ShowcaseHeader({ title, component }) {
  const figma = component ? figmaUrlFor(component) : null;
  return (
    /* No wrapping, and the title does not grow. H3 is a block element, so in a
       flex row it claimed the full width and pushed the link onto a second
       line — which read as the link being below the title rather than beside
       it. `flex: 0 1 auto` lets it shrink instead, and the link holds the
       right edge on the same row. */
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'nowrap' }}>
      <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
        <H3>{title}</H3>
      </Box>
      {figma && (
        <Link
          href={figma}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center',
                gap: 0.75, flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          <BrandIcon name="figma" />
          Open in Figma
        </Link>
      )}
    </Box>
  );
}

export default ShowcaseHeader;
