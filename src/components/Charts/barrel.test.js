import { BarChart, LineChart, PieChart, CHART_TOKENS, chartGeometry } from '../index';
test('charts are reachable from the package barrel', () => {
  [BarChart, LineChart, PieChart].forEach((C) => expect(typeof C).toBe('function'));
  expect(CHART_TOKENS.fill).toBe('var(--Icons-Primary)');
  // The geometry must come through as plain functions, since the Figma plugin
  // imports it without React in scope.
  expect(typeof chartGeometry.arcPath).toBe('function');
  expect(typeof chartGeometry.smoothPath).toBe('function');
});
