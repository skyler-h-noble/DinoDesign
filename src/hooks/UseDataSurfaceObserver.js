// src/hooks/useDataSurfaceObserver.js
import { useEffect } from 'react';

const defaultMappings = {
  'MuiCard-root': 'Container',
  'MuiButton-root': 'Container',
  'MuiDrawer-root': 'Surface-Dim',
  'MuiTextField-root': 'Surface-Dim',
  'MuiOutlinedInput-root': 'Surface-Dim',
  'MuiInputBase-root': 'Surface-Dim',
  'MuiDialog-root': 'Container',
  'MuiModal-root': 'Container',
  'MuiListItemButton-root': 'Container-Low',
};

export function useDataSurfaceObserver(customMappings = {}) {
  const mappings = { ...defaultMappings, ...customMappings };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      Object.entries(mappings).forEach(([selector, surface]) => {
        const elements = document.querySelectorAll(`.${selector}`);
        elements.forEach((element) => {
          if (!element.hasAttribute('data-surface')) {
            element.setAttribute('data-surface', surface);
          }
        });
      });

      // Special case: Drawer papers should use Surface-Dim
      const drawerPapers = document.querySelectorAll('.MuiDrawer-paper');
      drawerPapers.forEach((element) => {
        if (!element.hasAttribute('data-surface')) {
          element.setAttribute('data-surface', 'Surface-Dim');
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial scan
    Object.entries(mappings).forEach(([selector, surface]) => {
      const elements = document.querySelectorAll(`.${selector}`);
      elements.forEach((element) => {
        if (!element.hasAttribute('data-surface')) {
          element.setAttribute('data-surface', surface);
        }
      });
    });

    // Special case: Drawer papers
    const drawerPapers = document.querySelectorAll('.MuiDrawer-paper');
    drawerPapers.forEach((element) => {
      if (!element.hasAttribute('data-surface')) {
        element.setAttribute('data-surface', 'Surface-Dim');
      }
    });

    return () => observer.disconnect();
  }, []);
}