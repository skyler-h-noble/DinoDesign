// GENERATED from the @example tags in types/ by scripts/check-api-examples.mjs.
// Every example in docs/API.md must compile against the published types.
import * as React from 'react';
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Alert, AlertDialog, AltDisplayLarge, AppBar, AutoHeading, Autocomplete, Avatar, AvatarGroup, Badge, BarChart, BevelText, Body, BodySmall, BottomNavigation, Box, BrandIcon, BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, ButtonText, Caption, Card, CardActions, CardContent, CarouselDot, CarouselDots, Checkbox, Chip, CircularProgress, CodeBlock, Colors, Container, CopyButton, Copyright, CurvedText, DatePicker, DayCell, Dialog, DisplayLarge, Divider, DotsLoader, Drawer, DrawerClose, DrawerContent, DrawerHeader, DropZone, Dropdown, EmailTextField, ErrorTag, Eyebrow, Fab, FieldButton, FieldGroup, Footer, FormDialog, FormHelper, FormLabel, Ghost, Grid, H1, H2, H3, H6, HStack, HeadingLevel, Icon, IconBadge, ImagePlaceholder, InputDecorator, InputMessage, Label, LightTreeView, LineChart, LinearLoader, LinearProgress, Link, LinkGroup, List, ListItem, ListItemDecorator, Loader, MainLayout, Menu, MenuButton, MenuDivider, MenuItem, MiniSwatch, Modal, NumberField, NumberLarge, OmniDesignProvider, OmniTreeView, OverlayLoader, PageLoader, Pagination, Paper, PasswordTextField, PieChart, Player, Popover, PrimaryToggleButtonGroup, Quote, Radio, RadioGroup, Rail, RailItem, RailSectionTitle, RangeSlider, Rating, Ratio, ResponsiveStack, SearchField, Section, Select, SelectableCard, SettingsPanel, Shape, ShapeButton, Sheet, Sidebar, SkeletonCard, SkeletonLoader, SkipLink, Slider, Snackbar, SpaceBetweenStack, Spacing, SpeedDial, StackDivider, StateMessage, Step, Stepper, Subtitle, Surfaced, Swatch, SwatchField, Switch, Tab, TabList, TabPanel, Table, Tabs, Tag, TextArea, TextAreaField, TextField, TextFieldGroup, TextInput, ThemedZone, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, TreeBranch, Typography, VStack } from '@omni-design/components';
import AddIcon from '@omni-design/icons/Add';
import CheckCircleIcon from '@omni-design/icons/CheckCircle';
import DeleteIcon from '@omni-design/icons/Delete';
import EditIcon from '@omni-design/icons/Edit';
import FavoriteIcon from '@omni-design/icons/Favorite';
import FormatBoldIcon from '@omni-design/icons/FormatBold';
import FormatItalicIcon from '@omni-design/icons/FormatItalic';
import HomeIcon from '@omni-design/icons/Home';
import InboxIcon from '@omni-design/icons/Inbox';
import MenuBookIcon from '@omni-design/icons/MenuBook';
import NoteAddIcon from '@omni-design/icons/NoteAdd';
import NotificationsIcon from '@omni-design/icons/Notifications';
import PaymentIcon from '@omni-design/icons/Payment';
import PersonIcon from '@omni-design/icons/Person';
import PhotoCameraIcon from '@omni-design/icons/PhotoCamera';
import SearchIcon from '@omni-design/icons/Search';
import VisibilityIcon from '@omni-design/icons/Visibility';

declare const open: boolean;
declare const setOpen: (open: boolean) => void;
declare const value: any;
declare const setValue: (value: any) => void;
declare const text: string;
declare const setText: (text: string) => void;
declare const checked: boolean;
declare const setChecked: (checked: boolean) => void;
declare const page: number;
declare const setPage: (page: number) => void;
declare const anchorRef: React.RefObject<HTMLButtonElement>;

// SectionProps (Section)
export const Example_SectionProps = () => (
<>
<Section theme="Primary" surface="Surface" padding="large">
  <H2>Title</H2>
</Section>
</>
);

// ContainerProps (Container)
export const Example_ContainerProps = () => (
<>
<Container maxWidth="md"><Body>Centered.</Body></Container>
</>
);

// GridProps (Grid)
export const Example_GridProps = () => (
<>
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 4 }}><Card>One</Card></Grid>
  <Grid size={{ xs: 12, md: 8 }}><Card>Two</Card></Grid>
</Grid>
</>
);

// StackProps (VStack)
export const Example_StackProps = () => (
<>
<VStack spacing={2} alignItems="center">
  <H2>Title</H2>
  <HStack spacing={1}><Button>One</Button><Button>Two</Button></HStack>
</VStack>
</>
);

