// src/components/NotificationProvider.js
// Global notification context for design system change tracking.
// When a user modifies a component variable in the Settings tab,
// a notification is created prompting them to re-sync with Figma.

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

let nextId = 1;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = nextId++;
    const entry = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification,
    };
    setNotifications((prev) => [entry, ...prev]);
    return id;
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}
