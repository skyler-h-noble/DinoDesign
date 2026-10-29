// src/components/List/List.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { EyebrowSmall, Eyebrow, EyebrowLarge, SubtitleSmall, Subtitle, SubtitleLarge, BodySmall, Body, BodyLarge } from '../Typography';
import { Ghost } from '../_ghost';
import { Button } from '../Button/Button';
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

/* ── Static sheet ───────────────────────────────────────────────────────
   List and ListItem were MUI Boxes with an sx each; the selection marks were
   MUI's Checkbox and Radio. All of it is plain markup now, styled from this
   sheet over the same tokens. Every rule weighs what emotion's did — one class,
   one class + a state — so a caller's sx (through the lazy Box) still wins. */
const SIZE_KEY = { small: 'sm', large: 'lg' };
const sizeKey = (size) => SIZE_KEY[size] || 'md';
registerStaticStyles('omni-list', [
  '.omni-list{display:flex;flex-direction:column;box-sizing:border-box;align-items:stretch;gap:0;margin:0;padding:0;'
    + 'background-color:transparent;color:var(--Text);border-radius:0;width:100%;list-style:none}',
  '.omni-list-h{flex-direction:row}',
  '.omni-list-click{gap:var(--Sizing-1)}',
  '.omni-list-painted{padding:8px;background-color:var(--Background);border-radius:var(--Style-Border-Radius)}',
  '.omni-list-h>.list-item{flex:1 1 0;width:auto}',
  '.omni-list-msg{list-style:none}',
  '.omni-list-sep{height:1px;background-color:var(--Border)}',
  '.omni-list-sep-h{width:1px;align-self:stretch;background-color:var(--Border);flex-shrink:0}',
  '.omni-li{display:flex;flex-direction:row;align-items:flex-start;justify-content:flex-start;width:100%;box-sizing:border-box;'
    + 'gap:var(--_li-gap);padding:var(--_li-pad);min-height:var(--Sizing-4, 32px);font-size:var(--_li-fs);font-family:inherit;'
    + 'color:var(--Text);list-style:none;cursor:default;opacity:1;position:relative;'
    + 'transition:background-color 0.15s ease, box-shadow 0.15s ease;background-color:transparent}',
  ...['sm', 'md', 'lg'].map((k) => {
    const size = k === 'sm' ? 'small' : k === 'lg' ? 'large' : 'medium';
    return `.omni-li-${k}{--_li-gap:${liVar(size, 'Gap', ({ small: '4px', large: '12px' })[size] || '8px')};`
      + `--_li-pad:${liVar(size, 'Padding', '12px')};--_li-fs:${SIZE_MAP[size].fontSize};`
      + `--_li-rad:${liVar(size, 'Radius', 'var(--Input-Radius)')};--_li-frad:${liVar(size, 'Focus-Radius', 'var(--Input-Inner-Focus-Visible)')}}`;
  }),
  '.omni-li-f,.omni-li-fc{cursor:pointer}',
  '.omni-li-off{opacity:var(--Disabled, 0.38)}',
  '.omni-li-click{box-shadow:inset 0 0 0 1px var(--Border);border-radius:var(--_li-rad)}',
  '.omni-li-bb{box-shadow:inset 0 -1px 0 var(--Border-Variant)}',
  '.omni-li-rb{box-shadow:inset -1px 0 0 var(--Border-Variant)}',
  '.omni-li-bbrb{box-shadow:inset 0 -1px 0 var(--Border-Variant), inset -1px 0 0 var(--Border-Variant)}',
  '.omni-li-sel::before{content:"";position:absolute;inset:0;border:2px solid var(--Border);border-radius:var(--_li-rad);pointer-events:none}',
  '.omni-li-f:hover{background-color:var(--Hover);box-shadow:var(--Effect-Level-2)}',
  '.omni-li-f:active{background-color:var(--Pressed);box-shadow:var(--Effect-Level-1)}',
  '.omni-li-fc:hover{background-color:var(--Hover);box-shadow:inset 0 0 0 1px var(--Border), var(--Effect-Level-2)}',
  '.omni-li-fc:active{background-color:var(--Pressed);box-shadow:inset 0 0 0 1px var(--Border), var(--Effect-Level-1)}',
  '.omni-li:focus-visible{outline:none}',
  '.omni-li:focus-visible::after{content:"";position:absolute;inset:1px;border:3px solid var(--Focus-Visible);border-radius:var(--_li-frad);pointer-events:none}',
  '.omni-li-text{flex:1 1 auto;width:100%;min-width:0;display:flex;flex-direction:column;gap:0}',
  '.omni-li-img{width:var(--List-Item-Default-Image-Width, 80px);aspect-ratio:1 / 1;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center}',
  '.omni-li-img>img{width:100%;height:100%;object-fit:cover;display:block}',
  '.omni-li-dec{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}',
  /* The selection mark: MUI's Checkbox / Radio (ButtonBase + SwitchBase) with
     the item's sx (no padding, the row's color), as markup. MUI's default
     primary hover wash and its disabled grey are MUI's own values, kept. */
  '.omni-li-ctl{display:inline-flex;align-items:center;justify-content:center;position:relative;box-sizing:border-box;'
    + '-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;cursor:pointer;user-select:none;'
    + 'vertical-align:middle;-moz-appearance:none;-webkit-appearance:none;appearance:none;text-decoration:none;border-radius:50%;padding:0;color:inherit}',
  '.omni-li-ctl:hover{background-color:rgba(25, 118, 210, 0.04)}',
  '@media (hover: none){.omni-li-ctl:hover{background-color:transparent}}',
  '@media print{.omni-li-ctl{-webkit-print-color-adjust:exact;print-color-adjust:exact}}',
  '.omni-li-ctl.Mui-checked{color:inherit}',
  '.omni-li-ctl.Mui-disabled{pointer-events:none;cursor:default;color:rgba(0, 0, 0, 0.26)}',
  '.omni-li-ctl-in{cursor:inherit;position:absolute;opacity:0;width:100%;height:100%;top:0;left:0;margin:0;padding:0;z-index:1}',
  '.omni-li-ctl-svg{user-select:none;width:1em;height:1em;display:inline-block;flex-shrink:0;'
    + 'transition:fill 200ms cubic-bezier(0.4, 0, 0.2, 1);fill:currentColor;font-size:1.5rem}',
  '.omni-li-ctl-svg.MuiSvgIcon-fontSizeSmall{font-size:1.25rem}',
  '.omni-li-ctl-dot{position:relative;display:flex}',
  '.omni-li-ctl-dot>.omni-li-ctl-svg{transform:scale(1)}',
  '.omni-li-ctl-dot>.omni-li-ctl-svg+.omni-li-ctl-svg{left:0;position:absolute;transform:scale(0);transition:transform 150ms cubic-bezier(0.4, 0, 1, 1)}',
  '.Mui-checked>.omni-li-ctl-dot>.omni-li-ctl-svg+.omni-li-ctl-svg{transform:scale(1);transition:transform 150ms cubic-bezier(0, 0, 0.2, 1)}',
].join('\n'));

