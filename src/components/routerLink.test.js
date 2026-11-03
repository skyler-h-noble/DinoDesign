// Client-side routing: every component that renders an <a> from an href goes
// through one helper (_routerLink.js), so an internal link follows the app's
// router — and stays a real, right-clickable <a> — while external links,
// new-tab links and modified clicks keep the browser's behavior.
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Link as ReactRouterLink, useLocation } from 'react-router-dom';
import { OmniLinkContext, isRoutableHref, isPlainLeftClick } from './_routerLink';
import { OmniDesignProvider } from '../OmniDesignProvider';
import { Button } from './Button/Button';
import { Card } from './Card/Card';
import { Link } from './Link/Link';
import { Tabs, TabList, Tab } from './Tabs/Tabs';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs/Breadcrumbs';
import { AvatarGroup } from './AvatarGroup/AvatarGroup';
import { Footer } from './Footer/Footer';

/* A stand-in router link. It marks the element so a test can tell it rendered
   instead of the library's own <a>, and forwards its ref as react-router's and
   Next's links do. */
const FakeLink = React.forwardRef(function FakeLink({ to, ...rest }, ref) {
  return <a ref={ref} data-router-to={to} {...rest} />;
});

const withLink = (ui) => (
  <OmniLinkContext.Provider value={{ linkComponent: FakeLink, navigate: null }}>{ui}</OmniLinkContext.Provider>
);
const withNavigate = (navigate, ui) => (
  <OmniLinkContext.Provider value={{ linkComponent: null, navigate }}>{ui}</OmniLinkContext.Provider>
);

/* Each component, given an href, returns the element that carries it. */
const COMPONENTS = {
  Button: (href, extra = {}) => {
    render(withLink(<Button href={href} aria-label="Go" className="mine" {...extra}>Go</Button>));
    return screen.getByRole('link', { name: 'Go' });
  },
  Card: (href, extra = {}) => {
    render(withLink(<Card href={href} aria-label="Go" className="mine" {...extra}>Go</Card>));
    return screen.getByRole('link', { name: 'Go' });
  },
  Link: (href, extra = {}) => {
    render(withLink(<Link href={href} aria-label="Go" className="mine" {...extra}>Go</Link>));
    return screen.getByRole('link', { name: 'Go' });
  },
  Tab: (href, extra = {}) => {
    render(withLink(
      <Tabs navigation>
        <TabList aria-label="Main navigation">
          <Tab href={href} aria-label="Go" className="mine" {...extra}>Go</Tab>
        </TabList>
      </Tabs>,
    ));
    return screen.getByRole('link', { name: 'Go' });
  },
  BreadcrumbItem: (href, extra = {}) => {
    render(withLink(
      <Breadcrumbs>
        <BreadcrumbItem href={href} aria-label="Go" className="mine" {...extra}>Go</BreadcrumbItem>
        <BreadcrumbItem>Here</BreadcrumbItem>
      </Breadcrumbs>,
    ));
    return screen.getAllByRole('link', { name: 'Go' })[0];
  },
};

describe('isRoutableHref', () => {
  test.each([
    ['/cart', {}, true],
    ['products/1', {}, true],
    ['../up', {}, true],
    ['?page=2', {}, true],
    ['/cart', { target: '_self' }, true],
    ['#pricing', {}, false],
    ['https://example.com/x', {}, false],
    ['http://localhost/cart', {}, false],
    ['//cdn.example.com/a.js', {}, false],
    ['mailto:a@b.co', {}, false],
    ['tel:+15551234', {}, false],
    ['/cart', { target: '_blank' }, false],
    ['/report.pdf', { download: true }, false],
    ['/report.pdf', { download: '' }, false],
    ['', {}, false],
    [undefined, {}, false],
  ])('%s %o -> %s', (href, opts, expected) => {
    expect(isRoutableHref(href, opts)).toBe(expected);
  });

  test('a plain left click is the only click a router takes', () => {
    expect(isPlainLeftClick({ button: 0 })).toBe(true);
    expect(isPlainLeftClick({ button: 1 })).toBe(false);
    for (const k of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey']) {
      expect(isPlainLeftClick({ button: 0, [k]: true })).toBe(false);
    }
  });
});

describe.each(Object.keys(COMPONENTS))('%s with a linkComponent', (name) => {
  const renderIt = COMPONENTS[name];

  test('an internal href renders through the router link, with href, to, className and aria intact', () => {
    const el = renderIt('/products/1');
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('data-router-to', '/products/1');
    expect(el).toHaveAttribute('href', '/products/1');
    expect(el).toHaveAttribute('aria-label', 'Go');
    expect(el.className).toMatch(/\bmine\b/);
  });

  test.each([
    ['https://example.com', {}],
    ['mailto:hi@example.com', {}],
    ['tel:+15551234', {}],
    ['#pricing', {}],
    ['/products/1', { target: '_blank' }],
    ['/report.pdf', { download: true }],
    ['/server-page', { reloadDocument: true }],
  ])('%s %o stays a plain <a>', (href, extra) => {
    const el = renderIt(href, extra);
    expect(el.tagName).toBe('A');
    expect(el).not.toHaveAttribute('data-router-to');
    expect(el).toHaveAttribute('href', href);
    expect(el).not.toHaveAttribute('reloadDocument');
    expect(el).not.toHaveAttribute('reloaddocument');
  });
});

