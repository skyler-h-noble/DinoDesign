// Each line must be a TYPE ERROR (fork A: inputs). `@ts-expect-error` fails
// the build if the line compiles.
import { TextInput, Select, NumberField, SearchField, FormLabel } from '@omni-design/components';

export const rejectsA = (
  <>
    {/* @ts-expect-error — validation is error | warning | success | info */}
    <TextInput validation="danger" />
    {/* @ts-expect-error — no "outside" label position */}
    <TextInput labelPosition="outside" />
    {/* @ts-expect-error — Select's onChange gets the value, not an event */}
    <Select onChange={(e: Event) => e} />
    {/* @ts-expect-error — NumberField value is a number */}
    <NumberField value="3" />
    {/* @ts-expect-error — misspelled prop */}
    <SearchField onSumbit={() => {}} />
    {/* @ts-expect-error — FormLabel type is default | required | optional */}
    <FormLabel type="mandatory">x</FormLabel>
  </>
);
