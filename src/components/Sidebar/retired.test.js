// Sidebar and MainLayout are retired: they still render, and say so once.
import React from 'react';
import { render } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { MainLayout } from '../MainLayout/MainLayout';

describe('retired navigation frames', () => {
  test.each([['Sidebar', Sidebar, { open: true, items: [] }], ['MainLayout', MainLayout, {}]])(
    '%s still renders and warns once, pointing to the replacement', (name, Comp, props) => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(() => { render(<Comp {...props} />); render(<Comp {...props} />); }).not.toThrow();
      const mine = warn.mock.calls.filter((c) => String(c[0]).includes('<' + name + '> is retired'));
      expect(mine).toHaveLength(1);
      expect(String(mine[0][0])).toMatch(/Rail|AppBar/);
      warn.mockRestore();
    });
});
