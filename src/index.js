// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// CSS loaded via URL from public/styles/
// The DynoDesignProvider injects them in this order:
//   1. foundation.css
//   2. core.css
//   3. Light-Mode.css  OR  Dark-Mode.css  (one at a time, swaps on toggle)
//   4. base.css
//   5. styles.css      ← always last

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App
      foundationCSS="/styles/foundation.css"
      coreCSS="/styles/core.css"
      lightModeCSS="/styles/Light-Mode.css"
      darkModeCSS="/styles/Dark-Mode.css"
      baseCSS="/styles/base.css"
      stylesCSS="/styles/styles.css"
    />
  </React.StrictMode>
);