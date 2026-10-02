// src/docs/figmaLinks.js
//
// Where each component lives in the Figma library.
//
// Page-level, not node-level, and deliberately so: a page id is stable across
// edits, while a component-set id changes if the set is recreated — and a link
// that silently lands on nothing is worse than one that lands a level out.
//
// This is NOT the studio's figmaComponentMap. That one resolves a USER's linked
// file (which set maps to which page in their copy, with their node ids) and is
// a studio concern. This is the library's own source file: one file key, one
// page per component, the same for everyone.
export const FIGMA_FILE_KEY = 'Qv2dqF7mYoAGY77EkdrwTv';
export const FIGMA_FILE_NAME = 'Omni-Designs-Aug12';

/** Component doc name → Figma page id. */
export const FIGMA_PAGES = {
  Accordion: '3156:824',
  Alert: '8832:27566',
  AppBar: '7446:33121',
  Avatar: '3156:2682',
  Badge: '3156:4764',
  Box: '3156:5155',
  Breadcrumbs: '3156:5265',
  Button: '3492:3526',
  ButtonGroup: '6583:12058',
  Card: '7442:31014',
  Checkbox: '6729:509',
  Chip: '8927:14974',
  CodeBlock: '9150:18202',
  Dialog: '8122:6767',
  Divider: '6847:26729',
  Drawer: '6896:32544',
  Fab: '6778:14825',
  Icon: '5669:4784',
  IconBadge: '9189:26750',
  Input: '8574:17760',
  Link: '3156:5445',
  List: '6875:28869',
  Loader: '5859:1529',
  Menu: '9112:17981',
  Modal: '8117:6603',
  NumberField: '6850:28494',
  Pagination: '8379:6689',
  Radio: '6778:13564',
  Rail: '8224:2635',
  Ratio: '6241:11973',
  Rating: '6780:12084',
  SearchField: '8574:17760',
  Select: '8493:14435',
  Sheet: '8326:2799',
  Slider: '6791:13099',
  Snackbar: '8836:28082',
  Stepper: '8379:13798',
  SwitchInput: '3503:3820',
  Table: '8379:11736',
  Tabs: '8212:9163',
  Tag: '7442:32013',
  TextField: '8574:17760',
  Toolbar: '7446:33121',
  Tooltip: '8829:25532',
  TreeView: '6896:32593',
  BottomNavigation: '7446:33043',
};

/**
 * A link to the component in Figma, or null when it is not drawn.
 *
 * Null rather than a link to the file root: a component with no design is a
 * real answer, and sending someone to the front page to hunt for it is not.
 */
export function figmaUrlFor(component) {
  const node = FIGMA_PAGES[component];
  if (!node) return null;
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/${FIGMA_FILE_NAME}`
    + `?node-id=${node.replace(':', '-')}`;
}
