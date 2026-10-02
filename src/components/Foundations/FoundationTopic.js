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
import { Box } from '@mui/material';
import { H3, BodySmall, Body, EyebrowSmall } from '../Typography';
import { VStack } from '../Stack/Stack';

/* The topic text is markdown-ish: `code` and **bold**. Handled inline rather
   than through a markdown library — two forms is not a parser's worth of work,
   and the dependency would ship to every consumer for the sake of two cases. */
function Inline({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('`') && p.endsWith('`')) {
          return (
            <Box key={i} component="code" sx={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '0.9em', px: 0.5, py: '1px',
              borderRadius: 'var(--Sizing-Half, 4px)',
              backgroundColor: 'var(--Hover)',
            }}>{p.slice(1, -1)}</Box>
          );
        }
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

export function FoundationTopic({ topic }) {
  if (!topic) return null;
  return (
    <VStack gap="var(--Sizing-3)" sx={{ maxWidth: 820 }}>
      <VStack gap="var(--Sizing-1)">
        <H3>{topic.title}</H3>
        <Body color="quiet"><Inline text={topic.lede} /></Body>
      </VStack>

      <VStack gap="var(--Sizing-2)">
        {topic.body.map((p, i) => <Body key={i}><Inline text={p} /></Body>)}
      </VStack>

      {topic.table && (
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              {topic.table.head.map((h, i) => (
                <Box key={i} component="th" sx={{ py: 1, pr: 2, borderBottom: '1px solid var(--Border)', verticalAlign: 'bottom' }}>
                  <EyebrowSmall>{h}</EyebrowSmall>
                </Box>
              ))}
            </tr>
          </thead>
          <tbody>
            {topic.table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <Box key={c} component="td" sx={{ py: 1.25, pr: 2, borderBottom: '1px solid var(--Border-Variant)', verticalAlign: 'top' }}>
                    <BodySmall><Inline text={cell} /></BodySmall>
                  </Box>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      )}

      {topic.trap && (
        /* The trap is the part that changes what someone writes, so it gets its
           own surface rather than being another paragraph. Warning theme at
           Surface-Brightest reads as caution without the alarm of a solid
           warning fill, and it follows the brand instead of a hardcoded amber. */
        <Box data-theme="Warning" data-surface="Surface-Brightest" sx={{
          backgroundColor: 'var(--Background)', color: 'var(--Text)', p: 2,
          borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
          border: '1px solid var(--Border-Variant)',
        }}>
          <VStack gap="var(--Sizing-Half)">
            <EyebrowSmall>Trap</EyebrowSmall>
            <BodySmall><Inline text={topic.trap} /></BodySmall>
          </VStack>
        </Box>
      )}
    </VStack>
  );
}

export default FoundationTopic;
