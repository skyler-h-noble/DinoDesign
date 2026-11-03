// Each line must be a TYPE ERROR (see rejects.tsx).
import { Accordion, AccordionGroup } from '@omni-design/components';

export const rejectsAccordion = (
  <>
    {/* @ts-expect-error — onChange gets the new state, not an event */}
    <Accordion onChange={(e: { preventDefault(): void }) => e.preventDefault()} />
    {/* @ts-expect-error — no outlined group variant */}
    <AccordionGroup variant="outlined" />
  </>
);
