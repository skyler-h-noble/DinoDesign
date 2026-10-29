// GENERATED from CLAUDE.md section 4 by scripts/check-quickstart.mjs —
// the quickstart must compile against the published types.

import { useOmniDesign, Button } from '@omni-design/components';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function ModeToggle() {
  const { isDark, toggleDarkMode } = useOmniDesign();
  return (
    <Button iconOnly variant="ghost" aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleDarkMode}>
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </Button>
  );
}
