// src/components/shared/CodeWithCopy.js
import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

/**
 * CodeWithCopy Component
 * Displays just a copy icon button for code snippets
 * 
 * @param {string} code - Code snippet to copy
 * @param {object} sx - Optional MUI sx prop for styling
 */
export function CodeWithCopy({ code, sx = {} }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy code"}>
      <IconButton 
        size="small" 
        onClick={handleCopy}
        sx={{ 
          color: copied ? 'var(--Icons-Success)' : 'var(--Icon)',
          float: 'right',
          mt: -4,
          '&:hover': {
            backgroundColor: 'var(--Container)',
          },
          ...sx,
        }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

export default CodeWithCopy;