/* Every showcase mounts.
 *
 * Three real bugs were sitting in the gallery with nothing to catch them, and
 * each failed the same way: the page threw on render and the test suite was
 * green, because 2647 tests covered the COMPONENTS and nothing rendered the
 * pages that demonstrate them.
 *
 *   Icon + 9 others  `bgTheme is not defined` — state added to a helper
 *                    function instead of the showcase it belonged to
 *   IconBadge        <Box> used with no import
 *   List             `isDefault` and `getThemeName` referenced and never
 *                    defined anywhere in the file. That one predates this
 *                    pass: the panel using them sat behind `{mainTab === 1 &&}`
 *                    and nothing ever opened the tab, so a plain
 *                    ReferenceError lived in the file indefinitely
 *
 * Wrapped in OmniDesignProvider because several showcases call useOmniDesign,
 * which throws by design outside one — that is the provider working, not a
 * failure.
 *
 * Generated from the files on disk rather than a hand-kept list, so a new
 * showcase is covered the moment it exists.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { OmniDesignProvider } from '../OmniDesignProvider';

import { AccordionShowcase } from '../components/Accordion/AccordionShowcase';
import { AlertShowcase } from '../components/Alert/AlertShowcase';
import { AppBarShowcase } from '../components/AppBar/AppBarShowcase';
import { AutocompleteShowcase } from '../components/Autocomplete/AutocompleteShowcase';
import { AvatarShowcase } from '../components/Avatar/AvatarShowcase';
import { BadgeShowcase } from '../components/Badge/BadgeShowcase';
import { BevelTextShowcase } from '../components/BevelText/BevelTextShowcase';
import { BottomNavigationShowcase } from '../components/BottomNavigation/BottomNavigationShowcase';
import { BoxShowcase } from '../components/Box/BoxShowcase';
import { BreadcrumbsShowcase } from '../components/Breadcrumbs/BreadcrumbsShowcase';
import { ButtonShowcase } from '../components/Button/ButtonShowcase';
import { ButtonGroupShowcase } from '../components/ButtonGroup/ButtonGroupShowcase';
import { CardShowcase } from '../components/Card/CardShowcase';
import { CheckboxShowcase } from '../components/Checkbox/CheckboxShowcase';
import { ChipShowcase } from '../components/Chip/ChipShowcase';
import { CircularProgressShowcase } from '../components/CircularProgress/CircularProgressShowcase';
import { CodeBlockShowcase } from '../components/CodeBlock/CodeBlockShowcase';
import { ColorsShowcase } from '../components/Colors/ColorsShowcase';
import { CopyrightShowcase } from '../components/Copyright/CopyrightShowcase';
import { CurvedTextShowcase } from '../components/CurvedText/CurvedTextShowcase';
import { DialogShowcase } from '../components/Dialog/DialogShowcase';
import { DividerShowcase } from '../components/Divider/DividerShowcase';
import { DrawerShowcase } from '../components/Drawer/DrawerShowcase';
import { FabShowcase } from '../components/Fab/FabShowcase';
import { FooterShowcase } from '../components/Footer/FooterShowcase';
import { GradientShowcase } from '../components/Gradient/GradientShowcase';
import { IconShowcase } from '../components/Icon/IconShowcase';
import { IconBadgeShowcase } from '../components/IconBadge/IconBadgeShowcase';
import { InputShowcase } from '../components/Input/InputShowcase';
import { LinearProgressShowcase } from '../components/LinearProgress/LinearProgressShowcase';
import { LinkShowcase } from '../components/Link/LinkShowcase';
import { ListShowcase } from '../components/List/ListShowcase';
import { MenuShowcase } from '../components/Menu/MenuShowcase';
import { ModalShowcase } from '../components/Modal/ModalShowcase';
import { NumberFieldShowcase } from '../components/NumberField/NumberFieldShowcase';
import { PaginationShowcase } from '../components/Pagination/PaginationShowcase';
import { RadioShowcase } from '../components/Radio/RadioShowcase';
import { RailShowcase } from '../components/Rail/RailShowcase';
import { RatingShowcase } from '../components/Rating/RatingShowcase';
import { RatioShowcase } from '../components/Ratio/RatioShowcase';
import { SearchFieldShowcase } from '../components/SearchField/SearchFieldShowcase';
import { SectionShowcase } from '../components/Section/SectionShowcase';
import { SelectShowcase } from '../components/Select/SelectShowcase';
import { SheetShowcase } from '../components/Sheet/SheetShowcase';
import { SliderShowcase } from '../components/Slider/SliderShowcase';
import { SnackbarShowcase } from '../components/Snackbar/SnackbarShowcase';
import { SpeedDialShowcase } from '../components/SpeedDial/SpeedDialShowcase';
import { StackShowcase } from '../components/Stack/StackShowcase';
import { StepperShowcase } from '../components/Stepper/StepperShowcase';
import { SwatchShowcase } from '../components/Swatch/SwatchShowcase';
import { SwitchShowcase } from '../components/Switch/SwitchShowcase';
import { TableShowcase } from '../components/Table/TableShowcase';
import { TabsShowcase } from '../components/Tabs/TabsShowcase';
import { TagShowcase } from '../components/Tag/TagShowcase';
import { ToggleButtonGroupShowcase } from '../components/ToggleButtonGroup/ToggleButtonGroupShowcase';
import { ToolbarShowcase } from '../components/Toolbar/ToolbarShowcase';
import { TooltipShowcase } from '../components/Tooltip/TooltipShowcase';
import { TransferListShowcase } from '../components/TransferList/TransferListShowcase';
import { TreeViewShowcase } from '../components/TreeView/TreeViewShowcase';
import { TypographyShowcase } from '../components/Typography/TypographyShowcase';

describe('every showcase renders', () => {
  test('Accordion', () => { render(<OmniDesignProvider><AccordionShowcase /></OmniDesignProvider>); });
  test('Alert', () => { render(<OmniDesignProvider><AlertShowcase /></OmniDesignProvider>); });
  test('AppBar', () => { render(<OmniDesignProvider><AppBarShowcase /></OmniDesignProvider>); });
  test('Autocomplete', () => { render(<OmniDesignProvider><AutocompleteShowcase /></OmniDesignProvider>); });
  test('Avatar', () => { render(<OmniDesignProvider><AvatarShowcase /></OmniDesignProvider>); });
  test('Badge', () => { render(<OmniDesignProvider><BadgeShowcase /></OmniDesignProvider>); });
  test('BevelText', () => { render(<OmniDesignProvider><BevelTextShowcase /></OmniDesignProvider>); });
  test('BottomNavigation', () => { render(<OmniDesignProvider><BottomNavigationShowcase /></OmniDesignProvider>); });
  test('Box', () => { render(<OmniDesignProvider><BoxShowcase /></OmniDesignProvider>); });
  test('Breadcrumbs', () => { render(<OmniDesignProvider><BreadcrumbsShowcase /></OmniDesignProvider>); });
  test('Button', () => { render(<OmniDesignProvider><ButtonShowcase /></OmniDesignProvider>); });
  test('ButtonGroup', () => { render(<OmniDesignProvider><ButtonGroupShowcase /></OmniDesignProvider>); });
  test('Card', () => { render(<OmniDesignProvider><CardShowcase /></OmniDesignProvider>); });
  test('Checkbox', () => { render(<OmniDesignProvider><CheckboxShowcase /></OmniDesignProvider>); });
  test('Chip', () => { render(<OmniDesignProvider><ChipShowcase /></OmniDesignProvider>); });
  test('CircularProgress', () => { render(<OmniDesignProvider><CircularProgressShowcase /></OmniDesignProvider>); });
  test('CodeBlock', () => { render(<OmniDesignProvider><CodeBlockShowcase /></OmniDesignProvider>); });
  test('Colors', () => { render(<OmniDesignProvider><ColorsShowcase /></OmniDesignProvider>); });
  test('Copyright', () => { render(<OmniDesignProvider><CopyrightShowcase /></OmniDesignProvider>); });
  test('CurvedText', () => { render(<OmniDesignProvider><CurvedTextShowcase /></OmniDesignProvider>); });
  test('Dialog', () => { render(<OmniDesignProvider><DialogShowcase /></OmniDesignProvider>); });
  test('Divider', () => { render(<OmniDesignProvider><DividerShowcase /></OmniDesignProvider>); });
  test('Drawer', () => { render(<OmniDesignProvider><DrawerShowcase /></OmniDesignProvider>); });
  test('Fab', () => { render(<OmniDesignProvider><FabShowcase /></OmniDesignProvider>); });
  test('Footer', () => { render(<OmniDesignProvider><FooterShowcase /></OmniDesignProvider>); });
  test('Gradient', () => { render(<OmniDesignProvider><GradientShowcase /></OmniDesignProvider>); });
  test('Icon', () => { render(<OmniDesignProvider><IconShowcase /></OmniDesignProvider>); });
  test('IconBadge', () => { render(<OmniDesignProvider><IconBadgeShowcase /></OmniDesignProvider>); });
  test('Input', () => { render(<OmniDesignProvider><InputShowcase /></OmniDesignProvider>); });
  test('LinearProgress', () => { render(<OmniDesignProvider><LinearProgressShowcase /></OmniDesignProvider>); });
  test('Link', () => { render(<OmniDesignProvider><LinkShowcase /></OmniDesignProvider>); });
  test('List', () => { render(<OmniDesignProvider><ListShowcase /></OmniDesignProvider>); });
  test('Menu', () => { render(<OmniDesignProvider><MenuShowcase /></OmniDesignProvider>); });
  test('Modal', () => { render(<OmniDesignProvider><ModalShowcase /></OmniDesignProvider>); });
  test('NumberField', () => { render(<OmniDesignProvider><NumberFieldShowcase /></OmniDesignProvider>); });
  test('Pagination', () => { render(<OmniDesignProvider><PaginationShowcase /></OmniDesignProvider>); });
  test('Radio', () => { render(<OmniDesignProvider><RadioShowcase /></OmniDesignProvider>); });
  test('Rail', () => { render(<OmniDesignProvider><RailShowcase /></OmniDesignProvider>); });
  test('Rating', () => { render(<OmniDesignProvider><RatingShowcase /></OmniDesignProvider>); });
  test('Ratio', () => { render(<OmniDesignProvider><RatioShowcase /></OmniDesignProvider>); });
  test('SearchField', () => { render(<OmniDesignProvider><SearchFieldShowcase /></OmniDesignProvider>); });
  test('Section', () => { render(<OmniDesignProvider><SectionShowcase /></OmniDesignProvider>); });
  test('Select', () => { render(<OmniDesignProvider><SelectShowcase /></OmniDesignProvider>); });
  test('Sheet', () => { render(<OmniDesignProvider><SheetShowcase /></OmniDesignProvider>); });
  test('Slider', () => { render(<OmniDesignProvider><SliderShowcase /></OmniDesignProvider>); });
  test('Snackbar', () => { render(<OmniDesignProvider><SnackbarShowcase /></OmniDesignProvider>); });
  test('SpeedDial', () => { render(<OmniDesignProvider><SpeedDialShowcase /></OmniDesignProvider>); });
  test('Stack', () => { render(<OmniDesignProvider><StackShowcase /></OmniDesignProvider>); });
  test('Stepper', () => { render(<OmniDesignProvider><StepperShowcase /></OmniDesignProvider>); });
  test('Swatch', () => { render(<OmniDesignProvider><SwatchShowcase /></OmniDesignProvider>); });
  test('Switch', () => { render(<OmniDesignProvider><SwitchShowcase /></OmniDesignProvider>); });
  test('Table', () => { render(<OmniDesignProvider><TableShowcase /></OmniDesignProvider>); });
  test('Tabs', () => { render(<OmniDesignProvider><TabsShowcase /></OmniDesignProvider>); });
  test('Tag', () => { render(<OmniDesignProvider><TagShowcase /></OmniDesignProvider>); });
  test('ToggleButtonGroup', () => { render(<OmniDesignProvider><ToggleButtonGroupShowcase /></OmniDesignProvider>); });
  test('Toolbar', () => { render(<OmniDesignProvider><ToolbarShowcase /></OmniDesignProvider>); });
  test('Tooltip', () => { render(<OmniDesignProvider><TooltipShowcase /></OmniDesignProvider>); });
  test('TransferList', () => { render(<OmniDesignProvider><TransferListShowcase /></OmniDesignProvider>); });
  test('TreeView', () => { render(<OmniDesignProvider><TreeViewShowcase /></OmniDesignProvider>); });
  test('Typography', () => { render(<OmniDesignProvider><TypographyShowcase /></OmniDesignProvider>); });
});
