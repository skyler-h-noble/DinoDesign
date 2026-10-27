// src/components/List/List.js
import React from 'react';
import { Box, Checkbox, Radio } from '@mui/material';
import { EyebrowSmall, Eyebrow, EyebrowLarge, SubtitleSmall, Subtitle, SubtitleLarge, BodySmall, Body, BodyLarge } from '../Typography';
import { Ghost } from '../_ghost';
import { ImagePlaceholder } from '../ImagePlaceholder';

// Default three-layer typography for the text frame. Order is top→bottom:
//   eyebrow   — EyebrowSmall  (optional metadata kicker on top)
//   title     — SubtitleLarge  (children, the main label)
//   secondary — Body           (supporting description)
// Single-line consumers (just `children`) render only the SubtitleLarge title
// so plain "Home" / "Inbox" rows still look like titles, not metadata.
/* Figma's List Item text: Dynamic-Eyebrow, Dynamic-Subtitle, Dynamic Body —
   one step of each per Component-Size mode. Each keeps its own colour role:
   the eyebrow in --Eyebrow, title and body in --Text. (It was Eyebrow-Small /
   Body / Body-Small-Semibold at every size, eyebrow and body in --Quiet.) */
const LAYERS_BY_SIZE = {
  small:  { eyebrow: EyebrowSmall, title: SubtitleSmall, secondary: BodySmall },
  medium: { eyebrow: Eyebrow,      title: Subtitle,      secondary: Body },
  large:  { eyebrow: EyebrowLarge, title: SubtitleLarge, secondary: BodyLarge },
};
/* Component-Size prefix for the List-item tokens. */
const LI_PREFIX = { small: 'Sm-', medium: '', large: 'Lg-' };
const liVar = (size, name, fallback) => 'var(--' + (LI_PREFIX[size] ?? '') + 'List-Item-' + name + ', ' + fallback + ')';

/* One map. solid and light are the same PALETTE on different levels, so a
   second map was a second place to keep the same eight names in step — and
   the copy that fell behind was the one naming themes that no longer exist.
   
   Every entry in the old light map, and the four state entries in the solid
   one, bound nothing: a light error list and a light success list rendered
   identically, both taking whatever palette the page was on. */
const THEME_MAP = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

/** light lightens by LEVEL. solid leaves the surface to the page. */
const LIGHT_SURFACE = 'Surface-Brightest';

const SIZE_MAP = {
  small:  { py: 0.5, px: 1.5, fontSize: '13px', iconSize: 16, decoratorSize: 28, gap: 1, checkSize: 'small' },
  medium: { py: 1,   px: 1,   fontSize: '14px', iconSize: 20, decoratorSize: 36, gap: 1.5, checkSize: 'small' },
  large:  { py: 1.5, px: 2.5, fontSize: '16px', iconSize: 24, decoratorSize: 40, gap: 2, checkSize: 'medium' },
};

export function ListItemDecorator({ children, size = 'medium', isButton = false, onAction, ariaLabel }) {
  // Both decorator paths now hug their content — no forced width/height. The
  // consumer passes a sized child (Icon size="small", Avatar size="medium",
  // Ratio ratio="1:1" with maxWidth, etc.) and the slot wraps it tightly.
  if (isButton) {
    return (
      <Box component="button" role="button" tabIndex={0}
        aria-label={ariaLabel || 'Action'}
        onClick={(e) => { e.stopPropagation(); onAction?.(e); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onAction?.(e); } }}
        className="list-item-decorator-button"
        sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          padding: 0,
          border: 'none', backgroundColor: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'inherit',
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: 'rgba(128,128,128,0.15)' },
          '&:active': { backgroundColor: 'rgba(128,128,128,0.25)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' } }}>
        {children}
      </Box>
    );
  }
  return (
    <Box className="list-item-decorator"
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </Box>
  );
}

