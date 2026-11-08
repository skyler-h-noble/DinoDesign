import type { ReactNode } from 'react';
import type { Root, RootOptions, HydrationOptions } from 'react-dom/client';
/** Start the app: hydrates a page the Vite plugin prerendered, else createRoot. React 18+. */
export function mountApp(el: Element | null, element: ReactNode, options?: RootOptions & HydrationOptions): Root;