// CardProps (Card)
export const Example_CardProps = () => (
<>
<Card elevated>
  <Subtitle>Card title</Subtitle>
  <BodySmall color="quiet">One sentence.</BodySmall>
</Card>
</>
);

// ButtonProps (Button)
export const Example_ButtonProps = () => (
<>
<HStack spacing={1}>
  <Button variant="default" onClick={() => {}}>Save</Button>
  <Button variant="default-outline">Cancel</Button>
  <Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button>
</HStack>
</>
);

// ToggleButtonGroupProps (ToggleButtonGroup)
export const Example_ToggleButtonGroupProps = () => (
<>
<ToggleButtonGroup value={value} onChange={setValue} size="small">
  <Button value="list" size="small">List</Button>
  <Button value="grid" size="small">Grid</Button>
</ToggleButtonGroup>
</>
);

// LinkProps (Link)
export const Example_LinkProps = () => (
<>
<Body>Read the <Link href="/docs">docs</Link>.</Body>
</>
);

// SkipLinkProps (SkipLink)
export const Example_SkipLinkProps = () => (
<>
<><SkipLink /><AppBar brand="Acme" /><Section as="main" id="main"><H1>Shop</H1></Section></>
</>
);

// TypographyProps (Typography)
export const Example_TypographyProps = () => (
<>
<Typography textStyle="body-semibold">Semibold body.</Typography>
</>
);

// HeadingTextProps (DisplayLarge)
export const Example_HeadingTextProps = () => (
<>
<><DisplayLarge component="h1">Headline</DisplayLarge><H2 color="primary">Section</H2></>
</>
);

// AutoHeadingProps (AutoHeading)
export const Example_AutoHeadingProps = () => (
<>
<Section padding="large">
  <AutoHeading>Featured</AutoHeading>
  <Card><AutoHeading size="h5">Order summary</AutoHeading></Card>
</Section>
</>
);

// HeadingLevelProps (HeadingLevel)
export const Example_HeadingLevelProps = () => (
<>
<Card>
  <AutoHeading>Checkout</AutoHeading>
  <HeadingLevel><AutoHeading>Shipping</AutoHeading></HeadingLevel>
</Card>
</>
);

// AltDisplayProps (AltDisplayLarge)
export const Example_AltDisplayProps = () => (
<>
<AltDisplayLarge component="h1" altMode="gradient">Big idea</AltDisplayLarge>
</>
);

// BodyProps (Body)
export const Example_BodyProps = () => (
<>
<><Body>Normal copy.</Body><BodySmall color="quiet">Muted note.</BodySmall></>
</>
);

// SubtitleProps (Subtitle)
export const Example_SubtitleProps = () => (
<>
<Subtitle>Card title</Subtitle>
</>
);

// CaptionProps (Caption)
export const Example_CaptionProps = () => (
<>
<Caption color="quiet">Updated 2 hours ago</Caption>
</>
);

// LabelTextProps (Label)
export const Example_LabelTextProps = () => (
<>
<Label>Shipping</Label>
</>
);

// EyebrowProps (Eyebrow)
export const Example_EyebrowProps = () => (
<>
<VStack spacing={1}><Eyebrow>New</Eyebrow><H2>Title</H2></VStack>
</>
);

// NumberTextProps (NumberSmall)
export const Example_NumberTextProps = () => (
<>
<NumberLarge component="p">$49</NumberLarge>
</>
);

// ButtonTextProps (ButtonText)
export const Example_ButtonTextProps = () => (
<>
<ButtonText>Label</ButtonText>
</>
);

// IconProps (Icon)
export const Example_IconProps = () => (
<>
<Icon color="primary" size="small"><CheckCircleIcon /></Icon>
</>
);

// IconBadgeProps (IconBadge)
export const Example_IconBadgeProps = () => (
<>
<IconBadge color="primary" variant="light"><HomeIcon /></IconBadge>
</>
);

// ChipProps (Chip)
export const Example_ChipProps = () => (
<>
<HStack spacing={1}>
  <Chip label="Design" />
  <Chip label="Selected" variant="primary" selected clickable onClick={() => {}} />
</HStack>
</>
);

// AvatarProps (Avatar)
export const Example_AvatarProps = () => (
<>
<HStack spacing={1}><Avatar initials="JD" color="tertiary" /><Avatar src="/me.jpg" alt="Jane Doe" /></HStack>
</>
);

// TextFieldProps (TextField)
export const Example_TextFieldProps = () => (
<>
<TextField label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)} helperText="We never share it." />
</>
);

// FooterProps (Footer)
export const Example_FooterProps = () => (
<>
<Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]} copyrightName="Acme" />
</>
);

// AppBarProps (AppBar)
export const Example_AppBarProps = () => (
<>
<AppBar brand="Acme"
  navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]}
  endSlot={<><Button variant="default-outline" size="small">Log in</Button><Button variant="default" size="small">Sign up</Button></>} />
