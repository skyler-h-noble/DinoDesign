// src/components/ImagePlaceholder/ImagePlaceholder.js
import React from 'react';
import { Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

/**
 * ImagePlaceholder — Figma's `Image Placeholder` (7251:1985): where an image
 * will go, before it has one.
 *
 *   fill   --Border-Variant (the file's Border-Variant at 20%; the CSS token
 *          carries that alpha), a light tint of the surface
 *   icon   the photo glyph in --Quiet, as large as the box allows — the
 *          shorter side less a pixel each edge, centred — so the slot reads as
 *          "an image goes here" at any size
 *
 * It fills its parent; give the parent the size (or use Ratio, which uses
 * this for an empty slot). Decorative: aria-hidden, since the empty slot says
 * nothing a screen reader needs. Pass role="img" + aria-label if the absence
 * itself is information ("No photo uploaded").
 */
export function ImagePlaceholder({ className = '', sx = {}, ...props }) {
  const labelled = props['aria-label'] || props['aria-labelledby'];
  return (
    <Box
      className={'image-placeholder ' + className}
      aria-hidden={labelled ? undefined : 'true'}
      sx={{
        position: 'relative',
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--Border-Variant)',
        color: 'var(--Quiet)',
        overflow: 'hidden',
        containerType: 'size',
        '& .image-placeholder-icon': {
          // The shorter side less a pixel each edge, as the file draws it.
          width: 'calc(min(100cqw, 100cqh) - 2px)',
          height: 'calc(min(100cqw, 100cqh) - 2px)',
          color: 'inherit',
        },
        ...sx,
      }}
      {...props}
    >
      <ImageIcon className="image-placeholder-icon" />
    </Box>
  );
}

export default ImagePlaceholder;
