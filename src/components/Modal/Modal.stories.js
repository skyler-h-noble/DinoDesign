// src/components/Modal/Modal.stories.js
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Box } from '@mui/material';

export default { title: 'Feedback/Modal', component: Modal };

const ModalStory = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ p: 4 }}>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Example Modal" {...props}>
        This is the modal body content with sample text.
      </Modal>
    </Box>
  );
};

export const Default = { render: () => <ModalStory /> };
export const Soft = { render: () => <ModalStory variant="soft" color="primary" /> };
export const SolidPrimary = { render: () => <ModalStory variant="solid" color="primary" /> };
export const SolidError = { render: () => <ModalStory variant="solid" color="error" /> };
export const Small = { render: () => <ModalStory size="small" /> };
export const Large = { render: () => <ModalStory size="large" /> };
export const FullScreen = { render: () => <ModalStory layout="fullscreen" /> };
export const SlideUp = { render: () => <ModalStory transition="slide-up" /> };
export const Zoom = { render: () => <ModalStory transition="zoom" transitionSpeed={400} /> };
export const NoCloseButton = { render: () => <ModalStory showCloseButton={false} /> };

export const AllSoftColors = {
  render: () => {
    const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    const [open, setOpen] = useState(null);
    return (
      <Box sx={{ p: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {colors.map((c) => (
          <Box key={c}>
            <button onClick={() => setOpen(c)}>{c}</button>
            <Modal open={open === c} onClose={() => setOpen(null)} variant="soft" color={c} title={c}>
              Soft {c} modal content.
            </Modal>
          </Box>
        ))}
      </Box>
    );
  },
};