</>
);

// AccordionGroupProps (AccordionGroup)
export const Example_AccordionGroupProps = () => (
<>
<AccordionGroup>
  <Accordion>
    <AccordionSummary>Shipping</AccordionSummary>
    <AccordionDetails><Body>Ships in 2 days.</Body></AccordionDetails>
  </Accordion>
</AccordionGroup>
</>
);

// AccordionProps (Accordion)
export const Example_AccordionProps = () => (
<>
<Accordion expanded={open} onChange={setOpen}>
  <AccordionSummary>Returns</AccordionSummary>
  <AccordionDetails><Body>30 days.</Body></AccordionDetails>
</Accordion>
</>
);

// AccordionSummaryProps (AccordionSummary)
export const Example_AccordionSummaryProps = () => (
<>
<Accordion>
  <AccordionSummary eyebrow="Step 1" secondary="Pick a plan" startDecorator={<PaymentIcon />}>Billing</AccordionSummary>
  <AccordionDetails><Body>Details.</Body></AccordionDetails>
</Accordion>
</>
);

// AccordionDetailsProps (AccordionDetails)
export const Example_AccordionDetailsProps = () => (
<>
<Accordion>
  <AccordionSummary>FAQ</AccordionSummary>
  <AccordionDetails><Body>Answer.</Body></AccordionDetails>
</Accordion>
</>
);

// SelectableCardProps (SelectableCard)
export const Example_SelectableCardProps = () => (
<>
<SelectableCard selected={checked} onClick={() => setChecked(!checked)}><Subtitle>Pro plan</Subtitle></SelectableCard>
</>
);

// CardPartProps (CardContent)
export const Example_CardPartProps = () => (
<>
<Card>
  <CardContent><Subtitle>Title</Subtitle></CardContent>
  <CardActions><Button size="small">Open</Button></CardActions>
</Card>
</>
);

// PaperProps (Paper)
export const Example_PaperProps = () => (
<>
<Paper surface="Container-High"><Body>Panel</Body></Paper>
</>
);

// BoxProps (Box)
export const Example_BoxProps = () => (
<>
<Box theme="Secondary" surface="Surface-Bright" radius="medium" elevation={2}><Body>Callout</Body></Box>
</>
);

// OmniStackProps (OmniStack)
export const Example_OmniStackProps = () => (
<>
<SpaceBetweenStack><Subtitle>Total</Subtitle><Body>$49</Body></SpaceBetweenStack>
</>
);

// ResponsiveStackProps (ResponsiveStack)
export const Example_ResponsiveStackProps = () => (
<>
<ResponsiveStack spacing={2} breakpoint="md"><Card>One</Card><Card>Two</Card></ResponsiveStack>
</>
);

// StackDividerProps (StackDivider)
export const Example_StackDividerProps = () => (
<>
<VStack><Body>One</Body><StackDivider /><Body>Two</Body></VStack>
</>
);

// RatioProps (Ratio)
export const Example_RatioProps = () => (
<>
<Ratio ratio="16:9" placeholder />
</>
);

// DividerProps (Divider)
export const Example_DividerProps = () => (
<>
<VStack spacing={2}><Body>Above</Body><Divider>or</Divider><Body>Below</Body></VStack>
</>
);

// ListProps (List)
export const Example_ListProps = () => (
<>
<List items={[{ label: 'Inbox', secondary: '3 new' }, { label: 'Sent' }]} dividers />
</>
);

// ListItemProps (ListItem)
export const Example_ListItemProps = () => (
<>
<List>
  <ListItem startDecorator={<Icon size="small"><InboxIcon /></Icon>} secondary="3 new" onClick={() => {}}>Inbox</ListItem>
</List>
</>
);

// ListItemDecoratorProps (ListItemDecorator)
export const Example_ListItemDecoratorProps = () => (
<>
<ListItemDecorator isButton ariaLabel="Delete item" onAction={() => {}}><DeleteIcon /></ListItemDecorator>
</>
);

// TableProps (Table)
export const Example_TableProps = () => (
<>
<Table columns={[{ label: 'Name', field: 'name' }, { label: 'Role', field: 'role' }]}
  rows={[{ name: 'Ada', role: 'Engineer' }, { name: 'Lin', role: 'Designer' }]} stripe="odd" />
</>
);

// BadgeProps (Badge)
export const Example_BadgeProps = () => (
<>
<Badge badgeContent={4}><Icon><NotificationsIcon /></Icon></Badge>
</>
);

// AvatarGroupProps (AvatarGroup)
export const Example_AvatarGroupProps = () => (
<>
<AvatarGroup max={3} people={[{ name: 'Ada Lovelace', initials: 'AL' }, { name: 'Lin Wu', initials: 'LW' }, { name: 'Sam Roe', initials: 'SR' }, { name: 'Kai Ito', initials: 'KI' }]} />
</>
);

