// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeCSSLoader, loadModeCSS } from './utils/cssLoader';
import { useThemeMode } from './theme/useThemeMode';
import ComponentShowcase from './pages/ComponentShowcase';

function App() {
  const { mode } = useThemeMode('light');

  // Initialize CSS loader on app startup
  useEffect(() => {
    initializeCSSLoader();
  }, []);

  // Set body-level theme attributes
  useEffect(() => {
    document.body.setAttribute('data-theme', 'Default');
    document.body.setAttribute('data-surface', 'Surface');
  }, []);

  // Load appropriate CSS when mode changes
  useEffect(() => {
    const lightModeType = localStorage.getItem('--Light-Mode') || 'Light-Mode-Tonal';
    loadModeCSS(lightModeType);
  }, [mode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComponentShowcase />} />
      </Routes>
    </Router>
  );
}

export default App;