describe('composite components inherit it', () => {
  test('AvatarGroup: a person avatar and an overflow row both route', () => {
    const people = [
      { name: 'Ada Lovelace', href: '/people/ada' },
      { name: 'Grace Hopper', href: '/people/grace' },
      { name: 'Mary Jackson', href: '/people/mary' },
    ];
    render(withLink(<AvatarGroup people={people} max={2} />));
    expect(screen.getByRole('link', { name: 'Ada Lovelace' })).toHaveAttribute('data-router-to', '/people/ada');
    fireEvent.click(screen.getByRole('button', { name: /^1 more/ }));
    expect(screen.getByRole('link', { name: /Mary Jackson/ })).toHaveAttribute('data-router-to', '/people/mary');
  });

  test('Footer: column links route, social links (new tab) and the mailto stay plain', () => {
    render(withLink(
      <Footer brand="Acme" address={{ email: "hi@acme.test" }} copyrightName="Acme"
        columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '/pricing' }] }]}
        socialLinks={[{ name: 'GitHub', label: 'GitHub', url: 'https://github.com/acme' }]} />,
    ));
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('data-router-to', '/pricing');
    const mail = document.querySelector('a[href="mailto:hi@acme.test"]');
    expect(mail).not.toBeNull();
    expect(mail).not.toHaveAttribute('data-router-to');
    const social = screen.queryByRole('link', { name: 'GitHub' });
    if (social) expect(social).not.toHaveAttribute('data-router-to');
  });
});

describe('refs', () => {
  test('a Button ref reaches the element the router link renders', () => {
    const ref = React.createRef();
    render(withLink(<Button ref={ref} href="/cart">Cart</Button>));
    expect(ref.current).toBe(screen.getByRole('link', { name: 'Cart' }));
    expect(ref.current).toHaveAttribute('data-router-to', '/cart');
  });
});

