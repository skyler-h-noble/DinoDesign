// A list is a stack with component="ul" — the guide tells agents to write it.
import React from 'react';
import { render } from '@testing-library/react';
import { VStack, HStack } from './Stack';

test('VStack/HStack render as the element passed in component', () => {
  const { container } = render(
    <VStack component="ul"><HStack component="li">One</HStack><HStack component="li">Two</HStack></VStack>);
  expect(container.querySelector('ul > li')).not.toBeNull();
  expect(container.querySelectorAll('li').length).toBe(2);
});
