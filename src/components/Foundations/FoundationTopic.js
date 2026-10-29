// src/components/Foundations/FoundationTopic.js
//
// Renders one entry from docs/foundations.js.
//
// That file has held seven topics — platforms, surfaces, typography, spacing,
// elevation, the Alt Display, states — since the docs moved into the library,
// and NOTHING rendered them. `renderFoundations()` emits markdown for an agent
// to read, and the only other references were a type declaration and a
// re-export. So the facts that are not about any one component were written,
// reviewed, and invisible in the gallery.
//
// Same failure as figmaLinks.js and the Motion tokens: authored, exported,
// never consumed. Worth naming, because it is the third instance in this
// codebase and the shape is always identical.
import React from 'react';
import { H3, BodySmall, Body, EyebrowSmall } from '../Typography';
import { VStack } from '../Stack/Stack';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';

registerStaticStyles('omni-foundation-topic', [
  '.omni-ft-code{font-family:ui-monospace, SFMono-Regular, Menlo, monospace;font-size:0.9em;padding:1px 4px;'
    + 'border-radius:var(--Sizing-Half, 4px);background-color:var(--Hover)}',
  '.omni-ft-table{width:100%;border-collapse:collapse;text-align:left}',
  '.omni-ft-th{padding-top:8px;padding-bottom:8px;padding-right:16px;border-bottom:1px solid var(--Border);vertical-align:bottom}',
  '.omni-ft-td{padding-top:10px;padding-bottom:10px;padding-right:16px;vertical-align:top}',
  '.omni-ft-trap{background-color:var(--Background);color:var(--Text);padding:16px;'
    + 'border-radius:var(--Card-Radius, var(--Style-Border-Radius));border:1px solid var(--Border-Variant)}',
].join('\n'));

/* The topic text is markdown-ish: `code` and **bold**. Handled inline rather
   than through a markdown library — two forms is not a parser's worth of work,
   and the dependency would ship to every consumer for the sake of two cases. */
function Inline({ text }) {
  useStaticStyles('omni-foundation-topic');
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('`') && p.endsWith('`')) {
          return (
            <code key={i} className="MuiBox-root omni-ft-code">{p.slice(1, -1)}</code>
          );
        }
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

export function FoundationTopic({ topic }) {
  useStaticStyles('omni-foundation-topic');
  if (!topic) return null;
  return (
    <VStack gap="var(--Sizing-3)" style={{ maxWidth: 820 }}>
      <VStack gap="var(--Sizing-1)">
        <H3>{topic.title}</H3>
        <Body color="quiet"><Inline text={topic.lede} /></Body>
      </VStack>

      <VStack gap="var(--Sizing-2)">
        {topic.body.map((p, i) => <Body key={i}><Inline text={p} /></Body>)}
      </VStack>

      {topic.table && (
        <table className="MuiBox-root omni-ft-table">
          <thead>
            <tr>
              {topic.table.head.map((h, i) => (
                <th key={i} className="MuiBox-root omni-ft-th">
                  <EyebrowSmall>{h}</EyebrowSmall>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topic.table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="MuiBox-root omni-ft-td">
                    <BodySmall><Inline text={cell} /></BodySmall>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {topic.trap && (
        /* The trap is the part that changes what someone writes, so it gets its
           own surface rather than being another paragraph. Warning theme at
           Surface-Brightest reads as caution without the alarm of a solid
           warning fill, and it follows the brand instead of a hardcoded amber. */
        <div data-theme="Warning" data-surface="Surface-Brightest" className="MuiBox-root omni-ft-trap">
          <VStack gap="var(--Sizing-Half)">
            <EyebrowSmall>Trap</EyebrowSmall>
            <BodySmall><Inline text={topic.trap} /></BodySmall>
          </VStack>
        </div>
      )}
    </VStack>
  );
}

export default FoundationTopic;
