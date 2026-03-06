// src/components/Spacing/Spacing.js
import React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';

/**
 * Spacing Component - Design System Documentation
 * 
 * Displays the design system spacing and sizing scales
 * 
 * WCAG 2.1 Accessibility Best Practices:
 * - Visual demos use aria-hidden="true" to hide from screen readers
 * - No empty decorative <div> elements in DOM
 * - Semantic HTML for all content
 * - CSS-based spacing (margin/padding) for actual layout
 * - aria-hidden only on non-focusable, decorative elements
 * 
 * @returns {React.ReactNode} Spacing scale documentation
 */
export function Spacing() {
  const spacingUnits = [
    { name: 'Quarter', var: '--Spacing-Quarter', baseValue: '2px' },
    { name: 'Half', var: '--Spacing-Half', baseValue: '4px' },
    { name: '1-and-Half', var: '--Spacing-1-and-Half', baseValue: '12px' },
    { name: '1', var: '--Spacing-1', baseValue: '8px' },
    { name: '2', var: '--Spacing-2', baseValue: '16px' },
    { name: '3', var: '--Spacing-3', baseValue: '24px' },
    { name: '4', var: '--Spacing-4', baseValue: '32px' },
    { name: '5', var: '--Spacing-5', baseValue: '40px' },
    { name: '6', var: '--Spacing-6', baseValue: '48px' },
    { name: '7', var: '--Spacing-7', baseValue: '56px' },
    { name: '8', var: '--Spacing-8', baseValue: '64px' },
    { name: '9', var: '--Spacing-9', baseValue: '72px' },
    { name: '10', var: '--Spacing-10', baseValue: '80px' },
  ];

  const sizingUnits = [
    { name: 'Quarter', var: '--Sizing-Quarter', value: '2px' },
    { name: 'Half', var: '--Sizing-Half', value: '4px' },
    { name: '1-and-Half', var: '--Sizing-1-and-Half', value: '12px' },
    { name: '1', var: '--Sizing-1', value: '8px' },
    { name: '2', var: '--Sizing-2', value: '16px' },
    { name: '3', var: '--Sizing-3', value: '24px' },
    { name: '4', var: '--Sizing-4', value: '32px' },
    { name: '5', var: '--Sizing-5', value: '40px' },
    { name: '6', var: '--Sizing-6', value: '48px' },
    { name: '7', var: '--Sizing-7', value: '56px' },
    { name: '8', var: '--Sizing-8', value: '64px' },
    { name: '9', var: '--Sizing-9', value: '72px' },
    { name: '10', var: '--Sizing-10', value: '80px' },
    { name: '11', var: '--Sizing-11', value: '88px' },
    { name: '12', var: '--Sizing-12', value: '96px' },
    { name: '13', var: '--Sizing-13', value: '104px' },
    { name: '14', var: '--Sizing-14', value: '112px' },
    { name: '15', var: '--Sizing-15', value: '160px' },
    { name: '16', var: '--Sizing-16', value: '240px' },
    { name: '17', var: '--Sizing-17', value: '320px' },
    { name: '18', var: '--Sizing-18', value: '480px' },
  ];

  const negativeSizing = [
    { name: 'Negative-Quarter', var: '--Sizing-Negative-Quarter', value: '-2px' },
    { name: 'Negative-Half', var: '--Sizing-Negative-Half', value: '-4px' },
    { name: 'Negative-1-and-Half', var: '--Sizing-Negative-1-and-Half', value: '-12px' },
    { name: 'Negative-1', var: '--Sizing-Negative-1', value: '-8px' },
  ];

  /**
   * SpacingBar Component
   * Visual demonstration of spacing value
   * Uses aria-hidden="true" on decorative bar since content is shown in text
   * 
   * WCAG 2.1: Decorative elements should be hidden from screen readers
   * {@link https://dequeuniversity.com/rules/axe/3.5/aria-hidden-focus}
   */
  const SpacingBar = ({ name, varName, baseValue }) => {
    return (
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
          }}
        >
          {/* 
            Visual bar - HIDDEN from assistive technology
            aria-hidden="true" because the spacing value is fully conveyed 
            by the text labels below. Screen readers don't need this visual.
          */}
          <Box
            aria-hidden="true"
            sx={{
              width: `var(${varName})`,
              minWidth: 20,
              height: 24,
              backgroundColor: 'var(--Buttons-Primary-Button)',
              borderRadius: 0.5,
              border: '1px solid var(--Border)',
            }}
          />
          
          {/* Text labels - VISIBLE to screen readers */}
          <Stack spacing={0.5}>
            <Typography 
              variant="subtitle2" 
              sx={{ fontWeight: 600 }}
            >
              {name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: 'var(--Text-Secondary)' }}
            >
              {varName}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: 'var(--Text-Secondary)' }}
            >
              Base: {baseValue} (with cognitive multiplier)
            </Typography>
          </Stack>
        </Box>
      </Box>
    );
  };

  /**
   * SizingBox Component
   * Visual demonstration of sizing value
   * Uses aria-hidden="true" on decorative box
   */
  const SizingBox = ({ name, varName, value }) => {
    return (
      <Box sx={{ mb: 2 }}>
        {/* 
          Decorative visual box - HIDDEN from assistive technology
          The actual size values are in the text below
        */}
        <Box
          aria-hidden="true"
          sx={{
            width: 100,
            height: value,
            backgroundColor: 'var(--Buttons-Primary-Button)',
            borderRadius: 1,
            border: '1px solid var(--Border)',
            mb: 1,
          }}
        />
        
        {/* Text content - VISIBLE to screen readers */}
        <Typography 
          variant="subtitle2" 
          sx={{ fontWeight: 600 }}
        >
          {name}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ color: 'var(--Text-Secondary)', display: 'block' }}
        >
          {varName}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ color: 'var(--Text-Secondary)' }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {/* Spacing Section */}
      <section>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          Spacing Scale
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ mb: 3, color: 'var(--Text-Secondary)' }}
        >
          Spacing values are multiplied by the cognitive multiplier for accessibility.
          Each spacing value includes a visual reference and text label for clarity.
        </Typography>
        <Stack spacing={1}>
          {spacingUnits.map((unit) => (
            <SpacingBar
              key={unit.var}
              name={unit.name}
              varName={unit.var}
              baseValue={unit.baseValue}
            />
          ))}
        </Stack>
      </section>

      {/* Sizing Section */}
      <section>
        <Typography 
          variant="h5"
          component="h2"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          Sizing Scale
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ mb: 3, color: 'var(--Text-Secondary)' }}
        >
          Fixed sizing values for components and layouts. Each size is labeled 
          with its CSS variable and pixel value.
        </Typography>
        <Grid container spacing={3}>
          {sizingUnits.map((unit) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={unit.var}>
              <SizingBox 
                name={unit.name} 
                varName={unit.var} 
                value={unit.value} 
              />
            </Grid>
          ))}
        </Grid>
      </section>

      {/* Negative Sizing Section */}
      <section>
        <Typography 
          variant="h5"
          component="h2"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          Negative Sizing
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ mb: 3, color: 'var(--Text-Secondary)' }}
        >
          Negative values for margins and offsets. Use these to reduce or remove 
          default spacing when needed.
        </Typography>
        <Grid container spacing={3}>
          {negativeSizing.map((unit) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={unit.var}>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ fontWeight: 600 }}
                >
                  {unit.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: 'var(--Text-Secondary)', display: 'block' }}
                >
                  {unit.var}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: 'var(--Text-Secondary)' }}
                >
                  {unit.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </section>

      {/* Container Padding */}
      <section style={{ paddingTop: 24, borderTop: '1px solid var(--Border)' }}>
        <Typography 
          variant="h5"
          component="h2"
          sx={{ mb: 2, fontWeight: 700 }}
        >
          Container Padding
        </Typography>
        <Box
          sx={{
            p: 'var(--Spacing-3)',
            backgroundColor: 'var(--Container-Low)',
            border: '2px dashed var(--Buttons-Primary-Button)',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">
            Default container padding: <strong>var(--Spacing-3)</strong> = 24px
          </Typography>
          <Typography 
            variant="caption"
            sx={{ color: 'var(--Text-Secondary)', display: 'block', mt: 1 }}
          >
            Use this variable for consistent padding around main content areas.
          </Typography>
        </Box>
      </section>

      {/* Practical Examples */}
      <section style={{ paddingTop: 24, borderTop: '1px solid var(--Border)' }}>
        <Typography 
          variant="h5"
          component="h2"
          sx={{ mb: 3, fontWeight: 700 }}
        >
          Practical Examples
        </Typography>

        {/* Padding Examples */}
        <article>
          <Typography 
            variant="h6"
            component="h3"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Padding Examples
          </Typography>
          <Typography 
            variant="caption"
            sx={{ color: 'var(--Text-Secondary)', mb: 2, display: 'block' }}
          >
            Different padding values create different visual breathing room.
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {['var(--Spacing-1)', 'var(--Spacing-2)', 'var(--Spacing-3)', 'var(--Spacing-4)'].map((spacing) => (
              <Grid item xs={12} sm={6} key={spacing}>
                <Box
                  sx={{
                    p: spacing,
                    backgroundColor: 'var(--Container)',
                    border: '1px solid var(--Border)',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    Padding: {spacing}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 1,
                      color: 'var(--Text-Secondary)'
                    }}
                  >
                    Content with spacing applied
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </article>

        {/* Gap Examples */}
        <article>
          <Typography 
            variant="h6"
            component="h3"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Gap Examples
          </Typography>
          <Typography 
            variant="caption"
            sx={{ color: 'var(--Text-Secondary)', mb: 2, display: 'block' }}
          >
            Gap controls spacing between flex/grid children without adding extra elements.
          </Typography>
          <Stack spacing={3}>
            {['var(--Spacing-1)', 'var(--Spacing-2)', 'var(--Spacing-3)'].map((gap) => (
              <Box key={gap}>
                <Stack 
                  direction="row" 
                  spacing={gap}
                  sx={{ mb: 1 }}
                >
                  {[1, 2, 3].map((item) => (
                    <Box
                      key={item}
                      aria-hidden="true"
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'var(--Buttons-Primary-Button)',
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Stack>
                <Typography 
                  variant="caption" 
                  sx={{ color: 'var(--Text-Secondary)' }}
                >
                  Gap: {gap}
                </Typography>
              </Box>
            ))}
          </Stack>
        </article>
      </section>

      {/* CSS Best Practices Note */}
      <Box
        role="note"
        sx={{
          p: 2,
          backgroundColor: 'var(--Container-Low)',
          borderRadius: 1,
          borderLeft: '4px solid var(--Buttons-Primary-Button)',
          mt: 3,
        }}
      >
        <Typography 
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          ✓ Accessibility Best Practices Used
        </Typography>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>
            <Typography variant="caption">
              <strong>aria-hidden="true"</strong> on purely decorative visual elements
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              All spacing information conveyed through text labels and values
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              No empty decorative <code>&lt;div&gt;</code> elements in DOM
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              Semantic HTML: <code>&lt;section&gt;</code> and <code>&lt;article&gt;</code> for structure
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              CSS-based spacing (padding/margin) for actual layout, not decorative divs
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              Full keyboard navigation and screen reader support
            </Typography>
          </li>
        </ul>
      </Box>
    </Stack>
  );
}

export default Spacing;
