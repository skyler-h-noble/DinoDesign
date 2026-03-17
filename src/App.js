import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynoDesignProvider } from './DynoDesignProvider';
import ComponentShowcase from './pages/ComponentShowcase';

const SUPABASE_STORAGE_BASE = 'https://aqpmdqlhffjakkznxudv.supabase.co/storage/v1/object/public/design-system';

function App() {
  // Check for ?user={uuid} to load a custom design system
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user');

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
      <Router>
        <Routes>
          <Route path="/" element={<ComponentShowcase />} />
        </Routes>
      </Router>
    </DynoDesignProvider>
  );
}

export default App;
