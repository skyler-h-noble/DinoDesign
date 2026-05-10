// src/components/NotificationBell.js
// Bell icon with badge counter + popover listing design system change notifications.

import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications } from './NotificationProvider';
import { Popover } from './Popover/Popover';
import { Button } from './Button/Button';
import { BodySmall, Caption } from './Typography';

function timeAgo(date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) markAllRead();
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* Bell trigger */}
      <Box
        ref={triggerRef}
        component="button"
        onClick={handleOpen}
        aria-label={'Notifications' + (unreadCount > 0 ? ', ' + unreadCount + ' unread' : '')}
        sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: '50%',
          backgroundColor: 'transparent', border: 'none',
          color: 'inherit', cursor: 'pointer', position: 'relative',
          '&:hover': { backgroundColor: 'var(--Hover)' },
          '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }}
      >
        <NotificationsIcon sx={{ fontSize: 22, color: 'inherit' }} />
        {unreadCount > 0 && (
          <Box sx={{
            position: 'absolute', top: 2, right: 2,
            minWidth: 16, height: 16, borderRadius: '8px',
            backgroundColor: 'var(--Buttons-Error-Button)',
            color: 'var(--Buttons-Error-Text)',
            fontSize: '10px', fontWeight: 700, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            px: 0.5, lineHeight: 1,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Box>
        )}
      </Box>

      {/* Notification popover */}
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef}
        placement="bottom-end" width={320} maxHeight={400}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid var(--Border)' }}>
          <BodySmall style={{ fontWeight: 600 }}>Notifications</BodySmall>
          {notifications.length > 0 && (
            <Button variant="ghost" size="small" onClick={() => { clearAll(); setOpen(false); }}>
              Clear all
            </Button>
          )}
        </Box>

        {/* List */}
        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Caption style={{ color: 'var(--Text-Quiet)' }}>No notifications</Caption>
          </Box>
        ) : (
          notifications.map((n) => (
            <Box key={n.id} sx={{
              px: 2, py: 1.5, borderBottom: '1px solid var(--Border)',
              backgroundColor: n.read ? 'transparent' : 'var(--Hover)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Caption style={{ fontWeight: 600, color: 'var(--Text)' }}>{n.title}</Caption>
                <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, marginLeft: 8, fontSize: '10px' }}>
                  {timeAgo(n.timestamp)}
                </Caption>
              </Box>
              {n.variables && n.variables.length > 0 && (
                <Caption style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>
                  {n.variables.map((v) => v + ': ' + (n.message.split('changed to ')[1] || '')).join(', ')}
                </Caption>
              )}
              <Caption style={{ color: 'var(--Hotlink)', display: 'block', fontSize: '11px' }}>
                Re-import into Figma to sync changes
              </Caption>
            </Box>
          ))
        )}
      </Popover>
    </Box>
  );
}

export default NotificationBell;
