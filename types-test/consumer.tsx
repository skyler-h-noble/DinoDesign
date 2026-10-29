// The page a consumer actually writes — each line here failed to compile
// against 0.21.0's types (props typed required, Grid typed `boolean`).
import {
  OmniDesignProvider, OMNI_DEFAULT_THEME_URL, ThemedZone, AppBar, Section, Container, Grid,
  VStack, HStack, Card, CardContent, Button, Link, Footer, Chip, Avatar, IconBadge, Divider,
  H1, H2, H3, Body, BodySmall, Subtitle, Caption, Eyebrow, DisplayLarge, Icon,
} from '@omni-design/components';

export function Page() {
  return (
    <OmniDesignProvider themeURL={OMNI_DEFAULT_THEME_URL}>
      <ThemedZone theme="App-Bar" surface="Surface-Bright" as="header">
        <AppBar mode="desktop" brand="OmniDesign" endSlot={<Button variant="default" size="small">Go</Button>} />
        <AppBar brand="OmniDesign" collapseAt={600} menuType="auto"
                navLinks={[{ label: 'Features', href: '#features' }, 'Pricing', { label: 'Blog', onClick: () => {} }]} />
      </ThemedZone>
      <Section theme="Primary" surface="Surface" padding="80px 24px" id="hero">
        <Container maxWidth="lg">
          <VStack spacing={2} alignItems="center">
            <Eyebrow>Eyebrow</Eyebrow>
            <DisplayLarge component="h1">Headline</DisplayLarge>
            <H1>H1</H1>
            <Body color="quiet">Body</Body>
            <HStack spacing={1}>
              <Button variant="default" onClick={() => {}}>Primary</Button>
              <Link onClick={() => {}}>Link</Link>
            </HStack>
          </VStack>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card style={{ height: '100%' }}>
                <IconBadge color="primary"><Icon>home</Icon></IconBadge>
                <Subtitle>Card title</Subtitle>
                <BodySmall color="quiet">Card body</BodySmall>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent><H3>With content</H3></CardContent></Card>
            </Grid>
          </Grid>
          <Divider />
          <Chip label="Chip" />
          <Avatar initials="1" color="tertiary" />
          <H2>H2</H2>
          <Caption>Caption</Caption>
        </Container>
      </Section>
      <Footer brand="OmniDesign" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]} copyrightName="OmniDesign" />
    </OmniDesignProvider>
  );
}
