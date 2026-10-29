// GENERATED from CLAUDE.md section 4 by scripts/check-quickstart.mjs — the
// quickstart example must compile against the published types.

import {
  AppBar, Section, Container, Grid, VStack, Card, Button, Footer,
  DisplayLarge, H2, Subtitle, Body, BodySmall, Eyebrow, IconBadge,
} from '@omni-design/components';
import HomeIcon from '@mui/icons-material/Home';


export function QuickstartPage() {
  return (
<>
  <AppBar brand="Acme"
          navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]}
          endSlot={<Button variant="default" size="small">Get started</Button>} />

  <Section theme="Default" surface="Surface" padding="80px 24px">
    <Container maxWidth="md">
      <VStack spacing={2} alignItems="center" style={{ textAlign: 'center' }}>
        <Eyebrow>Eyebrow</Eyebrow>
        <DisplayLarge component="h1">Headline</DisplayLarge>
        <Body color="quiet">Supporting copy.</Body>
        <Button variant="default" size="large">Primary action</Button>
      </VStack>
    </Container>
  </Section>

  <Section theme="Secondary" surface="Surface" padding="80px 24px" id="features">
    <Container maxWidth="lg">
      <H2>Features</H2>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card style={{ height: '100%' }}>
            <IconBadge color="primary"><HomeIcon /></IconBadge>
            <Subtitle>Card title</Subtitle>
            <BodySmall color="quiet">One sentence.</BodySmall>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Section>

  <Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]}
          copyrightName="Acme" />
</>
  );
}
