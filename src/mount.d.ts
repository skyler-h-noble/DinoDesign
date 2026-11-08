import type { ReactNode } from 'react';
import type { Root, RootOptions } from 'react-dom/client';
/** Start the app. On a page the Vite plugin prerendered, the saved page stays
 *  on screen while the app draws out of sight, then they swap — what was typed
 *  carries over. Otherwise createRoot. React 18+. */
export function mountApp(el: Element | null, element: ReactNode, options?: RootOptions): Root;
