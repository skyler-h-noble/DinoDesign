// src/components/StateMessage/StateMessage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { StateMessage } from './StateMessage';
import { Table } from '../Table/Table';
import { List } from '../List/List';
import { Button } from '../Button/Button';

const cols = [{ label: 'Name', field: 'name' }, { label: 'Total', field: 'total' }];

describe('the region is named by its own headline', () => {
  /* Without this it is an unlabelled group: a screen-reader user tabbing past
     a table hears "group" and has to enter it to learn the query found
     nothing. */
  it('labels the region with the title', () => {
    const { container } = render(<StateMessage title="No invoices yet" />);
    const region = container.querySelector('.state-message');
    const labelId = region.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId)).toHaveTextContent('No invoices yet');
  });

  it('describes it with the body when there is one', () => {
    const { container } = render(
      <StateMessage title="No invoices yet" body="They appear here once you send one." />,
    );
    const id = container.querySelector('.state-message').getAttribute('aria-describedby');
    expect(document.getElementById(id)).toHaveTextContent('once you send one');
  });

  it('sets no describedby when there is no body', () => {
    // Pointing at a missing id is worse than pointing at nothing: the name
    // resolves to empty and the region loses its label in some readers.
    const { container } = render(<StateMessage title="Nothing here" />);
    expect(container.querySelector('.state-message')).not.toHaveAttribute('aria-describedby');
  });

  it('warns when it has no words at all', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<StateMessage />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('only an error interrupts', () => {
  it('an error is an alert', () => {
    const { container } = render(<StateMessage type="error" title="Could not load" />);
    expect(container.querySelector('.state-message')).toHaveAttribute('role', 'alert');
  });

  it('empty and no-results are not', () => {
    /* They are the ordinary outcome of an ordinary query. Announcing them
       assertively talks over whatever the user was reading. */
    for (const type of ['empty', 'no-results']) {
      const { container } = render(<StateMessage type={type} title="Nothing" />);
      expect(container.querySelector('.state-message')).toHaveAttribute('role', 'group');
    }
  });
});

describe('the icon stays silent', () => {
  it('is hidden from assistive tech', () => {
    // The headline already says what this is; naming the glyph announces the
    // region twice.
    const { container } = render(<StateMessage title="No invoices yet" />);
    expect(container.querySelector('.icon')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('empty and no-results are different messages', () => {
  it('ships a distinct default icon for each', () => {
    /* Conflating them is how a user who filtered everything out gets told to
       create their first record. */
    const { container: a } = render(<StateMessage type="empty" title="x" />);
    const { container: b } = render(<StateMessage type="no-results" title="x" />);
    expect(a.querySelector('svg').getAttribute('data-testid'))
      .not.toBe(b.querySelector('svg').getAttribute('data-testid'));
  });
});

describe('Table slots', () => {
  it('shows the empty slot only when rows is an empty array', () => {
    const msg = <StateMessage title="No invoices yet" />;
    render(<Table columns={cols} rows={[]} empty={msg} />);
    expect(screen.getByText('No invoices yet')).toBeInTheDocument();
  });

  it('keeps the header in every state', () => {
    // Dropping it changes the region's width between states, so the page
    // jumps on every filter run.
    render(<Table columns={cols} rows={[]} empty={<StateMessage title="None" />} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('error beats loading beats empty', () => {
    /* A failed request that is retrying is still an error the user must see,
       and a request that returned nothing is not empty until it finishes —
       the other order flashes "no results" just before the data lands. */
    render(
      <Table
        columns={cols}
        rows={[]}
        loading
        empty={<StateMessage title="EMPTY" />}
        error={<StateMessage type="error" title="ERROR" />}
      />,
    );
    expect(screen.getByText('ERROR')).toBeInTheDocument();
    expect(screen.queryByText('EMPTY')).not.toBeInTheDocument();
  });

  it('marks the table busy while loading, on the region itself', () => {
    const { container } = render(<Table columns={cols} rows={[]} loading />);
    expect(container.querySelector('.table-wrapper')).toHaveAttribute('aria-busy', 'true');
  });

  it('is not busy once loaded', () => {
    const { container } = render(<Table columns={cols} rows={[['a', 'b']]} />);
    expect(container.querySelector('.table-wrapper')).not.toHaveAttribute('aria-busy');
  });

  it('renders rows normally when there are some', () => {
    render(<Table columns={cols} rows={[['Acme', '10']]} empty={<StateMessage title="None" />} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.queryByText('None')).not.toBeInTheDocument();
  });
});

describe('List slots', () => {
  it('shows the empty slot for an empty items array', () => {
    render(<List items={[]} empty={<StateMessage title="Nothing saved" />} />);
    expect(screen.getByText('Nothing saved')).toBeInTheDocument();
  });

  it('marks the list busy while loading', () => {
    const { container } = render(<List items={[]} loading />);
    expect(container.querySelector('[role="list"]')).toHaveAttribute('aria-busy', 'true');
  });

  it('puts the message in an <li>, not a bare div', () => {
    /* A non-li child of a <ul> is invalid and some readers drop it — so the
       one thing the user needs to hear is the thing not announced. */
    const { container } = render(<List items={[]} empty={<StateMessage title="Nothing" />} />);
    const msg = container.querySelector('.state-message');
    expect(msg.closest('li')).toBeInTheDocument();
  });
});

describe('accessibility', () => {
  it('has no violations in either type', async () => {
    for (const type of ['empty', 'error']) {
      const { container } = render(
        <StateMessage
          type={type}
          title="No invoices yet"
          body="They appear here once you send one."
          action={<Button>New invoice</Button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    }
  });

  it('has no violations inside a Table', async () => {
    const { container } = render(
      <Table columns={cols} rows={[]} empty={<StateMessage title="No invoices yet" />} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
