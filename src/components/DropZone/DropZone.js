// src/components/DropZone/DropZone.js
import React, { useState, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { BodySmall, Caption } from '../Typography';

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
 *   Active:   bg var(--Active)
 *   Focus:    3px solid var(--Focus-Visible), offset 3px
 *   Disabled: opacity 0.5, not interactive
 *
 * ACCEPTS: optional file type filter (e.g. 'image/*', '.pdf,.doc')
 * MULTIPLE: allow multiple file selection
 */

const SIZE_MAP = {
  small:  { minHeight: '120px', padding: '16px', iconSize: '20px', gap: 1 },
  medium: { minHeight: '200px', padding: '32px 24px', iconSize: '32px', gap: 2 },
  large:  { minHeight: '300px', padding: '48px 24px', iconSize: '48px', gap: 3 },
};

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

  return (
    <Box
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label || defaultLabel}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={'drop-zone drop-zone-' + size + (isDragging ? ' drop-zone-dragging' : '') + (disabled ? ' drop-zone-disabled' : '') + ' ' + className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        minHeight: s.minHeight,
        padding: s.padding,
        border: '2px dashed',
        borderColor: isDragging ? 'var(--Buttons-Primary-Border)' : 'var(--Buttons-Default-Border)',
        borderRadius: '32px',
        backgroundColor: isDragging ? 'var(--Hover)' : 'transparent',
        color: 'var(--Text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        textAlign: 'center',
        ...(!disabled && {
          '&:hover': {
            backgroundColor: 'var(--Hover)',
            borderColor: 'var(--Buttons-Primary-Border)',
          },
          '&:active': {
            backgroundColor: 'var(--Active)',
            borderColor: 'var(--Buttons-Primary-Border)',
          },
          '&:focus-visible': {
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '2px',
            borderColor: 'var(--Buttons-Primary-Border)',
          },
        }),
        ...sx,
      }}
      {...props}
    >
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
    </Box>
  );
}

export default DropZone;
