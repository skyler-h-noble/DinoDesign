// src/components/Input/InputDecorator.js
import React from 'react';
import { Button } from '../Button/Button';
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * InputDecorator — Figma's `Input Decorator` (8590:24802): the ghost button an
 * Input carries at its end (clear, show password, a unit picker).
 *
 * It IS a ghost Button, with the rules a button inside a field needs:
 *   corners   square — it sits inside the field's padding, not on its edge
 *   hover     the surface's --Hover with the Level-1 lift, and NO rise: a
 *             button inside a field that jumps a pixel moves the field's text
 *   focus     a 3px ring INSIDE the button (2px in), as the Field Button —
 *             the field clips anything drawn outside it
 *
 *   <TextInput endAdornment={<InputDecorator aria-label="Clear"><BackspaceIcon /></InputDecorator>} />
 *   <InputDecorator endDecorator={<ExpandMoreIcon />}>USD</InputDecorator>
 *
 * Icon-only when it has an aria-label and no text — the same rule Button uses.
 */
export const InputDecorator = React.forwardRef(function InputDecorator({ children, sx = {}, className = '', ...props }, ref) {
  const iconOnly = React.Children.toArray(children).every((c) => typeof c !== 'string' && typeof c !== 'number');
  return (
    <Button
      ref={ref}
      variant="ghost"
      contentType={iconOnly ? 'iconOnly' : undefined}
      className={'input-decorator ' + className}
      sx={{
        borderRadius: 0,
        '&:hover:not(:disabled)': { transform: 'none', boxShadow: SHADOW_LEVEL_1 },
        '&:active:not(:disabled)': { transform: 'none', boxShadow: 'none' },
        // Square, like the button; the label stays --Quiet while focused (the ring says it).
        '&:focus-visible, &.Mui-focusVisible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-5px', color: 'var(--Quiet)' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
});

export default InputDecorator;
