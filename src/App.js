import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynoDesignProvider } from './DynoDesignProvider';
import ComponentShowcase from './pages/ComponentShowcase';

// Firebase Storage bucket where design systems are uploaded by the studio.
// Public URL pattern: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encoded-path}?alt=media
const FIREBASE_STORAGE_BUCKET = 'dino-design.firebasestorage.app';
const STORAGE_ROOT = 'design-systems';

/**
 * Build the public Firebase Storage URL for a file inside a user's design system.
 */
function firebaseFileUrl(userId, filename) {
  const path = encodeURIComponent(`${STORAGE_ROOT}/${userId}/${filename}`);
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${path}?alt=media`;
}

// Detect platform from user agent — swap this out for whatever
// platform-detection strategy your app uses.
function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua))                          return 'Android';
  if (/iPad/i.test(ua))                             return 'IOS-Tablet';
  if (/iPhone|iPod/i.test(ua))                      return 'IOS-Mobile';
  return 'Desktop';
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user');

  // Allow ?platform= override for testing (e.g. ?platform=IOS-Mobile)
  const platform = params.get('platform') || detectPlatform();

  // Point Provider directly at the Firebase-hosted theme.json manifest.
  // The Provider detects the .json extension and uses it as the manifest URL,
  // while the manifest itself contains absolute URLs to each CSS file.
  const themeURL = userId ? firebaseFileUrl(userId, 'theme.json') : undefined;

  return (
    <DynoDesignProvider
      themeURL={themeURL}
      defaultTheme="Default"
      defaultSurface="Surface"
      defaultStyle="Modern"
    >
      <div
        data-platform={platform}
        data-theme="Default"
        data-surface="Surface"
        style={{
          background: 'var(--Background)',
          color: 'var(--Text)',
          minHeight: '100vh',
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<ComponentShowcase />} />
          </Routes>
        </Router>
      </div>
    </DynoDesignProvider>
  );
}

export default App;