const SxBox = lazySxBox('List');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

const PATHS = {
  CheckBoxOutlineBlankIcon: 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
  CheckBoxIcon: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  RadioButtonUncheckedIcon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
  RadioButtonCheckedIcon: 'M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z',
};
const capS = (x) => x.charAt(0).toUpperCase() + x.slice(1);
function MarkIcon({ name, size }) {
  return (
    <svg className={'MuiSvgIcon-root MuiSvgIcon-fontSize' + capS(size) + ' omni-li-ctl-svg'} focusable="false" aria-hidden="true"
      viewBox="0 0 24 24" data-testid={name}>
      <path d={PATHS[name]} />
    </svg>
  );
}

/* The row's selection mark: MUI's Checkbox / Radio markup and class names
   (MuiCheckbox-root, PrivateSwitchBase-input, Mui-checked, …), a real
   checkbox / radio input over the icon, out of the tab order — the row is the
   control. The press ripple is gone, as everywhere in the lib. */
function SelectionMark({ type, checked, disabled, size, label, onSelect }) {
  const isRadio = type === 'radio';
  const Base = isRadio ? 'MuiRadio' : 'MuiCheckbox';
  const cls = ['MuiButtonBase-root', Base + '-root', Base + '-colorPrimary',
    (!isRadio || size !== 'medium') && Base + '-size' + capS(size), 'PrivateSwitchBase-root',
    checked && 'Mui-checked', disabled && 'Mui-disabled', 'omni-li-ctl'].filter(Boolean).join(' ');
  return (
    <span className={cls} onClick={(e) => e.stopPropagation()}>
      <input tabIndex={-1} className="PrivateSwitchBase-input omni-li-ctl-in" type={type} checked={checked} disabled={disabled}
        onChange={() => onSelect?.()} aria-label={label} {...(isRadio ? {} : { 'data-indeterminate': 'false' })} />
      {isRadio ? (
        <span className="omni-li-ctl-dot">
          <MarkIcon name="RadioButtonUncheckedIcon" size={size} />
          <MarkIcon name="RadioButtonCheckedIcon" size={size} />
        </span>
      ) : <MarkIcon name={checked ? 'CheckBoxIcon' : 'CheckBoxOutlineBlankIcon'} size={size} />}
    </span>
  );
}

