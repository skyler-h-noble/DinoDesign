// src/components/DropZone/DropZone.js
import React, { useState, useRef, useCallback } from 'react';
import CloudUploadIcon from '@omni-design/icons/CloudUpload';
import { BodySmall, Caption } from '../Typography';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * DropZone Component
 *
 * A drag-and-drop file upload area with design system integration.
 *
 * SIZES:
 *   small   — compact, 120px min-height, 16px icon
 *   medium  — default, 200px min-height, 32px icon
 *   large   — spacious, 300px min-height, 48px icon
 *
 * BORDER:
 *   Default:  2px dashed var(--Buttons-Default-Border), border-radius 32px
 *   Hover:    border-color var(--Buttons-Primary-Border), bg var(--Hover)
 *   Dragging: border-color var(--Buttons-Primary-Border), bg var(--Hover)
 *   Active:   bg var(--Pressed)
 *   Focus:    3px solid var(--Focus-Visible), offset 3px
 *   Disabled: opacity 0.5, not interactive
 *
 * ACCEPTS: optional file type filter (e.g. 'image/*', '.pdf,.doc')
 * MULTIPLE: allow multiple file selection
 */

const SIZE_MAP = {
  small:  { minHeight: '120px', padding: '16px', iconSize: '20px', gap: '8px' },
  medium: { minHeight: '200px', padding: '32px 24px', iconSize: '32px', gap: '16px' },
  large:  { minHeight: '300px', padding: '48px 24px', iconSize: '48px', gap: '24px' },
};

/* Static sheet — what the root's MUI Box sx carried, as plain rules.
   The state rules weigh one class + one pseudo-class, as emotion's did, and
   are left off a disabled zone (.omni-dz-off) the way the sx left them out.
   A caller's sx key for one of those states REPLACED the component's whole
   state object when both were one sx; .omni-dz-no-<state> drops ours so the
   caller's alone applies again. :where() keeps those guards weightless. */
const SxBox = lazySxBox('DropZone');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const STATE_KEYS = { '&:hover': 'hover', '&:active': 'active', '&:focus-visible': 'focus' };
const live = (state) => `.omni-dz:where(:not(.omni-dz-off):not(.omni-dz-no-${state}))`;

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
/* A caller's sx key that replaced one of ours kept OUR key's place in the
   merged object, so our later keys still came after it and won ties. Each
   later rule is repeated one class heavier for an instance where an earlier
   key was replaced, which puts it back over the caller's (emotion's, inserted
   after this sheet). */
const after = (rule, root, prefix, earlier) => {
  const i = rule.indexOf('{');
  const sels = rule.slice(0, i).split(',');
  const extra = [];
  for (const k of earlier) for (const sel of sels) if (sel.startsWith(root)) extra.push(root + '.' + prefix + k + sel.slice(root.length));
  return [...sels, ...extra].join(',') + rule.slice(i);
};
registerStaticStyles('omni-dropzone', wk([
  '.omni-dz{display:flex;flex-direction:column;align-items:center;justify-content:center;'
    + 'border:2px dashed;border-color:var(--Buttons-Default-Border);border-radius:32px;background-color:transparent;'
    + 'color:var(--Text);cursor:pointer;opacity:1;outline:none;transition:background-color 0.2s ease, border-color 0.2s ease;text-align:center}',
  ...Object.entries(SIZE_MAP).map(([size, s]) => `.omni-dz-${size}{gap:${s.gap};min-height:${s.minHeight};padding:${s.padding}}`),
  '.omni-dz-drag{border-color:var(--Buttons-Primary-Border);background-color:var(--Hover)}',
  '.omni-dz-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  `${live('hover')}:hover{background-color:var(--Hover);border-color:var(--Buttons-Primary-Border)}`,
  after(`${live('active')}:active{background-color:var(--Pressed);border-color:var(--Buttons-Primary-Border)}`, '.omni-dz', 'omni-dz-no-', ['hover']),
  after(`${live('focus')}:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:2px;border-color:var(--Buttons-Primary-Border)}`, '.omni-dz', 'omni-dz-no-', ['hover', 'active']),
].join('\n')));

export function DropZone({
  onFiles,
  accept,
  multiple = false,
  size = 'medium',
  disabled = false,
  icon,
  label,
  sublabel,
  children,
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-dropzone');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const handleFiles = useCallback((files) => {
    if (disabled || !files?.length) return;
    onFiles?.(Array.from(files));
  }, [disabled, onFiles]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  }, [disabled, handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const handleKeyDown = useCallback((e) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback((e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles]);

  const IconComponent = icon || CloudUploadIcon;
  const defaultLabel = multiple ? 'Drag and drop files here' : 'Drag and drop file here';
  const defaultSublabel = 'or click to browse';

  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const sxOn = hasSx(sx);
  const replaced = sxOn && typeof sx === 'object' && !Array.isArray(sx)
    ? Object.keys(STATE_KEYS).filter((k) => k in sx).map((k) => ' omni-dz-no-' + STATE_KEYS[k]).join('')
    : '';
  const rootProps = {
    role: 'button',
    tabIndex: disabled ? -1 : 0,
    'aria-label': label || defaultLabel,
    'aria-disabled': disabled || undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    className: 'MuiBox-root drop-zone drop-zone-' + size + (isDragging ? ' drop-zone-dragging' : '') + (disabled ? ' drop-zone-disabled' : '') + ' ' + className
      + ' omni-dz omni-dz-' + sizeKey + (isDragging ? ' omni-dz-drag' : '') + (disabled ? ' omni-dz-off' : '') + replaced,
    ...props,
  };
  const Root = sxOn ? SxBox : 'div';
  const extra = sxOn ? { sx } : {};

  return (
    <Root {...extra} {...rootProps}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
      />

      {children || (
        <>
          <IconComponent sx={{ fontSize: s.iconSize, color: 'var(--Text-Quiet)' }} />
          <BodySmall style={{ color: 'var(--Text)' }}>
            {label || defaultLabel}
          </BodySmall>
          <Caption style={{ color: 'var(--Text-Quiet)' }}>
            {sublabel || defaultSublabel}
          </Caption>
        </>
      )}
    </Root>
  );
}

export default DropZone;
