// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynoDesignProvider } from './DynoDesignProvider';
import ComponentShowcase from './pages/ComponentShowcase';

function App({ foundationCSS, coreCSS, lightModeCSS, darkModeCSS, baseCSS, stylesCSS }) {
  return (
    <DynoDesignProvider
      foundationCSS={foundationCSS}
      coreCSS={coreCSS}
      lightModeCSS={lightModeCSS}
      darkModeCSS={darkModeCSS}
      baseCSS={baseCSS}
      stylesCSS={stylesCSS}
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