// TagProps (Tag)
export const Example_TagProps = () => (
<>
<HStack spacing={1}><Tag color="success">Active</Tag><Tag color="warning" shape="pill">Beta</Tag></HStack>
</>
);

// PresetTagProps (PrimaryTag)
export const Example_PresetTagProps = () => (
<>
<ErrorTag>Overdue</ErrorTag>
</>
);

// TextInputProps (TextInput)
export const Example_TextInputProps = () => (
<>
<TextInput label="Email" type="email" value={text} onChange={(e) => setText(e.target.value)}
  helperText="We never share it." validation="error" validationMessage="Enter a valid email." />
</>
);

// InputDecoratorProps (InputDecorator)
export const Example_InputDecoratorProps = () => (
<>
<TextInput label="Password" type="password"
  endAdornment={<InputDecorator aria-label="Show password"><VisibilityIcon /></InputDecorator>} />
</>
);

// TextFieldPresetProps (EmailTextField)
export const Example_TextFieldPresetProps = () => (
<>
<><EmailTextField value={text} onChange={(e) => setText(e.target.value)} /><PasswordTextField /></>
</>
);

// TextAreaProps (TextArea)
export const Example_TextAreaProps = () => (
<>
<TextArea label="Message" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
</>
);

// TextFieldGroupProps (TextFieldGroup)
export const Example_TextFieldGroupProps = () => (
<>
<TextFieldGroup fields={[{ id: 'first', label: 'First name' }, { id: 'last', label: 'Last name' }]} />
</>
);

// TextAreaFieldProps (TextAreaField)
export const Example_TextAreaFieldProps = () => (
<>
<TextAreaField label="Notes" type="optional" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
</>
);

// SearchFieldProps (SearchField)
export const Example_SearchFieldProps = () => (
<>
<SearchField value={text} onChange={(v) => setText(v)} onSubmit={(v) => console.log(v)} ariaLabel="Search products" />
</>
);

// NumberFieldProps (NumberField)
export const Example_NumberFieldProps = () => (
<>
<NumberField label="Quantity" min={1} max={10} value={value} onChange={(n) => setValue(n)} />
</>
);

// FieldButtonProps (FieldButton)
export const Example_FieldButtonProps = () => (
<>
<FieldButton aria-label="Increase"><AddIcon /></FieldButton>
</>
);

// FormLabelProps (FormLabel)
export const Example_FormLabelProps = () => (
<>
<FormLabel htmlFor="email" type="required">Email</FormLabel>
</>
);

// InputMessageProps (InputMessage)
export const Example_InputMessageProps = () => (
<>
<InputMessage type="error">Enter a valid email.</InputMessage>
</>
);

// FormHelperProps (FormHelper)
export const Example_FormHelperProps = () => (
<>
<FormHelper helperText="8+ characters." validation="error" validationMessage="Too short." />
</>
);

// FieldGroupProps (FieldGroup)
export const Example_FieldGroupProps = () => (
<>
<FieldGroup label="Delivery" type="required">
  <Radio name="delivery" value="std" label="Standard" />
  <Radio name="delivery" value="exp" label="Express" />
</FieldGroup>
</>
);

// SelectProps (Select)
export const Example_SelectProps = () => (
<>
<Select label="Size" value={value} onChange={setValue}
  options={[{ value: 's', label: 'Small' }, { value: 'm', label: 'Medium' }, 'Large']} />
</>
);

// AutocompleteProps (Autocomplete)
export const Example_AutocompleteProps = () => (
<>
<Autocomplete label="Country" options={['Canada', 'France', 'Japan']} value={value} onChange={setValue} />
</>
);

// DropZoneProps (DropZone)
export const Example_DropZoneProps = () => (
<>
<DropZone accept="image/*" multiple onFiles={(files) => console.log(files)} label="Drop images here" sublabel="or click to browse" />
</>
);

// SwatchProps (Swatch)
export const Example_SwatchProps = () => (
<>
<Swatch color="rebeccapurple" label="Purple" selected={checked} onClick={() => setChecked(!checked)} />
</>
);

// SwatchFieldProps (SwatchField)
export const Example_SwatchFieldProps = () => (
<>
<SwatchField label="Accent" swatchLabel="Teal" color="teal" onClick={() => {}} />
</>
);

// MiniSwatchProps (MiniSwatch)
export const Example_MiniSwatchProps = () => (
<>
<MiniSwatch color="tomato" />
</>
);

// OmniDesignProviderProps (OmniDesignProvider)
export const Example_OmniDesignProviderProps = () => (
<>
<OmniDesignProvider themeURL="https://example.com/acme/theme.json">
  <Body>App</Body>
</OmniDesignProvider>
</>
);

