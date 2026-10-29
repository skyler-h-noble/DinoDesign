// What a consumer hits on a fresh install — each case broke a real one-page
// build against the published package.
import React from 'react';
import { render } from '@testing-library/react';
import * as lib from './index';
import { Grid } from './Grid/Grid';
import { Container } from './Container/Container';
import { Chip } from './Chip/Chip';
import pkg from '../../package.json';
import theme from '../../public/styles/theme.json';

describe('consumer setup', () => {
  it('exports the Card sections the docs use', () => {
    ['CardContent', 'CardActions', 'CardOverflow', 'CardCover'].forEach((n) => {
      expect(typeof lib[n]).toBe('function');
    });
  });

  it('exports a default theme URL that points at this package\'s theme.json', () => {
    expect(lib.OMNI_DEFAULT_THEME_URL).toMatch(
      /^https:\/\/cdn\.jsdelivr\.net\/npm\/@omni-design\/components@[^/]+\/public\/styles\/theme\.json$/);
  });

  it('ships public/styles in the package and a theme.json naming every sheet', () => {
    expect(pkg.files).toContain('public/styles');
    ['foundation', 'core', 'typography', 'lightMode', 'darkMode', 'base', 'styles'].forEach((k) => {
      expect(theme[k]).toMatch(/\.css$/);
    });
  });

  it('pins MUI to 7, the major the components are built against', () => {
    expect(pkg.peerDependencies['@mui/material']).toBe('^7.0.0');
    expect(pkg.peerDependencies['@mui/icons-material']).toBe('^7.0.0');
  });

  it('Grid maps MUI 5 breakpoint props to MUI 7 size', () => {
    const { container } = render(
      <Grid container><Grid item xs={12} md={4}>a</Grid><Grid size={{ xs: 6 }}>b</Grid></Grid>);
    const [a, b] = container.firstChild.children;
    expect(a.className).toMatch(/grid-xs-12/);
    expect(a.className).toMatch(/grid-md-4/);
    expect(b.className).toMatch(/grid-xs-6/);
  });

  it('Container is layout only — no surface, no paint', () => {
    const { container } = render(<Container>x</Container>);
    expect(container.firstChild.getAttribute('data-surface')).toBeNull();
  });

  it('Chip draws MUI\'s icon prop inside the body, as the start decorator', () => {
    const { container } = render(<Chip label="Figma" icon={<svg data-testid="ic" />} />);
    expect(container.querySelector('.MuiChip-icon')).toBeNull();
    expect(container.querySelector('.MuiChip-label [data-testid="ic"]')).not.toBeNull();
  });
});
