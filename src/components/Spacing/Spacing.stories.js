// src/components/Spacing/Spacing.stories.js
import { Spacing } from './Spacing';
import { Box, Stack, Typography } from '@mui/material';

export default {
  title: 'Design System/Spacing',
  component: Spacing,
};

// Main Spacing Scale Documentation
export const SpacingScale = {
  render: () => <Spacing />,
};

// Accessibility Note
export const AccessibilityImplementation = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            WCAG 2.1 Accessibility Implementation
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Secondary)' }}>
            This Spacing component demonstrates best practices for accessible design system documentation.
          </Typography>
        </Box>

        <Box sx={{ 
          p: 2, 
          backgroundColor: 'var(--Container-Low)',
          borderRadius: 1,
          borderLeft: '4px solid #4caf50'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ✓ What We Did Right
          </Typography>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li><Typography variant="caption">Used <code>aria-hidden="true"</code> only on purely decorative visual bars</Typography></li>
            <li><Typography variant="caption">All information conveyed through text labels (not just visuals)</Typography></li>
            <li><Typography variant="caption">No empty decorative <code>&lt;div&gt;</code> elements</Typography></li>
            <li><Typography variant="caption">Semantic HTML: <code>&lt;section&gt;</code>, <code>&lt;article&gt;</code> tags</Typography></li>
            <li><Typography variant="caption">CSS-based spacing for layout, not DOM-based spacing divs</Typography></li>
          </ul>
        </Box>

        <Box sx={{ 
          p: 2, 
          backgroundColor: 'var(--Container-Low)',
          borderRadius: 1,
          borderLeft: '4px solid #f44336'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ✗ What We Avoided
          </Typography>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li><Typography variant="caption">Relying only on visual spacing divs for information</Typography></li>
            <li><Typography variant="caption">Using <code>aria-hidden="true"</code> on interactive elements</Typography></li>
            <li><Typography variant="caption">Creating empty DOM elements just for spacing</Typography></li>
            <li><Typography variant="caption">Missing semantic structure</Typography></li>
          </ul>
        </Box>

        <Box sx={{ 
          p: 2, 
          backgroundColor: 'var(--Container-Low)',
          borderRadius: 1,
          borderLeft: '4px solid #2196f3'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            💡 Key Principles
          </Typography>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li><Typography variant="caption"><strong>aria-hidden="true"</strong> only on non-focusable decorative elements</Typography></li>
            <li><Typography variant="caption">All semantic information must be available to screen readers</Typography></li>
            <li><Typography variant="caption">Use CSS (padding/margin) for layout, not extra DOM elements</Typography></li>
            <li><Typography variant="caption">Visual and textual information should be redundant</Typography></li>
            <li><Typography variant="caption">Reference: <a href="https://dequeuniversity.com/rules/axe/3.5/aria-hidden-focus" target="_blank" rel="noopener noreferrer">Deque University aria-hidden guidelines</a></Typography></li>
          </ul>
        </Box>

        <Box sx={{ pt: 2, borderTop: '1px solid var(--Border)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Full Component Below:
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid var(--Border)' }}>
        <Spacing />
      </Box>
    </Box>
  ),
};
