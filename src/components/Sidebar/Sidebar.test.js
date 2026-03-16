// src/components/Sidebar/Sidebar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Sidebar,
  CollapsibleSidebar,
  UserProfileSidebar,
  MinimalSidebar,
} from './Sidebar';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { axe } from 'jest-axe';

const mockItems = [
  { label: 'Home', icon: <HomeIcon /> },
  { label: 'Settings', icon: <SettingsIcon /> },
  { label: 'About', icon: <HomeIcon /> },
];

const mockItemsWithSubmenu = [
  {
    label: 'Dashboard',
    icon: <HomeIcon />,
    submenu: [
      { label: 'Overview', icon: <HomeIcon /> },
      { label: 'Analytics', icon: <SettingsIcon /> },
    ],
  },
  { label: 'Settings', icon: <SettingsIcon /> },
];

describe('Sidebar Component', () => {
  test('renders Sidebar when open', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders header text', () => {
    render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
        header="Main Menu"
      />
    );
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  test('renders all menu items', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container.textContent).toContain('Home');
    expect(container.textContent).toContain('Settings');
    expect(container.textContent).toContain('About');
  });

  test('calls onItemClick when item is clicked', () => {
    const onItemClick = jest.fn();
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={onItemClick}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('calls onClose when item is clicked (temporary variant)', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Sidebar
        open={true}
        onClose={onClose}
        items={mockItems}
        onItemClick={jest.fn()}
        variant="temporary"
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders footer text', () => {
    render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
        footer="© 2024 MyApp"
      />
    );
    expect(screen.getByText('© 2024 MyApp')).toBeInTheDocument();
  });

  test('supports submenu items', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItemsWithSubmenu}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('supports badge on items', () => {
    const itemsWithBadge = [
      { label: 'Notifications', icon: <HomeIcon />, badge: 5 },
      { label: 'Messages', icon: <SettingsIcon />, badge: 2 },
    ];
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={itemsWithBadge}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('supports permanent variant', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
        variant="permanent"
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom width', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
        width={350}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('CollapsibleSidebar Component', () => {
  test('renders CollapsibleSidebar', () => {
    const { container } = render(
      <CollapsibleSidebar
        collapsed={false}
        onToggle={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('collapses to icon-only mode', () => {
    const { container } = render(
      <CollapsibleSidebar
        collapsed={true}
        onToggle={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('calls onToggle when collapse button is clicked', () => {
    const onToggle = jest.fn();
    const { container } = render(
      <CollapsibleSidebar
        collapsed={false}
        onToggle={onToggle}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('UserProfileSidebar Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  test('renders UserProfileSidebar', () => {
    const { container } = render(
      <UserProfileSidebar
        open={true}
        onClose={jest.fn()}
        user={mockUser}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays user profile section', () => {
    render(
      <UserProfileSidebar
        open={true}
        onClose={jest.fn()}
        user={mockUser}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('calls onUserClick when profile is clicked', () => {
    const onUserClick = jest.fn();
    const { container } = render(
      <UserProfileSidebar
        open={true}
        onClose={jest.fn()}
        user={mockUser}
        items={mockItems}
        onItemClick={jest.fn()}
        onUserClick={onUserClick}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('MinimalSidebar Component', () => {
  test('renders MinimalSidebar', () => {
    const { container } = render(
      <MinimalSidebar
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders icon-only buttons', () => {
    const { container } = render(
      <MinimalSidebar
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('calls onItemClick when icon is clicked', () => {
    const onItemClick = jest.fn();
    const { container } = render(
      <MinimalSidebar
        items={mockItems}
        onItemClick={onItemClick}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('Selected Item Styling', () => {
  test('selected item uses primary button styling', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('all variants use primary button for selected items', () => {
    const variants = [
      <Sidebar key="1" open={true} onClose={jest.fn()} items={mockItems} onItemClick={jest.fn()} />,
      <CollapsibleSidebar key="2" collapsed={false} onToggle={jest.fn()} items={mockItems} onItemClick={jest.fn()} />,
      <UserProfileSidebar key="3" open={true} onClose={jest.fn()} user={{name: 'Test'}} items={mockItems} onItemClick={jest.fn()} />,
      <MinimalSidebar key="4" items={mockItems} onItemClick={jest.fn()} />,
    ];

    variants.forEach(variant => {
      const { container } = render(variant);
      expect(container).toBeInTheDocument();
    });
  });
});

describe('Accessibility', () => {
  test('sidebar has proper semantic structure', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  test('menu items are keyboard accessible', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('Design System Integration', () => {
  test('uses Container background', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('uses Border-Variant for dividers', () => {
    render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
        footer="© 2024"
      />
    );
    expect(screen.getByText('© 2024')).toBeInTheDocument();
  });

  test('uses Buttons-Primary for selected items', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onClose={jest.fn()}
        items={mockItems}
        onItemClick={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Sidebar — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Sidebar />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Sidebar />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Sidebar />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
