// GENERATED from the @example tags in types/ by scripts/check-api-examples.mjs.
// Every example in docs/API.md must compile against the published types.
import * as React from 'react';
import { AltDisplayLarge, AppBar, Avatar, Body, BodySmall, Button, ButtonText, Caption, Card, Chip, Container, DisplayLarge, Eyebrow, Footer, Grid, H2, HStack, Icon, IconBadge, Label, Link, NumberLarge, Section, Subtitle, TextField, ToggleButtonGroup, Typography, VStack } from '@omni-design/components';
import CheckCircleIcon from '@omni-design/icons/CheckCircle';
import DeleteIcon from '@omni-design/icons/Delete';
import HomeIcon from '@omni-design/icons/Home';

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
<Section theme="Primary" surface="Surface" padding="80px 24px">
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
