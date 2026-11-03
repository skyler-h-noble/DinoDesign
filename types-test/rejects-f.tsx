// Each line must be a TYPE ERROR (see rejects.tsx): provider, media, charts, utilities.
import { OmniDesignProvider, ThemedZone, Shape, Player, PieChart, CodeBlock, CopyButton, Quote } from '@omni-design/components';

export const rejectsF = (
  <>
    {/* @ts-expect-error — no -Light themes on a zone either */}
    <ThemedZone theme="Primary-Light" />
    {/* @ts-expect-error — not a data-style */}
    <OmniDesignProvider defaultStyle="Retro" />
    {/* @ts-expect-error — not a shape */}
    <Shape shape="hexagon" />
    {/* @ts-expect-error — onSeek receives seconds, not an event */}
    <Player onSeek={(e: string) => e} />
    {/* @ts-expect-error — pie colors are palette names, not hex */}
    <PieChart colors={['#ff0000']} />
    {/* @ts-expect-error — misspelled prop */}
    <CodeBlock langauge="bash" />
    {/* @ts-expect-error — CopyButton needs the text to copy */}
    <CopyButton />
    {/* @ts-expect-error — Quote align is start | center */}
    <Quote align="right" />
  </>
);