// ThemedZoneProps (ThemedZone)
export const Example_ThemedZoneProps = () => (
<>
<ThemedZone theme="App-Bar" surface="Surface" as="header">
  <H6>Brand</H6>
</ThemedZone>
</>
);

// SurfacedProps (Surfaced)
export const Example_SurfacedProps = () => (
<>
<Surfaced surface="Container-High"><Body>Text tuned for that level.</Body></Surfaced>
</>
);

// BrandIconProps (BrandIcon)
export const Example_BrandIconProps = () => (
<>
<BrandIcon name="github" title="GitHub" />
</>
);

// QuoteProps (Quote)
export const Example_QuoteProps = () => (
<>
<Quote cite="Priya Shah" detail="Studio Lead, Northwind">It changed how we ship.</Quote>
</>
);

// ShapeProps (Shape)
export const Example_ShapeProps = () => (
<>
<Shape shape="soft-burst" color="warning" width={64}>NEW</Shape>
</>
);

// ImagePlaceholderProps (ImagePlaceholder)
export const Example_ImagePlaceholderProps = () => (
<>
<Ratio ratio="16:9"><ImagePlaceholder /></Ratio>
</>
);

// PlayerProps (Player)
export const Example_PlayerProps = () => (
<>
<Player title="Episode 12" subtitle="The Design Pod" duration={1830}
  playing={checked} onPlayPause={setChecked} position={page} onSeek={setPage} />
</>
);

// CurvedTextProps (CurvedText)
export const Example_CurvedTextProps = () => (
<>
<CurvedText text="Fresh every morning" arc={120} radius={240} />
</>
);

// BevelTextProps (BevelText)
export const Example_BevelTextProps = () => (
<>
<BevelText text="Grand Opening" theme="Secondary" preset="Embossed" />
</>
);

// CopyrightProps (Copyright)
export const Example_CopyrightProps = () => (
<>
<Copyright companyName="Acme" />
</>
);

// CodeBlockProps (CodeBlock)
export const Example_CodeBlockProps = () => (
<>
<CodeBlock code="npm install @omni-design/components" language="bash" />
</>
);

// CopyButtonProps (CopyButton)
export const Example_CopyButtonProps = () => (
<>
<CopyButton code="https://example.com/invite/abc" label="Copy link" />
</>
);

// ColorsProps (Colors)
export const Example_ColorsProps = () => (
<>
<Colors />
</>
);

// SpacingProps (Spacing)
export const Example_SpacingProps = () => (
<>
<Spacing />
</>
);

// SettingsPanelProps (SettingsPanel)
export const Example_SettingsPanelProps = () => (
<>
<SettingsPanel />
</>
);

// BarChartProps (BarChart)
export const Example_BarChartProps = () => (
<>
<BarChart data={[{ value: 12, label: 'Mon' }, { value: 18, label: 'Tue' }, { value: 9, label: 'Wed' }]} label="Orders per day" />
</>
);

// LineChartProps (LineChart)
export const Example_LineChartProps = () => (
<>
<LineChart data={[4, 7, 5, 9, 12]} label="Weekly signups" showGrid />
</>
);

// PieChartProps (PieChart)
export const Example_PieChartProps = () => (
<>
<PieChart donut data={[{ value: 60, label: 'Direct' }, { value: 25, label: 'Search' }, { value: 15, label: 'Social' }]} label="Traffic sources" />
</>
);

// TabsProps (Tabs)
export const Example_TabsProps = () => (
<>
<Tabs value={value} onChange={setValue}>
  <TabList>
    <Tab value="a">Overview</Tab>
    <Tab value="b">Details</Tab>
  </TabList>
  <TabPanel value="a"><Body>Overview panel.</Body></TabPanel>
  <TabPanel value="b"><Body>Details panel.</Body></TabPanel>
</Tabs>
</>
);

// TabListProps (TabList)
export const Example_TabListProps = () => (
<>
<Tabs><TabList><Tab>One</Tab><Tab>Two</Tab></TabList></Tabs>
</>
);

// TabProps (Tab)
export const Example_TabProps = () => (
<>
<Tabs navigation value="home">
  <TabList>
    <Tab value="home" href="/">Home</Tab>
    <Tab value="docs" href="/docs" startDecorator={<MenuBookIcon />}>Docs</Tab>
  </TabList>
</Tabs>
</>
);

// TabPanelProps (TabPanel)
export const Example_TabPanelProps = () => (
<>
<Tabs defaultValue="a">
  <TabList><Tab value="a">A</Tab></TabList>
  <TabPanel value="a"><Body>Panel A</Body></TabPanel>
</Tabs>
</>
);

