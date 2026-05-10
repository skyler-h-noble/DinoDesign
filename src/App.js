import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import ComponentShowcase from './pages/ComponentShowcase';

// Detect platform from user agent
function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua))                          return 'Android';
  if (/iPad/i.test(ua))                             return 'IOS-Tablet';
  if (/iPhone|iPod/i.test(ua))                      return 'IOS-Mobile';
  return 'Desktop';
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const platform = params.get('platform') || detectPlatform();

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