describe('navigate (no linkComponent)', () => {
  const click = (el, init) => {
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init });
    act(() => { el.dispatchEvent(ev); });
    return ev;
  };

  test.each(Object.keys(COMPONENTS))('%s: a plain left click calls navigate and stops the reload', (name) => {
    const navigate = jest.fn();
    // Re-render the same component under a navigate provider.
    const ui = {
      Button: <Button href="/cart">Go</Button>,
      Card: <Card href="/cart" aria-label="Go">Go</Card>,
      Link: <Link href="/cart">Go</Link>,
      Tab: <Tabs navigation><TabList aria-label="Nav"><Tab href="/cart">Go</Tab></TabList></Tabs>,
      BreadcrumbItem: <Breadcrumbs><BreadcrumbItem href="/cart">Go</BreadcrumbItem><BreadcrumbItem>Here</BreadcrumbItem></Breadcrumbs>,
    }[name];
    render(withNavigate(navigate, ui));
    const el = screen.getAllByRole('link', { name: 'Go' })[0];
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/cart');
    const ev = click(el);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toBe('/cart');
    expect(ev.defaultPrevented).toBe(true);
  });

  test.each([
    ['cmd', { metaKey: true }],
    ['ctrl', { ctrlKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['middle button', { button: 1 }],
  ])('a %s click is left to the browser', (_, init) => {
    const navigate = jest.fn();
    render(withNavigate(navigate, <Link href="/cart">Go</Link>));
    const ev = click(screen.getByRole('link', { name: 'Go' }), init);
    expect(navigate).not.toHaveBeenCalled();
    expect(ev.defaultPrevented).toBe(false);
  });

  test('the component onClick runs first and can veto with preventDefault', () => {
    const navigate = jest.fn();
    const onClick = jest.fn((e) => e.preventDefault());
    render(withNavigate(navigate, <Button href="/cart" onClick={onClick}>Go</Button>));
    click(screen.getByRole('link', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  test('an onClick that does not veto still runs, then navigate', () => {
    const order = [];
    const navigate = jest.fn(() => order.push('navigate'));
    render(withNavigate(navigate, <Link href="/cart" onClick={() => order.push('onClick')}>Go</Link>));
    click(screen.getByRole('link', { name: 'Go' }));
    expect(order).toEqual(['onClick', 'navigate']);
  });

  test('external, new-tab and escape-hatch links never call navigate', () => {
    const navigate = jest.fn();
    render(withNavigate(navigate, (
      <>
        <Link href="https://example.com">Ext</Link>
        <Link href="/cart" target="_blank">Tab</Link>
        <Link href="/cart" reloadDocument>Reload</Link>
      </>
    )));
    // Stop jsdom's own (unimplemented) navigation from logging; the point is
    // only that the router was not called.
    const stop = (e) => e.preventDefault();
    document.addEventListener('click', stop);
    for (const name of ['Ext', 'Tab', 'Reload']) click(screen.getByRole('link', { name }));
    document.removeEventListener('click', stop);
    expect(navigate).not.toHaveBeenCalled();
  });

  test('linkComponent wins when both are given (no double navigation)', () => {
    const navigate = jest.fn();
    render(
      <OmniLinkContext.Provider value={{ linkComponent: FakeLink, navigate }}>
        <Link href="/cart">Go</Link>
      </OmniLinkContext.Provider>,
    );
    const el = screen.getByRole('link', { name: 'Go' });
    expect(el).toHaveAttribute('data-router-to', '/cart');
    const stop = (e) => e.preventDefault();
    document.addEventListener('click', stop);
    click(el);
    document.removeEventListener('click', stop);
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe('OmniDesignProvider wiring', () => {
  let warn;
  beforeEach(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
  afterEach(() => warn.mockRestore());

  test('linkComponent on the provider reaches the components', () => {
    render(<OmniDesignProvider linkComponent={FakeLink}><Button href="/cart">Cart</Button></OmniDesignProvider>);
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('data-router-to', '/cart');
  });

  test('a nested provider without router props keeps the parent router', () => {
    render(
      <OmniDesignProvider linkComponent={FakeLink}>
        <OmniDesignProvider defaultTheme="Primary">
          <Link href="/cart">Cart</Link>
        </OmniDesignProvider>
      </OmniDesignProvider>,
    );
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('data-router-to', '/cart');
  });

  test('with react-router: a click changes the route without a reload', () => {
    function Where() { return <span data-testid="where">{useLocation().pathname}</span>; }
    render(
      <MemoryRouter initialEntries={['/']}>
        <OmniDesignProvider linkComponent={ReactRouterLink}>
          <Button href="/cart">Cart</Button>
          <Card href="/products/1" aria-label="Product">Product</Card>
          <Where />
        </OmniDesignProvider>
      </MemoryRouter>,
    );
    const cart = screen.getByRole('link', { name: 'Cart' });
    expect(cart).toHaveAttribute('href', '/cart');
    expect(cart).not.toHaveAttribute('to');
    fireEvent.click(cart);
    expect(screen.getByTestId('where')).toHaveTextContent('/cart');
    fireEvent.click(screen.getByRole('link', { name: 'Product' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/products/1');
  });
});

describe('without a router, nothing changes', () => {
  /* The same markup whether or not the routing context exists at all — the
     helper hands back exactly what the component built. */
  const SAMPLES = {
    Button: <Button href="/cart" aria-label="Go">Go</Button>,
    ButtonNoHref: <Button>Go</Button>,
    Card: <Card href="/cart" aria-label="Go">Go</Card>,
    CardDisabled: <Card href="/cart" disabled>Go</Card>,
    Link: <Link href="/cart">Go</Link>,
    LinkDisabled: <Link href="/cart" disabled>Go</Link>,
    Tab: <Tabs navigation><TabList aria-label="Nav"><Tab href="/cart">Go</Tab></TabList></Tabs>,
    TabPlain: <Tabs><TabList aria-label="Tabs"><Tab>Go</Tab></TabList></Tabs>,
    Breadcrumbs: <Breadcrumbs><BreadcrumbItem href="/">Home</BreadcrumbItem><BreadcrumbItem>Here</BreadcrumbItem></Breadcrumbs>,
  };

  test.each(Object.keys(SAMPLES))('%s: identical DOM with a null router context and with none', (name) => {
    // React's generated ids (:r1:) differ between two renders; nothing else may.
    const ids = (html) => html.replace(/:r[0-9a-z]+:/g, ':id:');
    const bare = ids(render(SAMPLES[name]).container.innerHTML);
    const nulled = ids(render(<OmniLinkContext.Provider value={null}>{SAMPLES[name]}</OmniLinkContext.Provider>).container.innerHTML);
    expect(nulled).toBe(bare);
  });

  test('a link is a plain <a href> with no router attributes', () => {
    render(<><Button href="/cart">B</Button><Card href="/cart" aria-label="C">C</Card><Link href="/cart">L</Link></>);
    for (const name of ['B', 'C', 'L']) {
      const el = screen.getByRole('link', { name });
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('href', '/cart');
      expect(el).not.toHaveAttribute('to');
      expect(el).not.toHaveAttribute('data-router-to');
    }
  });
});
