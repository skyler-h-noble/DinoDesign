// src/components/Drawer/Drawer.stories.js
import React from 'react';
import { Drawer, DrawerClose, DrawerHeader, DrawerContent } from './Drawer';
import { Box, Stack } from '@mui/material';

export default { title: 'Navigation/Drawer', component: Drawer };

const DrawerDemo = (drawerProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{ p: 4 }}>
      <Box
        component="button"
        onClick={() => setOpen(true)}
        sx={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer',
          border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
          backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}
      >
        Open Drawer
      </Box>
      <Drawer open={open} onClose={() => setOpen(false)} {...drawerProps}>
        <DrawerClose onClick={() => setOpen(false)} />
        <DrawerHeader>
          <Box sx={{ fontSize: '18px', fontWeight: 700 }}>Title</Box>
        </DrawerHeader>
        <DrawerContent>
          <Stack spacing={1}>
            {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item) => (
              <Box key={item} sx={{ py: 1, fontSize: '14px' }}>{item}</Box>
            ))}
          </Stack>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export const Default = { render: () => <DrawerDemo /> };

export const Variants = {
  name: 'All Variants',
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      {['standard', 'solid', 'light'].map((v) => {
        const Demo = () => {
          const [open, setOpen] = React.useState(false);
          return (
            <Box>
              <Box component="button" onClick={() => setOpen(true)}
                sx={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {v}
              </Box>
              <Drawer open={open} onClose={() => setOpen(false)} variant={v} color="primary">
                <DrawerClose onClick={() => setOpen(false)} />
                <DrawerHeader><Box sx={{ fontWeight: 700 }}>{v}</Box></DrawerHeader>
                <DrawerContent><Box>Content</Box></DrawerContent>
              </Drawer>
            </Box>
          );
        };
        return <Demo key={v} />;
      })}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => {
    const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
    return (
      <Stack direction="row" flexWrap="wrap" sx={{ p: 4, gap: 2 }}>
        {colors.map((c) => {
          const Demo = () => {
            const [open, setOpen] = React.useState(false);
            return (
              <Box>
                <Box component="button" onClick={() => setOpen(true)}
                  sx={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer',
                    border: '1px solid var(--Border)', borderRadius: '4px',
                    backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                  {c}
                </Box>
                <Drawer open={open} onClose={() => setOpen(false)} variant="solid" color={c}>
                  <DrawerClose onClick={() => setOpen(false)} />
                  <DrawerHeader><Box sx={{ fontWeight: 700 }}>{c}</Box></DrawerHeader>
                  <DrawerContent><Box>Content</Box></DrawerContent>
                </Drawer>
              </Box>
            );
          };
          return <Demo key={c} />;
        })}
      </Stack>
    );
  },
};

export const Anchors = {
  name: 'All Anchors',
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      {['left', 'right', 'top', 'bottom'].map((a) => {
        const Demo = () => {
          const [open, setOpen] = React.useState(false);
          return (
            <Box>
              <Box component="button" onClick={() => setOpen(true)}
                sx={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {a}
              </Box>
              <Drawer open={open} onClose={() => setOpen(false)} anchor={a}>
                <DrawerClose onClick={() => setOpen(false)} />
                <DrawerHeader><Box sx={{ fontWeight: 700 }}>{a}</Box></DrawerHeader>
                <DrawerContent><Box>Anchor: {a}</Box></DrawerContent>
              </Drawer>
            </Box>
          );
        };
        return <Demo key={a} />;
      })}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ p: 4 }}>
      {['small', 'medium', 'large'].map((s) => {
        const Demo = () => {
          const [open, setOpen] = React.useState(false);
          return (
            <Box>
              <Box component="button" onClick={() => setOpen(true)}
                sx={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {s}
              </Box>
              <Drawer open={open} onClose={() => setOpen(false)} size={s}>
                <DrawerClose onClick={() => setOpen(false)} />
                <DrawerHeader><Box sx={{ fontWeight: 700 }}>{s}</Box></DrawerHeader>
                <DrawerContent><Box>Size: {s}</Box></DrawerContent>
              </Drawer>
            </Box>
          );
        };
        return <Demo key={s} />;
      })}
    </Stack>
  ),
};

export const NoBackdrop = {
  render: () => <DrawerDemo hideBackdrop />,
};
