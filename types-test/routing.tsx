// Client-side routing: the provider takes a router's link component or a
// navigate function, and the link components take the reloadDocument escape
// hatch. A stand-in for react-router's Link, typed the way it is (`to`
// required), so this fails if linkComponent is narrowed to href-only links.
import * as React from 'react';
import { OmniDesignProvider, Button, Card, Link } from '@omni-design/components';

const RouterLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  function RouterLink({ to, ...rest }, ref) {
    return <a ref={ref} {...rest} href={to} />;
  },
);

export function WithLinkComponent() {
  return (
    <OmniDesignProvider linkComponent={RouterLink}>
      <Button href="/cart">Cart</Button>
      <Card href="/products/1">Product</Card>
      <Link href="/legacy" reloadDocument>Old page</Link>
      <Button href="/download" reloadDocument>Download</Button>
      <Card href="/server" reloadDocument>Server page</Card>
    </OmniDesignProvider>
  );
}

export function WithNavigate({ go }: { go: (to: string) => void }) {
  return (
    <OmniDesignProvider navigate={(href) => go(href)}>
      <Link href="/about">About</Link>
    </OmniDesignProvider>
  );
}
