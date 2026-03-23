import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynoDesignProvider } from './DynoDesignProvider';
import ComponentShowcase from './pages/ComponentShowcase';


const SUPABASE_STORAGE_BASE = 'https://aqpmdqlhffjakkznxudv.supabase.co/storage/v1/object/public/design-system';

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

  const themeURL = userId
    ? `${SUPABASE_STORAGE_BASE}/${userId}`
    : undefined;

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