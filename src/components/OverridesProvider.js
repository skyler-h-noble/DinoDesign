// src/components/OverridesProvider.js
// Tracks CSS custom property overrides for the active design system.
// Syncs to Firestore so dinodesign-studio can read them for Figma export.

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const OverridesContext = createContext(null);

export function OverridesProvider({ dsId, children }) {
  const [overrides, setOverrides] = useState({});
  const [synced, setSynced] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);

  // Load overrides when dsId changes
  useEffect(() => {
    // Clear DOM overrides from previous DS
    Object.keys(overrides).forEach((token) => {
      document.documentElement.style.removeProperty(token);
    });
    setOverrides({});
    setSynced(true);
    setLastSynced(null);

    if (!dsId) return;

    getDoc(doc(db, 'designSystems', dsId))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const vars = data.overrides || {};
          setOverrides(vars);
          Object.entries(vars).forEach(([token, value]) => {
            document.documentElement.style.setProperty(token, value);
          });
          setSynced(data.overridesSynced !== false);
          setLastSynced(data.updatedAt?.toDate?.() || null);
        }
      })
      .catch((err) => console.error('Failed to load overrides:', err));
  }, [dsId]);

  const setOverride = useCallback((token, value) => {
    document.documentElement.style.setProperty(token, value);
    setOverrides((prev) => ({ ...prev, [token]: value }));
    setSynced(false);
  }, []);

  const removeOverride = useCallback((token) => {
    document.documentElement.style.removeProperty(token);
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[token];
      return next;
    });
    setSynced(false);
  }, []);

  const clearOverrides = useCallback(() => {
    Object.keys(overrides).forEach((token) => {
      document.documentElement.style.removeProperty(token);
    });
    setOverrides({});
    setSynced(false);
  }, [overrides]);

  const syncToFirestore = useCallback(async () => {
    if (!dsId) {
      console.warn('No design system selected — cannot sync.');
      return false;
    }
    try {
      await setDoc(
        doc(db, 'designSystems', dsId),
        {
          overrides,
          overridesSynced: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSynced(true);
      setLastSynced(new Date());
      return true;
    } catch (err) {
      console.error('Failed to sync overrides:', err);
      return false;
    }
  }, [dsId, overrides]);

  const hasOverrides = Object.keys(overrides).length > 0;
  const overrideCount = Object.keys(overrides).length;

  return (
    <OverridesContext.Provider value={{
      overrides,
      hasOverrides,
      overrideCount,
      synced,
      lastSynced,
      dsId,
      setOverride,
      removeOverride,
      clearOverrides,
      syncToFirestore,
    }}>
      {children}
    </OverridesContext.Provider>
  );
}

export function useOverrides() {
  const ctx = useContext(OverridesContext);
  if (!ctx) throw new Error('useOverrides must be used inside <OverridesProvider>');
  return ctx;
}