export function ListItem({
  children, startDecorator, endDecorator,
  startDecoratorIsButton = false, endDecoratorIsButton = false,
  onStartDecoratorAction, onEndDecoratorAction,
  startDecoratorAriaLabel, endDecoratorAriaLabel,
  size = 'medium', variant = 'default', color,
  // Three stacked text layers — children is the title (SubtitleLarge),
  // secondary is supporting body (Body), eyebrow is the optional kicker
  // on top (EyebrowSmall). Vstacked with no gap (line-height carries rhythm).
  // `overline` is the former name for `eyebrow`, still accepted.
  eyebrow, overline, secondary,
  /* Figma's Image boolean: an 80px square (List-Item-Default-Image-Width) at
     the start of the row. A URL draws it cropped to fill, a node is drawn as
     given, true draws the Image Placeholder. imageAlt names it; leave it empty
     when the image is decoration. */
  image, imageAlt = '',
  clickable = false, disabled = false, selected = false,
  selectionMode = 'none', onSelect, onClick,
  // Non-clickable mode dividers. Apply only when !clickable — the clickable
  // mode has its own card chrome (border + shadow) instead. bottomBorder
  // separates rows in a vertical non-clickable list; rightBorder separates
  // items in a horizontal non-clickable list.
  bottomBorder = false, rightBorder = false,
  /* The element to render as. `li` is right whenever the item is a direct
     child of the List's own <ul>, which is every ordinary case — but the
     loading skeleton nests rows inside a wrapper, and an <li> inside an <li>
     is invalid markup that React warns about and some screen readers
     flatten. */
  component = 'li',
  sx = {}, ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isClickable = clickable || !!onClick;
  const isSelectable = selectionMode === 'checkbox' || selectionMode === 'radio';
  const isFocusable = (isClickable || isSelectable) && !disabled;

  const getRole = () => {
    if (isSelectable) return 'option';
    if (isClickable) return 'button';
    return 'listitem';
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (isSelectable) onSelect?.(e);
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); }
  };

  return (
    <Box component={component} role={getRole()} tabIndex={isFocusable ? 0 : undefined}
      aria-disabled={disabled || undefined}
      aria-selected={isSelectable ? selected : (selected || undefined)}
      aria-checked={selectionMode === 'checkbox' ? selected : undefined}
      onClick={handleClick} onKeyDown={isFocusable ? handleKeyDown : undefined}
      className={'list-item' + (selected ? ' list-item-selected' : '') + (disabled ? ' list-item-disabled' : '')
        + (isClickable ? ' list-item-clickable' : '') + (isSelectable ? ' list-item-selectable' : '')}
      sx={{
        // hstack, top-left aligned, fill width, with Sizing-1-and-Half (12px)
        // gap between Start slot → Text frame → End slot.
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        // Include padding in the 100% width so the row fills — not overflows —
        // its parent (without this, width:100% + 16px L/R padding spills 32px).
        boxSizing: 'border-box',
        /* Figma binds the row's padding, gap and corner to Component-Size
           List-item/List-Item-Padding / -Gap / -Radius. */
        /* Gap is the space INSIDE the row (image, text, decorators), a fixed
           4 / 8 / 12 — the fallback matches, for a system made before it. */
        gap: liVar(size, 'Gap', ({ small: '4px', large: '12px' })[size] || '8px'),
        padding: liVar(size, 'Padding', '12px'),
        minHeight: 'var(--Sizing-4, 32px)',
        fontSize: s.fontSize, fontFamily: 'inherit', color: 'var(--Text)', listStyle: 'none',
        cursor: isFocusable ? 'pointer' : 'default', opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        position: 'relative',
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        // Card chrome — only when the row is clickable. Non-clickable rows
        // stay bare so they sit flat in a stack; non-clickable dividers
        // (bottomBorder / rightBorder) handle row separation instead.
        // Card chrome when clickable: Figma's inside 1px --Border stroke (an
        // inset ring, so it takes no space) at the List-Item-Radius corner.
        // No resting shadow — Figma's Default row has none.
        ...(isClickable ? {
          boxShadow: 'inset 0 0 0 1px var(--Border)',
          borderRadius: liVar(size, 'Radius', 'var(--Input-Radius)'),
        } : {}),
        // Non-clickable separators — single hairline at the edge the user
        // requested. Mutually exclusive with card chrome above.
        /* Drawn INSIDE the row, as Figma's divider overlays the row's bottom
           edge: an inset shadow, so it adds no height (a border made every row
           1px taller than the design and pushed each next row down). */
        ...(!isClickable && (bottomBorder || rightBorder) ? {
          boxShadow: [
            bottomBorder && 'inset 0 -1px 0 var(--Border-Variant)',
            rightBorder && 'inset -1px 0 0 var(--Border-Variant)',
          ].filter(Boolean).join(', '),
        } : {}),
        backgroundColor: 'transparent',
        /* Selected is a RING, not a tint: a 2px Border ring INSIDE the row
           (Figma 7022:49393 — the Selected frame, stroke 2 Inside, Surface
           Border, the row's own corner). The edges step 1 → 2 → 3: resting
           1px Border, selected 2px Border, focus a 3px Focus-Visible ring —
           the same 1 → 2 thickening Input and Select use, so selection reads
           without relying on color, and stays distinct from focus.

           It drew a 1px outline OUTSIDE the row until Figma settled the ring.

           Border from SURFACE, not from Buttons — held by
           ListSelectedRing.test.js.

           A tint would conflate hover with selection; a ring and a tint can
           coexist, two tints cannot.

           ::before, because focus owns ::after and `outline: none`, so a row
           that is both selected and focused shows both rings. */
        ...(selected ? {
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: '2px solid var(--Border)',
            borderRadius: liVar(size, 'Radius', 'var(--Input-Radius)'),
            pointerEvents: 'none',
          },
        } : {}),
        // The inset edge rides along with the state shadows, or a hovered row
        // would lose its border.
        '&:hover':         isFocusable ? { backgroundColor: 'var(--Hover)',  boxShadow: (isClickable ? 'inset 0 0 0 1px var(--Border), ' : '') + 'var(--Effect-Level-2)' } : {},
        '&:active':        isFocusable ? { backgroundColor: 'var(--Pressed)', boxShadow: (isClickable ? 'inset 0 0 0 1px var(--Border), ' : '') + 'var(--Effect-Level-1)' } : {},
        // Inset focus ring rendered as a pseudo-element so the corner
        // radius (--Input-Inner-Focus-Visible = Input-Radius minus 1px)
        // can differ from the row's outer radius. A CSS `outline` follows
        // the element's own border-radius and can't be tuned per-state.
        '&:focus-visible': { outline: 'none' },
        '&:focus-visible::after': {
          content: '""',
          position: 'absolute',
          inset: '1px',
          border: '3px solid var(--Focus-Visible)',
          borderRadius: liVar(size, 'Focus-Radius', 'var(--Input-Inner-Focus-Visible)'),
          pointerEvents: 'none',
        },
        ...sx }}
      {...props}>
      {selectionMode === 'checkbox' && (
        <Checkbox checked={selected} disabled={disabled} size={s.checkSize} tabIndex={-1}
          onClick={(e) => e.stopPropagation()} onChange={() => onSelect?.()}
          sx={{ p: 0, mr: 0, color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
          inputProps={{ 'aria-label': 'Select ' + (typeof children === 'string' ? children : 'item') }} />
      )}
      {selectionMode === 'radio' && (
        <Radio checked={selected} disabled={disabled} size={s.checkSize} tabIndex={-1}
          onClick={(e) => e.stopPropagation()} onChange={() => onSelect?.()}
          sx={{ p: 0, mr: 0, color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
          inputProps={{ 'aria-label': 'Select ' + (typeof children === 'string' ? children : 'item') }} />
      )}
      {image && (
        <Box className="list-item-image" sx={{
          width: 'var(--List-Item-Default-Image-Width, 80px)', aspectRatio: '1 / 1', flexShrink: 0, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          '& > img': { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
        }}>
          {typeof image === 'string'
            ? <img src={image} alt={imageAlt} />
            : image === true ? <ImagePlaceholder sx={{ width: '100%', height: '100%' }} /> : image}
        </Box>
      )}
      {startDecorator && (
        <ListItemDecorator size={size} isButton={startDecoratorIsButton}
          onAction={onStartDecoratorAction} ariaLabel={startDecoratorAriaLabel}>
          {startDecorator}
        </ListItemDecorator>
      )}
      {(() => {
        // Text frame — flex-fills the remaining horizontal space between
        // start decorator and end decorator. The text frame ITSELF fills,
        // and each line wraps naturally rather than ellipsis-truncating.
        // Order is top→bottom: eyebrow (kicker) → children (title) →
        // secondary (body).
        const Layers = LAYERS_BY_SIZE[size] || LAYERS_BY_SIZE.medium;
        const kicker = eyebrow ?? overline;
        const lineSx = {
          display: 'block',
          width: '100%',
          // Allow natural wrapping. Long strings flow to multiple lines
          // instead of getting cut with ellipsis — the row's minHeight
          // gives the visual baseline; the text decides the real height.
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        };
        return (
          <Box sx={{
            // Fill the remaining horizontal space. minWidth:0 lets flex
            // shrink past the children's intrinsic size so wrapping works
            // (without it, long unbroken text would overflow the row).
            flex: '1 1 auto',
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            // Text layers (eyebrow → title → secondary) stack with NO gap —
            // line-height carries the rhythm; matches the Figma text frame.
            gap: 0,
          }}>
            {kicker && (
              <Layers.eyebrow style={lineSx}>
                {kicker}
              </Layers.eyebrow>
            )}
            {children !== undefined && children !== null && (
              <Layers.title style={lineSx}>
                {children}
              </Layers.title>
            )}
            {secondary && (
              <Layers.secondary style={lineSx}>
                {secondary}
              </Layers.secondary>
            )}
          </Box>
        );
      })()}
      {endDecorator && (
        <ListItemDecorator size={size} isButton={endDecoratorIsButton}
          onAction={onEndDecoratorAction} ariaLabel={endDecoratorAriaLabel}>
          {endDecorator}
        </ListItemDecorator>
      )}
    </Box>
  );
}

export function List({
  children, items, variant = 'default', color = 'primary', size = 'medium',
  orientation = 'vertical', dividers = false, selectionMode = 'none',
  /* Same split as Table: loading has no copy so it is a prop; empty and error
     need words, so they are slots holding a StateMessage. */
  loading = false, skeletonRows = 3, empty, error,
  selectedIndices = [], onSelectionChange, clickable = false,
  component = 'ul', className = '', sx = {}, ...props
}) {
  const isHorizontal = orientation === 'horizontal';
  const isSelectable = selectionMode === 'checkbox' || selectionMode === 'radio';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDefault = variant === 'default';

  const wrapperDataAttrs = {};
  if ((isSolid || isLight) && THEME_MAP[color]) {
    wrapperDataAttrs['data-theme'] = THEME_MAP[color];
    // The palette is the same either way; the level is the variant.
    if (isLight) wrapperDataAttrs['data-surface'] = LIGHT_SURFACE;
  }

  const handleItemSelect = (index) => {
    if (!onSelectionChange) return;
    if (selectionMode === 'radio') {
      onSelectionChange([index]);
    } else {
      const next = selectedIndices.includes(index)
        ? selectedIndices.filter((i) => i !== index)
        : [...selectedIndices, index];
      onSelectionChange(next);
    }
  };

  /* error > loading > empty. A request that returned nothing is not empty
     until it has finished — the other order gives the classic flash of "no
     results" a moment before the data lands. */
  const dataState = error ? 'error' : loading ? 'loading' : (items && items.length === 0 && empty) ? 'empty' : null;

  const renderItems = () => {
    if (dataState === 'loading') {
      /* Real ListItems, ghosted, so the row height and decorator positions are
         the ones the data will land in. */
      return (
        <Box component="li" sx={{ listStyle: 'none' }}>
          <Ghost label="Loading">
            {/* `component="div"`: these rows sit inside the wrapper <li>
                above, and Ghost puts a <div> between, so rendering them as
                <li> gave ul > li > div > li — an <li> descended from an <li>.
                They are still real ListItems, which is the point of the
                skeleton: the row height and decorator positions are the ones
                the data will land in. */}
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <ListItem key={'sk-' + i} component="div" size={size} variant={variant} color={color}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </ListItem>
            ))}
          </Ghost>
        </Box>
      );
    }
    /* The message is a <li> because the parent is a <ul>: a bare <div> in a
       list is invalid and some screen readers drop it, so the one thing the
       user needs to hear would be the thing not announced. */
    if (dataState === 'error') return <Box component="li" sx={{ listStyle: 'none' }}>{error}</Box>;
    if (dataState === 'empty') return <Box component="li" sx={{ listStyle: 'none' }}>{empty}</Box>;

    if (items && items.length > 0) {
      const elements = [];
      items.forEach((item, index) => {
        elements.push(
          <ListItem key={'item-' + index} size={size} variant={variant} color={color}
            image={item.image} imageAlt={item.imageAlt}
            startDecorator={item.startDecorator} endDecorator={item.endDecorator}
            startDecoratorIsButton={item.startDecoratorIsButton}
            endDecoratorIsButton={item.endDecoratorIsButton}
            onStartDecoratorAction={item.onStartDecoratorAction}
            onEndDecoratorAction={item.onEndDecoratorAction}
            startDecoratorAriaLabel={item.startDecoratorAriaLabel}
            endDecoratorAriaLabel={item.endDecoratorAriaLabel}
            eyebrow={item.eyebrow ?? item.overline} secondary={item.secondary}
            clickable={clickable || item.clickable}
            disabled={item.disabled}
            bottomBorder={item.bottomBorder}
            rightBorder={item.rightBorder}
            selected={isSelectable ? selectedIndices.includes(index) : item.selected}
            selectionMode={selectionMode} onSelect={() => handleItemSelect(index)}
            onClick={item.onClick}>
            {item.label || item.children}
          </ListItem>
        );
        if (dividers && index < items.length - 1) {
          elements.push(
            <Box key={'div-' + index} component="li" role="separator" aria-hidden="true"
              sx={isHorizontal
                ? { width: '1px', alignSelf: 'stretch', backgroundColor: 'var(--Border)', flexShrink: 0 }
                : { height: '1px', backgroundColor: 'var(--Border)' }} />
          );
        }
      });
      return elements;
    }
    if (children) {
      const childArray = React.Children.toArray(children);
      if (!dividers) return childArray;
      const elements = [];
      childArray.forEach((child, index) => {
        elements.push(child);
        if (index < childArray.length - 1) {
          elements.push(
            <Box key={'div-' + index} component="li" role="separator" aria-hidden="true"
              sx={isHorizontal
                ? { width: '1px', alignSelf: 'stretch', backgroundColor: 'var(--Border)', flexShrink: 0 }
                : { height: '1px', backgroundColor: 'var(--Border)' }} />
          );
        }
      });
      return elements;
    }
    return null;
  };

  return (
    <Box component={component} role={isSelectable ? 'listbox' : 'list'}
      aria-busy={dataState === 'loading' ? 'true' : undefined}
      aria-multiselectable={selectionMode === 'checkbox' ? true : undefined}
      {...wrapperDataAttrs}
      className={'list-container list-' + variant + ' list-' + color + ' ' + className}
      sx={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column',
        boxSizing: 'border-box',
        // Stretch in both orientations:
        //   • vertical → items span full width
        //   • horizontal → items match the tallest sibling's height, so
        //     a row of items all have a uniform bottom edge and the
        //     content within each item is top-aligned.
        alignItems: 'stretch',
        // Clickable Lists separate their card-chromed items with 8px to
        // keep individual borders + shadows visually distinct. Non-clickable
        // Lists keep gap:0 — rows are visually joined by hairlines or just
        // sit flush against each other.
        gap: clickable ? 'var(--Sizing-1)' : 0,
        m: 0,
        p: isDefault ? 0 : 1,
        backgroundColor: isDefault ? 'transparent' : 'var(--Background)',
        color: 'var(--Text)',
        // The List container has NO border by itself. Visual separation
        // between rows is the responsibility of ListItem (via clickable
        // chrome OR bottomBorder/rightBorder dividers).
        borderRadius: isDefault ? 0 : 'var(--Style-Border-Radius)',
        // List fills its parent's width. No overflow:hidden — items'
        // shadows and focus rings (which can extend slightly beyond the
        // row edge) shouldn't be clipped at the container boundary.
        width: '100%',
        listStyle: 'none',
        // In horizontal mode, every direct child item flexes equally so a
        // row of items has uniform column widths. width:100% on the item
        // works for vertical stacks but in a row it'd force each item to
        // 100% of the container; flex:1 1 0 distributes evenly instead.
        ...(isHorizontal ? {
          '& > .list-item': { flex: '1 1 0', width: 'auto' },
        } : {}),
        ...sx }}
      {...props}>
      {renderItems()}
    </Box>
  );
}

export const DefaultList = (p) => <List variant="default" {...p} />;
export const SolidList   = (p) => <List variant="solid"   {...p} />;
export const LightList   = (p) => <List variant="light"   {...p} />;
export default List;