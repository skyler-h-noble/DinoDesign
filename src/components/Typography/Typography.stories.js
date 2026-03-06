// src/components/Typography/Typography.stories.js
import React from 'react';
import { Typography, H1, H2, H3, H4, H5, H6, Body, BodySmall, BodyLarge, BodySemibold, BodyBold, Label, Caption, Overline } from './Typography';
import { Box, Stack } from '@mui/material';

export default { title: 'Data Display/Typography', component: Typography };

const SAMPLE = 'The quick brown fox jumps over the lazy dog.';

export const AllStyles = {
  name: 'All Styles — Type Scale',
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      <H1>H1: {SAMPLE}</H1>
      <H2>H2: {SAMPLE}</H2>
      <H3>H3: {SAMPLE}</H3>
      <H4>H4: {SAMPLE}</H4>
      <H5>H5: {SAMPLE}</H5>
      <H6>H6: {SAMPLE}</H6>
      <hr />
      <BodyLarge>Body Large: {SAMPLE}</BodyLarge>
      <Body>Body: {SAMPLE}</Body>
      <BodySmall>Body Small: {SAMPLE}</BodySmall>
      <BodySemibold>Body Semibold: {SAMPLE}</BodySemibold>
      <BodyBold>Body Bold: {SAMPLE}</BodyBold>
      <hr />
      <Label>Label: {SAMPLE}</Label>
      <Caption>Caption: {SAMPLE}</Caption>
      <Overline>Overline: {SAMPLE}</Overline>
    </Stack>
  ),
};

export const Colors = {
  name: 'Colors — Header / Standard / Quiet',
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Box>
        <Caption style={{ display: 'block', marginBottom: 4, color: 'var(--Text-Quiet)' }}>Header — var(--Header)</Caption>
        <H3 color="header">Heading in Header color</H3>
      </Box>
      <Box>
        <Caption style={{ display: 'block', marginBottom: 4, color: 'var(--Text-Quiet)' }}>Standard — var(--Text)</Caption>
        <Body color="standard">Body text in Standard color. {SAMPLE}</Body>
      </Box>
      <Box>
        <Caption style={{ display: 'block', marginBottom: 4, color: 'var(--Text-Quiet)' }}>Quiet — var(--Text-Quiet)</Caption>
        <Body color="quiet">Body text in Quiet color. {SAMPLE}</Body>
      </Box>
    </Stack>
  ),
};

export const DefaultColors = {
  name: 'Default Color Per Style',
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Caption style={{ display: 'block', color: 'var(--Text-Quiet)' }}>Headings default to Header color, body to Standard, caption/overline to Quiet</Caption>
      <H4>H4 — defaults to Header</H4>
      <Body>Body — defaults to Standard</Body>
      <Caption>Caption — defaults to Quiet</Caption>
      <Overline>Overline — defaults to Quiet</Overline>
    </Stack>
  ),
};

export const WidthModes = {
  name: 'Width — Hug vs Fill',
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Box sx={{ border: '1px dashed var(--Border)', p: 2 }}>
        <Caption style={{ display: 'block', marginBottom: 8, color: 'var(--Text-Quiet)' }}>Fill (default for headings/body) — block, 100% width</Caption>
        <Body width="fill" sx={{ backgroundColor: 'var(--Surface-Dim)', p: 1 }}>This fills the container</Body>
      </Box>
      <Box sx={{ border: '1px dashed var(--Border)', p: 2 }}>
        <Caption style={{ display: 'block', marginBottom: 8, color: 'var(--Text-Quiet)' }}>Hug (default for label/caption/overline) — inline, fits content</Caption>
        <Label width="hug" sx={{ backgroundColor: 'var(--Surface-Dim)', p: 1 }}>This hugs content</Label>
      </Box>
      <Box sx={{ border: '1px dashed var(--Border)', p: 2 }}>
        <Caption style={{ display: 'block', marginBottom: 8, color: 'var(--Text-Quiet)' }}>Override: Body with hug</Caption>
        <Body width="hug" sx={{ backgroundColor: 'var(--Surface-Dim)', p: 1 }}>Body forced to hug</Body>
      </Box>
    </Stack>
  ),
};

export const NoWrap = {
  name: 'noWrap — Truncation with Ellipsis',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 400 }}>
      <Caption style={{ display: 'block', marginBottom: 8, color: 'var(--Text-Quiet)' }}>Text truncated at container boundary</Caption>
      <Body noWrap>
        This is a very long piece of text that will be truncated with an ellipsis when it reaches the edge of the container.
      </Body>
    </Box>
  ),
};

export const GutterBottom = {
  name: 'gutterBottom — Spacing Between Elements',
  render: () => (
    <Box sx={{ p: 4 }}>
      <H3 gutterBottom>Heading with Gutter</H3>
      <Body gutterBottom>First paragraph with bottom margin.</Body>
      <Body>Second paragraph immediately follows.</Body>
    </Box>
  ),
};

export const ComponentOverride = {
  name: 'Component Override — Visual vs Semantic',
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Caption style={{ display: 'block', color: 'var(--Text-Quiet)' }}>H2 visual style rendered as h3 element for correct document outline</Caption>
      <Typography textStyle="h2" component="h3">Looks like H2, semantically H3</Typography>
      <Caption style={{ display: 'block', color: 'var(--Text-Quiet)' }}>Body style rendered as span for inline usage</Caption>
      <Box>
        Prefix: <Typography textStyle="body" component="span" width="hug">inline body text</Typography> :suffix
      </Box>
    </Stack>
  ),
};

export const HeadingsWithColors = {
  name: 'All Headings — Each Color',
  render: () => (
    <Stack spacing={3} sx={{ p: 4 }}>
      {['header', 'standard', 'quiet'].map((c) => (
        <Box key={c}>
          <Overline style={{ display: 'block', marginBottom: 8 }}>{c.toUpperCase()}</Overline>
          <Stack spacing={1}>
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((h) => (
              <Typography key={h} textStyle={h} color={c}>{h.toUpperCase()}: {SAMPLE.substring(0, 30)}</Typography>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};

export const BodyVariants = {
  name: 'Body Variants — Size and Weight',
  render: () => (
    <Stack spacing={2} sx={{ p: 4 }}>
      <BodyLarge>Body Large: {SAMPLE}</BodyLarge>
      <Body>Body: {SAMPLE}</Body>
      <BodySmall>Body Small: {SAMPLE}</BodySmall>
      <BodySemibold>Body Semibold: {SAMPLE}</BodySemibold>
      <BodyBold>Body Bold: {SAMPLE}</BodyBold>
    </Stack>
  ),
};
