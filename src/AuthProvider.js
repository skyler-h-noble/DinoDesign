// src/AuthProvider.js
// Firebase Auth context for DinoDesign.
// Supports Google and Email/Password sign-in.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try { return await signInWithPopup(auth, googleProvider); }
    catch (err) { setError(err); throw err; }
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    setError(null);
    try { return await signInWithEmailAndPassword(auth, email, password); }
    catch (err) { setError(err); throw err; }
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
    setError(null);
    try { return await createUserWithEmailAndPassword(auth, email, password); }
    catch (err) { setError(err); throw err; }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try { await fbSignOut(auth); }
    catch (err) { setError(err); throw err; }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      uid: user?.uid ?? null,
      loading,
      error,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