// BreadcrumbsProps (Breadcrumbs)
export const Example_BreadcrumbsProps = () => (
<>
<Breadcrumbs>
  <Link href="/">Home</Link>
  <Link href="/shop">Shop</Link>
  <BodySmall>Shoes</BodySmall>
</Breadcrumbs>
</>
);

// BreadcrumbItemProps (BreadcrumbItem)
export const Example_BreadcrumbItemProps = () => (
<>
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem>Settings</BreadcrumbItem>
</Breadcrumbs>
</>
);

// PaginationProps (Pagination)
export const Example_PaginationProps = () => (
<>
<Pagination count={12} page={page} onChange={setPage} />
</>
);

// DropdownProps (Dropdown)
export const Example_DropdownProps = () => (
<>
<Dropdown>
  <MenuButton>Actions</MenuButton>
  <Menu>
    <MenuItem onClick={() => {}}>Profile</MenuItem>
    <MenuDivider />
    <MenuItem disabled>Settings</MenuItem>
  </Menu>
</Dropdown>
</>
);

// MenuButtonProps (MenuButton)
export const Example_MenuButtonProps = () => (
<>
<Dropdown><MenuButton variant="default">Sort</MenuButton><Menu><MenuItem>Newest</MenuItem></Menu></Dropdown>
</>
);

// MenuProps (Menu)
export const Example_MenuProps = () => (
<>
<Dropdown><MenuButton>More</MenuButton><Menu placement="bottom-end"><MenuItem>Rename</MenuItem></Menu></Dropdown>
</>
);

// MenuItemProps (MenuItem)
export const Example_MenuItemProps = () => (
<>
<Dropdown>
  <MenuButton>File</MenuButton>
  <Menu><MenuItem startDecorator={<EditIcon />} onClick={() => {}} selected>Edit</MenuItem></Menu>
</Dropdown>
</>
);

// MenuDividerProps (MenuDivider)
export const Example_MenuDividerProps = () => (
<>
<Dropdown><MenuButton>Menu</MenuButton><Menu><MenuItem>A</MenuItem><MenuDivider /><MenuItem>B</MenuItem></Menu></Dropdown>
</>
);

// BottomNavigationProps (BottomNavigation)
export const Example_BottomNavigationProps = () => (
<>
<BottomNavigation value={value} onChange={setValue}
  items={[{ icon: <HomeIcon />, label: 'Home' }, { icon: <SearchIcon />, label: 'Search' }, { icon: <PersonIcon />, label: 'Profile' }]} />
</>
);

// StepperProps (Stepper)
export const Example_StepperProps = () => (
<>
<Stepper activeStep={1}>
  <Step label="Cart" />
  <Step label="Shipping" />
  <Step label="Pay" />
</Stepper>
</>
);

// StepProps (Step)
export const Example_StepProps = () => (
<>
<Stepper activeStep={0}><Step label="Account" icon={<PersonIcon />} /><Step label="Done" /></Stepper>
</>
);

// LinkGroupProps (LinkGroup)
export const Example_LinkGroupProps = () => (
<>
<LinkGroup aria-label="Legal">
  <Link href="/privacy">Privacy</Link>
  <Link href="/terms">Terms</Link>
</LinkGroup>
</>
);

// RailProps (Rail)
export const Example_RailProps = () => (
<>
<Rail value={value} onChange={setValue} brand={<Avatar initials="A" />}
  items={[{ icon: <HomeIcon />, label: 'Home' }, { icon: <InboxIcon />, label: 'Inbox', badge: 3 }]} />
</>
);

// RailItemProps (RailItem)
export const Example_RailItemProps = () => (
<>
<RailItem item={{ icon: <HomeIcon />, label: 'Home' }} selected onClick={() => {}} />
</>
);

// RailSectionTitleProps (RailSectionTitle)
export const Example_RailSectionTitleProps = () => (
<>
<RailSectionTitle title="Projects" expanded />
</>
);

// SidebarProps (Sidebar)
export const Example_SidebarProps = () => (
<>
<Sidebar open={open} onClose={() => setOpen(false)} items={[{ label: 'Home', icon: <HomeIcon /> }]} />
</>
);

// MainLayoutProps (MainLayout)
export const Example_MainLayoutProps = () => (
<>
<MainLayout title="My App" navItems={[{ label: 'Home', icon: <HomeIcon />, path: '/' }]}><Body>Content</Body></MainLayout>
</>
);

// CarouselDotsProps (CarouselDots)
export const Example_CarouselDotsProps = () => (
<>
<CarouselDots count={5} value={page} onChange={setPage} />
</>
);

// CarouselDotProps (CarouselDot)
export const Example_CarouselDotProps = () => (
<>
<CarouselDot selected aria-label="Slide 1 of 3" onClick={() => {}} />
</>
);