export function ListItemDecorator({ children, size = 'medium', isButton = false, onAction, ariaLabel, disabled = false }) {
  useStaticStyles('omni-list');
  // Both decorator paths now hug their content — no forced width/height. The
  // consumer passes a sized child (Icon size="small", Avatar size="medium",
  // Ratio ratio="1:1" with maxWidth, etc.) and the slot wraps it tightly.
  /* A decorator that is a control is the library's icon-only ghost Button —
     its own hover / pressed / focus / disabled, on the surface's tokens. It
     was a raw <button> here with hardcoded grey hover fills, no disabled
     state and a hand-drawn focus ring. Clicks and keys stop at the button so
     the row behind it does not also fire. */
  if (isButton) {
    return (
      <Button iconOnly variant="ghost" size={size} className="list-item-decorator-button"
        aria-label={ariaLabel || 'Action'} disabled={disabled}
        onClick={(e) => { e.stopPropagation(); onAction?.(e); }}
        onKeyDown={(e) => e.stopPropagation()}
        style={{ flexShrink: 0 }}>
        {children}
      </Button>
    );
  }
  return (
    <div className="list-item-decorator MuiBox-root omni-li-dec">
      {children}
    </div>
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

  useStaticStyles('omni-list');
  const k = sizeKey(size);
  const sep = !isClickable && (bottomBorder || rightBorder)
    ? (bottomBorder && rightBorder ? ' omni-li-bbrb' : bottomBorder ? ' omni-li-bb' : ' omni-li-rb') : '';
  const rootProps = {
    role: getRole(),
    tabIndex: isFocusable ? 0 : undefined,
    'aria-disabled': disabled || undefined,
    'aria-selected': isSelectable ? selected : (selected || undefined),
    'aria-checked': selectionMode === 'checkbox' ? selected : undefined,
    onClick: handleClick,
    onKeyDown: isFocusable ? handleKeyDown : undefined,
    className: 'list-item' + (selected ? ' list-item-selected' : '') + (disabled ? ' list-item-disabled' : '')
      + (isClickable ? ' list-item-clickable' : '') + (isSelectable ? ' list-item-selectable' : '')
      /* hstack, top-left aligned, fill width (padding inside the 100%), the
         Component-Size List-item gap / padding / radius. Card chrome — an
         inset 1px --Border ring at the row's corner — only when clickable;
         otherwise the optional inset hairline dividers. Selected is a 2px
         Border RING inside the row on ::before (Figma 7022:49393), so it
         reads without color and stays distinct from the 3px focus ring on
         ::after; Border from SURFACE, not Buttons — held by
         ListSelectedRing.test.js. Hover / pressed only when focusable, with
         the inset edge riding along so a hovered row keeps its border. */
      + ' MuiBox-root omni-li omni-li-' + k
      + (isFocusable ? (isClickable ? ' omni-li-fc' : ' omni-li-f') : '')
      + (disabled ? ' omni-li-off' : '') + (isClickable ? ' omni-li-click' : '') + sep + (selected ? ' omni-li-sel' : ''),
    ...props,
  };
  const markLabel = 'Select ' + (typeof children === 'string' ? children : 'item');
  const content = (
    <>
      {(selectionMode === 'checkbox' || selectionMode === 'radio') && (
        <SelectionMark type={selectionMode} checked={selected} disabled={disabled} size={s.checkSize}
          label={markLabel} onSelect={onSelect} />
      )}
      {image && (
        <div className="list-item-image MuiBox-root omni-li-img">
          {typeof image === 'string'
            ? <img src={image} alt={imageAlt} />
            : image === true ? <ImagePlaceholder sx={{ width: '100%', height: '100%' }} /> : image}
        </div>
      )}
      {startDecorator && (
        <ListItemDecorator size={size} isButton={startDecoratorIsButton}
          onAction={onStartDecoratorAction} ariaLabel={startDecoratorAriaLabel} disabled={disabled}>
          {startDecorator}
        </ListItemDecorator>
      )}
      {(() => {
        // Text frame — flex-fills the remaining horizontal space between
        // start decorator and end decorator (min-width 0, so long text wraps
        // rather than overflowing). Order is top→bottom: eyebrow (kicker) →
        // children (title) → secondary (body), stacked with NO gap —
        // line-height carries the rhythm, as the Figma text frame does.
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
          <div className="MuiBox-root omni-li-text">
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
          </div>
        );
      })()}
      {endDecorator && (
        <ListItemDecorator size={size} isButton={endDecoratorIsButton}
          onAction={onEndDecoratorAction} ariaLabel={endDecoratorAriaLabel} disabled={disabled}>
          {endDecorator}
        </ListItemDecorator>
      )}
    </>
  );
  if (hasSx(sx)) return <SxBox component={component} sx={sx} {...rootProps}>{content}</SxBox>;
  const Tag = component;
  return <Tag {...rootProps}>{content}</Tag>;
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
  useStaticStyles('omni-list');
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
        <li className="MuiBox-root omni-list-msg">
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
        </li>
      );
    }
    /* The message is a <li> because the parent is a <ul>: a bare <div> in a
       list is invalid and some screen readers drop it, so the one thing the
       user needs to hear would be the thing not announced. */
    if (dataState === 'error') return <li className="MuiBox-root omni-list-msg">{error}</li>;
    if (dataState === 'empty') return <li className="MuiBox-root omni-list-msg">{empty}</li>;

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
            <li key={'div-' + index} role="separator" aria-hidden="true"
              className={'MuiBox-root ' + (isHorizontal ? 'omni-list-sep-h' : 'omni-list-sep')} />
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
            <li key={'div-' + index} role="separator" aria-hidden="true"
              className={'MuiBox-root ' + (isHorizontal ? 'omni-list-sep-h' : 'omni-list-sep')} />
          );
        }
      });
      return elements;
    }
    return null;
  };

  const rootProps = {
    role: isSelectable ? 'listbox' : 'list',
    'aria-busy': dataState === 'loading' ? 'true' : undefined,
    'aria-multiselectable': selectionMode === 'checkbox' ? true : undefined,
    ...wrapperDataAttrs,
    /* A flex column (a row when horizontal), items stretched: full width in a
       column, matched heights in a row, where each item flexes equally. A
       clickable List parts its card-chromed items by Sizing-1; otherwise rows
       sit flush. The container draws no border and clips nothing, so item
       shadows and focus rings are not cut off; solid / light paint the zone's
       Background. */
    className: 'list-container list-' + variant + ' list-' + color + ' ' + className
      + ' MuiBox-root omni-list' + (isHorizontal ? ' omni-list-h' : '') + (clickable ? ' omni-list-click' : '')
      + (isDefault ? '' : ' omni-list-painted'),
    ...props,
  };
  if (hasSx(sx)) return <SxBox component={component} sx={sx} {...rootProps}>{renderItems()}</SxBox>;
  const Tag = component;
  return <Tag {...rootProps}>{renderItems()}</Tag>;
}

export const DefaultList = (p) => <List variant="default" {...p} />;
export const SolidList   = (p) => <List variant="solid"   {...p} />;
export const LightList   = (p) => <List variant="light"   {...p} />;
export default List;