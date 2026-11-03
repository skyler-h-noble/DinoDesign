// Each line must be a TYPE ERROR (fork C: navigation). `@ts-expect-error`
// fails the build if the line compiles.
import { Tabs, Menu, Pagination, Stepper, BottomNavigation } from '@omni-design/components';

export const rejectsC = (
  <>
    {/* @ts-expect-error — Tabs variant is standard | solid | light | dark (no outlined) */}
    <Tabs variant="outlined" />
    {/* @ts-expect-error — Menu placement is bottom-start | bottom-end */}
    <Menu placement="top" />
    {/* @ts-expect-error — Pagination onChange gets the page number, not an event */}
    <Pagination onChange={(e: React.ChangeEvent<HTMLInputElement>) => e} />
    {/* @ts-expect-error — Stepper variant is count | noCount */}
    <Stepper variant="dots" />
    {/* @ts-expect-error — misspelled prop */}
    <BottomNavigation itemz={[]} />
  </>
);
