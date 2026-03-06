// src/components/Dialog/Dialog.stories.js
import React, { useState } from 'react';
import { Dialog, AlertDialog, FormDialog, dialogButtonStyles } from './Dialog';
import { Box } from '@mui/material';

export default { title: 'Feedback/Dialog', component: Dialog };

const OpenButton = ({ onClick, label }) => (
  <Box component="button" type="button" onClick={onClick}
    sx={{ ...dialogButtonStyles.primary, padding: '8px 20px' }}>
    {label || 'Open Dialog'}
  </Box>
);

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <OpenButton onClick={() => setOpen(true)} />
        <Dialog open={open} onClose={() => setOpen(false)} title="Default Dialog"
          actions={
            <>
              <Box component="button" sx={dialogButtonStyles.outline} onClick={() => setOpen(false)}>Cancel</Box>
              <Box component="button" sx={dialogButtonStyles.primary} onClick={() => setOpen(false)}>Confirm</Box>
            </>
          }>
          This is a standard dialog with default settings (sm size, no transition).
        </Dialog>
      </Box>
    );
  },
};

export const Sizes = {
  render: () => {
    const [openSize, setOpenSize] = useState(null);
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    return (
      <Box sx={{ p: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {sizes.map((s) => (
          <OpenButton key={s} label={s.toUpperCase()} onClick={() => setOpenSize(s)} />
        ))}
        {sizes.map((s) => (
          <Dialog key={s} open={openSize === s} onClose={() => setOpenSize(null)} title={s.toUpperCase() + ' Dialog'} maxWidth={s}
            actions={<Box component="button" sx={dialogButtonStyles.primary} onClick={() => setOpenSize(null)}>Close</Box>}>
            This dialog uses maxWidth="{s}".
          </Dialog>
        ))}
      </Box>
    );
  },
};

export const FullScreen = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <OpenButton label="Full Screen" onClick={() => setOpen(true)} />
        <Dialog open={open} onClose={() => setOpen(false)} title="Full Screen Dialog" fullScreen
          actions={<Box component="button" sx={dialogButtonStyles.primary} onClick={() => setOpen(false)}>Close</Box>}>
          This dialog covers the entire viewport.
        </Dialog>
      </Box>
    );
  },
};

export const Alert = {
  name: 'Alert Dialog',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <OpenButton label="Delete Item" onClick={() => setOpen(true)} />
        <AlertDialog open={open} onClose={() => setOpen(false)} title="Delete this item?"
          confirmText="Delete" cancelText="Keep" onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)}>
          This action cannot be undone. The item and all associated data will be permanently removed.
        </AlertDialog>
      </Box>
    );
  },
};

export const Scrollable = {
  render: () => {
    const [open, setOpen] = useState(false);
    const longText = Array(8).fill('Curabitur aliquet quam id dui posuere blandit. Nulla quis lorem ut libero malesuada feugiat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.').join('\n\n');
    return (
      <Box sx={{ p: 4 }}>
        <OpenButton label="Scrollable" onClick={() => setOpen(true)} />
        <Dialog open={open} onClose={() => setOpen(false)} title="Terms & Conditions" scroll="paper"
          actions={
            <>
              <Box component="button" sx={dialogButtonStyles.outline} onClick={() => setOpen(false)}>Decline</Box>
              <Box component="button" sx={dialogButtonStyles.primary} onClick={() => setOpen(false)}>Accept</Box>
            </>
          }>
          {longText.split('\n\n').map((p, i) => <Box key={i} sx={{ mb: 2 }}>{p}</Box>)}
        </Dialog>
      </Box>
    );
  },
};

export const WithTransition = {
  name: 'Slide Up Transition',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <OpenButton label="Slide Up" onClick={() => setOpen(true)} />
        <Dialog open={open} onClose={() => setOpen(false)} title="Slide Transition" transition="slide-up" transitionDuration={400}
          actions={<Box component="button" sx={dialogButtonStyles.primary} onClick={() => setOpen(false)}>Done</Box>}>
          This dialog slides up from the bottom.
        </Dialog>
      </Box>
    );
  },
};

export const FormExample = {
  name: 'Form Dialog',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <OpenButton label="Edit Profile" onClick={() => setOpen(true)} />
        <FormDialog open={open} onClose={() => setOpen(false)} title="Edit Profile" submitText="Save" cancelText="Cancel" onSubmit={() => setOpen(false)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
            <Box component="input" placeholder="Name" sx={{ padding: '8px', border: '1px solid var(--Border)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '14px', backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none' }} />
            <Box component="input" placeholder="Email" sx={{ padding: '8px', border: '1px solid var(--Border)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '14px', backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none' }} />
          </Box>
        </FormDialog>
      </Box>
    );
  },
};