// OmniTreeViewProps (OmniTreeView)
export const Example_OmniTreeViewProps = () => (
<>
<OmniTreeView aria-label="Files" defaultExpandedItems={['src']}
  items={[{ id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] }]}
  onSelectedItemsChange={(e, id) => setValue(id)} />
</>
);

// PresetTreeViewProps (SolidTreeView)
export const Example_PresetTreeViewProps = () => (
<>
<LightTreeView aria-label="Docs" color="primary" items={[{ id: 'a', label: 'Intro' }]} />
</>
);

// TreeBranchProps (TreeBranch)
export const Example_TreeBranchProps = () => (
<>
<TreeBranch label="src" level={1} toggle="on" onToggle={() => {}}>
  <TreeBranch label="App.tsx" level={2} />
</TreeBranch>
</>
);

// PopoverProps (Popover)
export const Example_PopoverProps = () => (
<>
<>
  <Button ref={anchorRef} variant="default-outline" onClick={() => setOpen(!open)}>Account</Button>
  <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} aria-label="Account" arrow>
    <Body>Signed in as Jane.</Body>
  </Popover>
</>
</>
);

// DialogProps (Dialog)
export const Example_DialogProps = () => (
<>
<Dialog open={open} onClose={() => setOpen(false)} title="Delete project?"
  actions={<><Button variant="default-outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="error">Delete</Button></>}>
  <Body>This cannot be undone.</Body>
</Dialog>
</>
);

// AlertDialogProps (AlertDialog)
export const Example_AlertDialogProps = () => (
<>
<AlertDialog open={open} onClose={() => setOpen(false)} title="Discard changes?" confirmText="Discard" onConfirm={() => setOpen(false)}>
  <Body>Your edits will be lost.</Body>
</AlertDialog>
</>
);

// FormDialogProps (FormDialog)
export const Example_FormDialogProps = () => (
<>
<FormDialog open={open} onClose={() => setOpen(false)} title="Rename" onSubmit={() => setOpen(false)}>
  <TextField label="Name" value={text} onChange={(e) => setText(e.target.value)} />
</FormDialog>
</>
);

// ModalProps (Modal)
export const Example_ModalProps = () => (
<>
<Modal open={open} onClose={() => setOpen(false)} title="Welcome" actions={<Button onClick={() => setOpen(false)}>Got it</Button>}>
  <Body>Here is what is new.</Body>
</Modal>
</>
);

// DrawerProps (Drawer)
export const Example_DrawerProps = () => (
<>
<Drawer open={open} onClose={() => setOpen(false)} anchor="left">
  <DrawerHeader><Subtitle>Menu</Subtitle><DrawerClose onClick={() => setOpen(false)} /></DrawerHeader>
  <DrawerContent><Link href="/">Home</Link></DrawerContent>
</Drawer>
</>
);

// DrawerCloseProps (DrawerClose)
export const Example_DrawerCloseProps = () => (
<>
<DrawerClose onClick={() => setOpen(false)} />
</>
);

// DrawerSectionProps (DrawerHeader)
export const Example_DrawerSectionProps = () => (
<>
<DrawerContent><Body>Filters</Body></DrawerContent>
</>
);

// SheetProps (Sheet)
export const Example_SheetProps = () => (
<>
<Sheet open={open} onClose={() => setOpen(false)}><Subtitle>Share</Subtitle></Sheet>
</>
);

// TooltipProps (Tooltip)
export const Example_TooltipProps = () => (
<>
<Tooltip title="Delete item"><Button iconOnly variant="ghost" aria-label="Delete item"><DeleteIcon /></Button></Tooltip>
</>
);

// AlertProps (Alert)
export const Example_AlertProps = () => (
<>
<Alert color="success" title="Saved">Your changes are live.</Alert>
</>
);

// SnackbarProps (Snackbar)
export const Example_SnackbarProps = () => (
<>
<Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={4000} color="success">Message sent</Snackbar>
</>
);

// CircularProgressProps (CircularProgress)
export const Example_CircularProgressProps = () => (
<>
<CircularProgress value={60} showValue aria-label="Upload" />
</>
);

// LinearProgressProps (LinearProgress)
export const Example_LinearProgressProps = () => (
<>
<LinearProgress value={40} aria-label="Upload" />
</>
);

// LoaderProps (Loader)
export const Example_LoaderProps = () => (
<>
<Loader type="dual-ring" message="Loading orders" />
</>
);

// LinearLoaderProps (LinearLoader)
export const Example_LinearLoaderProps = () => (
<>
<LinearLoader value={70} label="Importing" />
</>
);

// SkeletonLoaderProps (SkeletonLoader)
export const Example_SkeletonLoaderProps = () => (
<>
<SkeletonLoader rows={3} height={48} />
</>
);

// DotsLoaderProps (DotsLoader)
export const Example_DotsLoaderProps = () => (
<>
<DotsLoader message="Thinking" />
</>
);

// PageLoaderProps (PageLoader)
export const Example_PageLoaderProps = () => (
<>
<PageLoader message="Loading dashboard" />
</>
);

// SkeletonCardProps (SkeletonCard)
export const Example_SkeletonCardProps = () => (
<>
<SkeletonCard lines={2} />
</>
);

// OverlayLoaderProps (OverlayLoader)
export const Example_OverlayLoaderProps = () => (
<>
<OverlayLoader isLoading={checked} message="Saving"><Card>Form</Card></OverlayLoader>
</>
);

// GhostProps (Ghost)
export const Example_GhostProps = () => (
<>
<Ghost active={checked} label="Loading profile"><H3>Jane Doe</H3><Body>Designer</Body></Ghost>
</>
);

// StateMessageProps (StateMessage)
export const Example_StateMessageProps = () => (
<>
<StateMessage type="no-results" title="No matches" body="Try a different filter." action={<Button variant="default-outline">Clear filters</Button>} />
</>
);

// CheckboxProps (Checkbox)
export const Example_CheckboxProps = () => (
<>
<Checkbox label="Email me updates" checked={checked} onChange={(e, next) => setChecked(next)} />
</>
);

// RadioProps (Radio)
export const Example_RadioProps = () => (
<>
<Radio label="Express" value="express" checked={value === 'express'} onChange={() => setValue('express')} />
</>
);

// RadioGroupProps (RadioGroup)
export const Example_RadioGroupProps = () => (
<>
<RadioGroup label="Shipping" value={value} onChange={(e, next) => setValue(next)}
  options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]} />
