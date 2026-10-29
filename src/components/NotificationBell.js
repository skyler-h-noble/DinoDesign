// src/components/NotificationBell.js
// Bell icon with badge counter + popover listing design system change notifications.

import React, { useState, useRef } from 'react';
import NotificationsIcon from '@omni-design/icons/Notifications';
import { useNotifications } from './NotificationProvider';
import { Popover } from './Popover/Popover';
import { Button } from './Button/Button';
import { BodySmall, Caption } from './Typography';
import { registerStaticStyles, useStaticStyles } from './_staticStyles';

/* Static sheet. Hover and focus-visible weigh one class + one pseudo-class,
   as emotion's did. */
registerStaticStyles('omni-notification-bell', [
  '.omni-nb{position:relative;display:inline-flex}',
  '.omni-nb-trigger{display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;width:36px;height:36px;border-radius:50%;'
    + 'background-color:transparent;border:none;color:inherit;cursor:pointer;position:relative}',
  '.omni-nb-trigger:hover{background-color:var(--Hover)}',
  '.omni-nb-trigger:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:2px}',
  '.omni-nb-count{position:absolute;top:2px;right:2px;min-width:16px;height:16px;border-radius:8px;'
    + 'background-color:var(--Buttons-Error-Button);color:var(--Buttons-Error-Text);font-size:10px;font-weight:700;'
    + 'font-family:inherit;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;padding-left:4px;padding-right:4px;line-height:1}',
  '.omni-nb-head{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--Border)}',
  '.omni-nb-empty{padding:24px 16px;text-align:center}',
  '.omni-nb-item{padding:12px 16px;border-bottom:1px solid var(--Border);background-color:transparent}',
  '.omni-nb-item-unread{background-color:var(--Hover)}',
  '.omni-nb-item-top{display:flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:center;align-items:center;margin-bottom:4px}',
].join('\n'));

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
  useStaticStyles('omni-notification-bell');

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) markAllRead();
  };

  return (
    <div className="MuiBox-root omni-nb">
      {/* Bell trigger */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        aria-label={'Notifications' + (unreadCount > 0 ? ', ' + unreadCount + ' unread' : '')}
        className="MuiBox-root omni-nb-trigger"
      >
        <NotificationsIcon style={{ fontSize: 22, color: 'inherit' }} />
        {unreadCount > 0 && (
          <div className="MuiBox-root omni-nb-count">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification popover */}
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef}
        placement="bottom-end" width={320} maxHeight={400}>

        {/* Header */}
        <div className="MuiBox-root omni-nb-head">
          <BodySmall style={{ fontWeight: 600 }}>Notifications</BodySmall>
          {notifications.length > 0 && (
            <Button variant="ghost" size="small" onClick={() => { clearAll(); setOpen(false); }}>
              Clear all
            </Button>
          )}
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="MuiBox-root omni-nb-empty">
            <Caption style={{ color: 'var(--Text-Quiet)' }}>No notifications</Caption>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={'MuiBox-root omni-nb-item' + (n.read ? '' : ' omni-nb-item-unread')}>
              <div className="MuiBox-root omni-nb-item-top">
                <Caption style={{ fontWeight: 600, color: 'var(--Text)' }}>{n.title}</Caption>
                <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, marginLeft: 8, fontSize: '10px' }}>
                  {timeAgo(n.timestamp)}
                </Caption>
              </div>
              {n.variables && n.variables.length > 0 && (
                <Caption style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>
                  {n.variables.map((v) => v + ': ' + (n.message.split('changed to ')[1] || '')).join(', ')}
                </Caption>
              )}
              <Caption style={{ color: 'var(--Hotlink)', display: 'block', fontSize: '11px' }}>
                Re-import into Figma to sync changes
              </Caption>
            </div>
          ))
        )}
      </Popover>
    </div>
  );
}

export default NotificationBell;
