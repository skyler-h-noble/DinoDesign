// src/components/Charts/ChartsShowcase.js
//
// The Charts page: how a chart is made in this system, and where.
//
// Two ways, for two jobs. A chart for a page or a design — a one-off, with a
// matching Figma frame — comes from the Charts add-on in the studio, which
// writes accessible HTML/CSS on the brand's tokens and a Figma build from the
// file's own chart components, both from one spec. A chart that lives inside
// a React app and redraws with its data uses the BarChart / LineChart /
// PieChart components in this library. This page is the signpost to both.
import React from 'react';
import { Box } from '@mui/material';
import { ShowcaseHeader } from '../ShowcaseHeader';
import { H4, Body, BodySmall } from '../Typography';
import { Link } from '../Link/Link';
import { VStack } from '../Stack/Stack';
import { DOCS_ORIGIN } from '../../docs/docsLink';

export const CHARTS_APP_URL = `${DOCS_ORIGIN}/add-ons/charts`;

function Section({ title, children }) {
  return (
    <VStack spacing={1} style={{ maxWidth: 760 }}>
      <H4>{title}</H4>
      {children}
    </VStack>
  );
}

function Points({ items }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'grid', gap: 0.75 }}>
      {items.map(([lead, text]) => (
        <Box component="li" key={lead}>
          <Body><strong>{lead}</strong> {text}</Body>
        </Box>
      ))}
    </Box>
  );
}

export function ChartsShowcase() {
  return (
    <Box>
      <ShowcaseHeader title="Charts" />
      <VStack spacing={4} style={{ marginTop: 16 }}>
        <VStack spacing={2} style={{ maxWidth: 760 }}>
          <Body>
            Charts are made in the <strong>Charts add-on</strong> in the Omni Design studio. You describe the
            chart once; it gives you the chart as accessible HTML and CSS on your design system&rsquo;s tokens,
            and a matching Figma design built from your file&rsquo;s own chart components &mdash; the same
            positions, sizes and colors on both sides.
          </Body>
          {/* A Link, not a Button: it navigates. (The lib's Button forwards no
              href, so it could not anyway.) */}
          <Body>
            <Link href={CHARTS_APP_URL} target="_blank" rel="noopener">Open the Charts add-on in the studio</Link>
          </Body>
        </VStack>

        <Section title="How it works">
          <Points items={[
            ['Generate', '— pick a chart type (bar, 3D bar, wide 3D bar, fancy bar, stacked bar, line, pie, donut), vertical or horizontal, enter the data, and choose colors from your Chart-1 to Chart-10 and state colors.'],
            ['Code', '— copy the HTML and CSS. It reads your design system’s CSS, so the chart follows your brand, its light and dark modes, and the background it sits on. Choose Responsive and it follows its container.'],
            ['Export', '— copy the spec for Figma.'],
            ['Import', '— paste a chart’s HTML, spec or link to edit it again. Nothing is stored: the chart carries its own spec.'],
          ]} />
        </Section>

        <Section title="Accessible by construction">
          <Points items={[
            ['Every color clears 3:1', 'against the chart’s background, on both the light and the dark chart ground, in both modes. Slices and touching bars are separated by a border in the background color, so neighbours never rely on color alone.'],
            ['The data is always there as a table.', 'Every chart carries a real data table for screen readers. Add the "Show as table" link and anyone can open it in place — a native disclosure that works with the keyboard and needs no script.'],
            ['Shape as well as color.', 'Line charts can give each line its own marker — circle, disc, square or triangle — and the legend shows the shape, so lines can be followed without telling colors apart.'],
            ['Text uses your tokens.', 'Labels, ticks and titles take the background’s Text and Header colors, so they keep their contrast wherever the chart is placed.'],
            ['It tells you.', 'The studio flags what would make a chart hard to read — too many slices, a thin line with no markers, values that do not fit — before you export.'],
          ]} />
        </Section>

        <Section title="A matching design in Figma">
          <Body>
            Import your design system into the Omni template with the Omni Design plugin, then:
          </Body>
          <Points items={[
            ['Build', '— open Add-ons › Charts in the plugin and paste the spec. The chart is built from the file’s Bar, 3dBar, Wide-3dBar, FancyBar and StackedBar components, on its Chart-Colors, Chart and Surface variables, in a Card when you ask for one.'],
            ['Size it', '— Figma cannot reflow a chart, so select a frame at the size you want and use Render in selected frame.'],
            ['Edit it', '— select a chart and use Open selected chart in the studio; change it there and build it back.'],
          ]} />
          <BodySmall color="quiet">
            The code and the Figma build are laid out by the same code, so a bar sits at the same place in both.
            If they ever differ, the plugin says why &mdash; most often that the file has a different design
            system from the one the studio loaded.
          </BodySmall>
        </Section>

        <Section title="Charts inside a React app">
          <Body>
            For a chart that lives in your app and redraws with its data, use the library&rsquo;s{' '}
            <strong>BarChart</strong>, <strong>LineChart</strong> and <strong>PieChart</strong>. They use the same
            palette and the same accessible table, and re-theme with the surface they sit on.
          </Body>
        </Section>

        <Body>
          <Link href={CHARTS_APP_URL} target="_blank" rel="noopener">Make a chart in the studio</Link>
        </Body>
      </VStack>
    </Box>
  );
}

export default ChartsShowcase;