</>
);

// SwitchProps (SwitchInput)
export const Example_SwitchProps = () => (
<>
<Switch label="Dark mode" checked={checked} onChange={(e, next) => setChecked(next)} />
</>
);

// SliderProps (SliderInput)
export const Example_SliderProps = () => (
<>
<><Slider label="Volume" value={value} onChange={(e, next) => setValue(next)} />
<RangeSlider label="Price" defaultValue={[20, 80]} min={0} max={100} />
<Slider label="Treble" defaultValue={36} orientation="vertical" fill="inverted" style={{ height: 140 }} /></>
</>
);

// RatingProps (RatingInput)
export const Example_RatingProps = () => (
<>
<Rating label="Your rating" value={value} onChange={setValue} precision={0.5} />
</>
);

// DatePickerProps (DatePicker)
export const Example_DatePickerProps = () => (
<>
<DatePicker value={value} onChange={setValue} minDate={new Date(2026, 0, 1)} />
</>
);

// DayCellProps (DayCell)
export const Example_DayCellProps = () => (
<>
<DayCell day={14} selection="selected" onClick={() => {}} aria-label="14 March 2026" />
</>
);

// ToggleButtonProps (ToggleButton)
export const Example_ToggleButtonProps = () => (
<>
<ToggleButton value="bold" selected={checked} onChange={() => setChecked(!checked)} aria-label="Bold"><FormatBoldIcon /></ToggleButton>
</>
);

// ToggleButtonGroupPresetProps (DefaultToggleButtonGroup)
export const Example_ToggleButtonGroupPresetProps = () => (
<>
<PrimaryToggleButtonGroup value={value} onChange={setValue}>
  <Button value="day">Day</Button>
  <Button value="week">Week</Button>
</PrimaryToggleButtonGroup>
</>
);

// ButtonGroupProps (ButtonGroup)
export const Example_ButtonGroupProps = () => (
<>
<ButtonGroup aria-label="Text alignment">
  <Button onClick={() => {}}>Left</Button>
  <Button onClick={() => {}}>Center</Button>
</ButtonGroup>
</>
);

// FabProps (Fab)
export const Example_FabProps = () => (
<>
<Fab ariaLabel="Compose message"><EditIcon /></Fab>
</>
);

// ShapeButtonProps (ShapeButton)
export const Example_ShapeButtonProps = () => (
<>
<ShapeButton shape="cookie-6" morphTo="circle" selected={checked} onClick={() => setChecked(!checked)} aria-label="Add to favorites"><FavoriteIcon /></ShapeButton>
</>
);

// SpeedDialProps (SpeedDial)
export const Example_SpeedDialProps = () => (
<>
<SpeedDial ariaLabel="Create"
  actions={[{ name: 'Note', icon: <NoteAddIcon />, onClick: () => {} }, { name: 'Photo', icon: <PhotoCameraIcon />, onClick: () => {} }]} />
</>
);

// ToolbarProps (Toolbar)
export const Example_ToolbarProps = () => (
<>
<Toolbar value={value} onChange={setValue}
  items={[{ icon: <FormatBoldIcon />, label: 'Bold' }, { icon: <FormatItalicIcon />, label: 'Italic' }]} />
</>
);
