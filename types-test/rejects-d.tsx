// Each line must be a TYPE ERROR (see rejects.tsx) — overlays and feedback.
import { Alert, Drawer, Snackbar, Tooltip, Modal } from '@omni-design/components';

export const rejectsD = (
  <>
    {/* @ts-expect-error — an alert is one of four states; primary is a callout */}
    <Alert color="primary">x</Alert>
    {/* @ts-expect-error — Drawer anchors to an edge, not "center" */}
    <Drawer anchor="center" />
    {/* @ts-expect-error — not a Snackbar position */}
    <Snackbar anchor="top-left" />
    {/* @ts-expect-error — the tooltip has one style */}
    <Tooltip variant="light" title="x"><span /></Tooltip>
    {/* @ts-expect-error — misspelled prop */}
    <Modal opne />
  </>
);
