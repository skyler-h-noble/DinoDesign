// Each line must be a TYPE ERROR. `@ts-expect-error` fails the build if the
// line compiles, so this file proves the core types reject real mistakes —
// the ones that used to fail silently at runtime.
import { Section, Button, Card, Body, H2, Grid, IconBadge, Chip, Avatar } from '@omni-design/components';

export const rejects = (
  <>
    {/* @ts-expect-error — no -Light themes; lighter is a surface level */}
    <Section theme="Primary-Light" />
    {/* @ts-expect-error — not a surface */}
    <Section surface="Surface-Lighter" />
    {/* @ts-expect-error — the -light button shape was removed */}
    <Button variant="primary-light">x</Button>
    {/* @ts-expect-error — misspelled prop */}
    <Button varient="primary">x</Button>
    {/* @ts-expect-error — size is small | medium | large */}
    <Button size="huge">x</Button>
    {/* @ts-expect-error — Card variant is solid | light | dark */}
    <Card variant="outlined" />
    {/* @ts-expect-error — not a text color */}
    <Body color="muted">x</Body>
    {/* @ts-expect-error — headings don't take quiet */}
    <H2 color="quiet">x</H2>
    {/* @ts-expect-error — Grid size takes columns, not a string label */}
    <Grid size="third" />
    {/* @ts-expect-error — a burst is not an icon shape */}
    <IconBadge shape="burst" />
    {/* @ts-expect-error — Chip has no outline variant */}
    <Chip variant="primary-outline" />
    {/* @ts-expect-error — not an avatar size */}
    <Avatar size="huge" />
  </>
);
