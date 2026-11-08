import { useEffect, useState } from 'react';

/**
 * ClientOnly — content that depends on the visitor (cart, signed-in name,
 * saved choices), drawn only once the app is running.
 *
 * A prerendered page is saved at build time, when there is no visitor: a cart
 * saved that way says "empty" until the app corrects it. The saved HTML and
 * the first render draw `fallback`; the real content replaces it right after. Give the fallback the content's size (a Skeleton)
 * so nothing moves.
 *
 *   <ClientOnly fallback={<BodySmall>Your cart</BodySmall>}>
 *     <BodySmall>Your cart ({cart.count})</BodySmall>
 *   </ClientOnly>
 */
export function ClientOnly({ children, fallback = null }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  return ready ? children : fallback;
}

export default ClientOnly;
