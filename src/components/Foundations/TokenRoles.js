// src/components/Foundations/TokenRoles.js
//
// Swatch grids for the color ROLES a foundation offers, and a table of the
// variables a style reads.
//
// Shared by Typography and Icon because the question is the same on both
// pages — "what can I pass to `color`, and what does each one resolve to?" —
// and Button already answers it with swatches. Prose cannot: a role list is
// nine names that mean nothing without the color beside them.
import React from 'react';
import { H5, BodySmall, Caption, EyebrowSmall } from '../Typography';
import { VStack, HStack } from '../Stack/Stack';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

/* The rules that reach INTO a child (`> *`) carry the class twice: the child
   is a Typography whose own sheet can sit after this one in <head>, and the
   wrapper's leading has to win over it the way emotion's later rule did.
   The swatch color and the sample's capped size are per instance, carried by
   custom properties. */
registerStaticStyles('omni-token-roles', [
  '.omni-tr-swatch{width:48px;height:48px;border-radius:var(--Style-Border-Radius, 4px);'
    + 'background-color:var(--_tr-bg);border:1px solid var(--Border-Variant)}',
  '.omni-tr-table{width:100%;border-collapse:collapse;text-align:left}',
  '.omni-tr-table tr.style-row + tr.style-row td{border-top:1px solid var(--Border-Variant)}',
  '.omni-tr-table tr.style-row td{padding-top:20px;padding-bottom:20px}',
  '.omni-tr-th{padding-top:8px;padding-bottom:8px;padding-right:16px;border-bottom:1px solid var(--Border);vertical-align:bottom}',
  '.omni-tr-td{padding-top:8px;padding-bottom:8px;padding-right:16px;vertical-align:middle;white-space:nowrap}',
  '.omni-tr-td-sample{padding-top:8px;padding-bottom:8px;padding-right:16px;vertical-align:middle;min-width:160px;max-width:320px}',
  '.omni-tr-sample.omni-tr-sample>*{line-height:1.3;margin:0}',
  '.omni-tr-sample-fs.omni-tr-sample-fs>*{font-size:var(--_tr-fs)}',
  '.omni-tr-td-tokens{padding-top:8px;padding-bottom:8px;vertical-align:middle}',
  '.omni-tr-td-tokens.omni-tr-td-tokens>*{display:block;line-height:1.45}',
].join('\n'));

/**
 * One swatch per role, painted from the token itself.
 *
 * The chip renders the REAL variable rather than a copy of its value, so it
 * re-resolves with the theme and surface pickers above — which is the only way
 * to show that these are roles and not colors.
 */
export function RoleSwatches({ title, note, roles, tokenFor }) {
  useStaticStyles('omni-token-roles');
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
              <div className="MuiBox-root omni-tr-swatch" style={{ '--_tr-bg': `var(${token})` }} />
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

/* Rows are separated by space, not by rules. Only the header keeps its line,
   because that one marks the boundary between the labels and the data —
   everything below it is one list and did not need slicing into strips.

/**
 * Every style, rendered in itself, with the variables it reads.
 *
 * The sample is the style applied to its own name, so the table shows the type
 * rather than describing it. The token column is generated from STYLE_TOKENS,
 * which is derived from each style's own config — a hand-kept list would be a
 * second source of truth, and this repo has had enough of those today.
 */
export function StyleTable({ styles, tokensFor, defaultColorFor, render }) {
  useStaticStyles('omni-token-roles');
  return (
    <table className="MuiBox-root omni-tr-table">
      <thead>
        <tr>
          {['Style', 'Sample', 'Role', 'Variables'].map((h) => (
            <th key={h} className="MuiBox-root omni-tr-th">
              <EyebrowSmall>{h}</EyebrowSmall>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* A rule between styles, and more room around each.
            This is the one list where a per-row line earns its place: each row
            renders its style in ITSELF, so without a separator two adjacent
            samples read as one block of mixed type rather than as two entries.
            Elsewhere the rows are uniform and spacing is enough. */}
        {styles.map((name) => {
          const sizeToken = (tokensFor(name) || []).find(t => t.endsWith('-Font-Size'));
          return (
          <tr key={name} className="style-row">
            <td className="MuiBox-root omni-tr-td">
              <Caption style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{name}</Caption>
            </td>
            {/* The sample is CAPPED.
                Rendered at its real size, alt-display-large is 72px and takes a
                thousand-pixel row, so a table meant for scanning becomes a
                scroll. The cap is applied to the style's own --*-Font-Size
                token via min(), so the face, weight, tracking and case are all
                still the real thing — only the scale is clamped, and the true
                size is right there in the Variables column. */}
            <td className="MuiBox-root omni-tr-td-sample">
              <div
                className={'MuiBox-root omni-tr-sample' + (sizeToken ? ' omni-tr-sample-fs' : '')}
                style={sizeToken ? { '--_tr-fs': `min(var(${sizeToken}), 26px)` } : undefined}
              >
                {render(name)}
              </div>
            </td>
            <td className="MuiBox-root omni-tr-td">
              <Caption color="quiet">
                {defaultColorFor(name) === 'header' ? '--Header-*' : '--Text-*'}
              </Caption>
            </td>
            {/* One per line, which is how a token list is read — scanning for a
                name in a run of middots is harder than scanning a column.

                The height problem was never the stacking, it was the LINE
                HEIGHT: Caption inherits the brand's body leading, which is
                generous for prose and enormous for a ten-pixel monospace list.
                Set on the wrapper via `& > *` rather than on each Caption,
                because Typography writes lineHeight into its own sx and a
                `style` prop on the component does not reliably win. */}
            <td className="MuiBox-root omni-tr-td-tokens">
              {tokensFor(name).map((t) => (
                <Caption key={t} color="quiet" style={{
                  fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10,
                }}>{t}</Caption>
              ))}
            </td>
          </tr>
          );
        })}
      </tbody>
    </table>
  );
}
