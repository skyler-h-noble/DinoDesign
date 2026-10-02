// src/components/Foundations/TokenRoles.js
//
// Swatch grids for the colour ROLES a foundation offers, and a table of the
// variables a style reads.
//
// Shared by Typography and Icon because the question is the same on both
// pages — "what can I pass to `color`, and what does each one resolve to?" —
// and Button already answers it with swatches. Prose cannot: a role list is
// nine names that mean nothing without the colour beside them.
import React from 'react';
import { Box } from '@mui/material';
import { H5, BodySmall, Caption, EyebrowSmall } from '../Typography';
import { VStack, HStack } from '../Stack/Stack';

/**
 * One swatch per role, painted from the token itself.
 *
 * The chip renders the REAL variable rather than a copy of its value, so it
 * re-resolves with the theme and surface pickers above — which is the only way
 * to show that these are roles and not colours.
 */
export function RoleSwatches({ title, note, roles, tokenFor }) {
  return (
    <VStack gap="var(--Sizing-1-and-Half)">
      <VStack gap="var(--Sizing-Half)">
        <H5>{title}</H5>
        {note && <BodySmall color="quiet">{note}</BodySmall>}
      </VStack>
      <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap' }}>
        {roles.map((role) => {
          const token = tokenFor(role);
          return (
            <VStack key={role} gap="var(--Sizing-Half)" style={{ alignItems: 'center', minWidth: 96 }}>
              <Box sx={{
                width: 48, height: 48,
                borderRadius: 'var(--Style-Border-Radius, 4px)',
                backgroundColor: `var(${token})`,
                border: '1px solid var(--Border-Variant)',
              }} />
              <Caption>{role}</Caption>
              <Caption color="quiet" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10 }}>
                {token}
              </Caption>
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
}

/**
 * Every style, rendered in itself, with the variables it reads.
 *
 * The sample is the style applied to its own name, so the table shows the type
 * rather than describing it. The token column is generated from STYLE_TOKENS,
 * which is derived from each style's own config — a hand-kept list would be a
 * second source of truth, and this repo has had enough of those today.
 */
export function StyleTable({ styles, tokensFor, defaultColorFor, render }) {
  return (
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr>
          {['Style', 'Sample', 'Colour role', 'Variables'].map((h) => (
            <Box key={h} component="th" sx={{ py: 1, pr: 2, borderBottom: '1px solid var(--Border)', verticalAlign: 'bottom' }}>
              <EyebrowSmall>{h}</EyebrowSmall>
            </Box>
          ))}
        </tr>
      </thead>
      <tbody>
        {styles.map((name) => (
          <tr key={name}>
            <Box component="td" sx={{ py: 1, pr: 2, borderBottom: '1px solid var(--Border-Variant)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
              <Caption style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{name}</Caption>
            </Box>
            {/* The sample is CAPPED.
                Rendered at its real size, alt-display-large is 72px and takes a
                thousand-pixel row, so a table meant for scanning becomes a
                scroll. The cap is applied to the style's own --*-Font-Size
                token via min(), so the face, weight, tracking and case are all
                still the real thing — only the scale is clamped, and the true
                size is right there in the Variables column. */}
            <Box component="td" sx={{
              py: 1, pr: 2, borderBottom: '1px solid var(--Border-Variant)',
              verticalAlign: 'middle', minWidth: 160, maxWidth: 320,
            }}>
              <Box sx={{
                '& > *': {
                  fontSize: (() => {
                    const sizeToken = (tokensFor(name) || []).find(t => t.endsWith('-Font-Size'));
                    return sizeToken ? `min(var(${sizeToken}), 26px)` : undefined;
                  })(),
                  lineHeight: 1.3,
                  margin: 0,
                },
              }}>
                {render(name)}
              </Box>
            </Box>
            <Box component="td" sx={{ py: 1, pr: 2, borderBottom: '1px solid var(--Border-Variant)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
              <Caption color="quiet">
                {defaultColorFor(name) === 'header' ? '--Header-*' : '--Text-*'}
              </Caption>
            </Box>
            {/* Inline and wrapping, not one per line. Eight tokens stacked made
                the row taller than everything else in it. */}
            <Box component="td" sx={{ py: 1, borderBottom: '1px solid var(--Border-Variant)', verticalAlign: 'middle' }}>
              <Caption color="quiet" style={{
                fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, lineHeight: 1.5,
              }}>
                {tokensFor(name).map(t => t.replace(/^--/, '')).join(' · ')}
              </Caption>
            </Box>
          </tr>
        ))}
      </tbody>
    </Box>
  );
}
