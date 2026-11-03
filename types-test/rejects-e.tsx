// Each line must be a TYPE ERROR (see rejects.tsx): surfaces and data display.
import { Box, Tag, PrimaryTag, Table, Badge, Ratio } from '@omni-design/components';

export const rejectsE = (
  <>
    {/* @ts-expect-error — Box elevation is 0–5 */}
    <Box elevation={7} />
    {/* @ts-expect-error — not a tag shape */}
    <Tag shape="hexagon">x</Tag>
    {/* @ts-expect-error — a preset tag's color is fixed */}
    <PrimaryTag color="error">x</PrimaryTag>
    {/* @ts-expect-error — stripe is none | odd | even */}
    <Table stripe="zebra" />
    {/* @ts-expect-error — Badge has no default color (it is a notification) */}
    <Badge variant="default" />
    {/* @ts-expect-error — not a ratio name */}
    <Ratio ratio="4:1" />
  </>
);
