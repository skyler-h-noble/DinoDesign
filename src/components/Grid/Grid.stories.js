// src/components/Grid/Grid.stories.js
import {
  Grid,
  GridContainer,
  GridItem,
  FullWidthGrid,
  HalfWidthGrid,
  ThirdWidthGrid,
  QuarterWidthGrid,
  ResponsiveGrid,
  AutoGrid,
  CenteredGrid,
  ColumnGrid,
} from './Grid';
import { Box, Typography, Paper } from '@mui/material';

export default {
  title: 'Layout/Grid',
  component: Grid,
};

const DemoBox = ({ children }) => (
  <Paper
    sx={{
      p: 2,
      backgroundColor: 'var(--Container)',
      textAlign: 'center',
      minHeight: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography>{children}</Typography>
  </Paper>
);

// Basic Grid
export const Basic = {
  render: () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <DemoBox>Item 1</DemoBox>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DemoBox>Item 2</DemoBox>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DemoBox>Item 3</DemoBox>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DemoBox>Item 4</DemoBox>
      </Grid>
    </Grid>
  ),
};

// GridContainer
export const Container = {
  render: () => (
    <GridContainer spacing={3}>
      <GridItem xs={12} md={6}>
        <DemoBox>Left Column</DemoBox>
      </GridItem>
      <GridItem xs={12} md={6}>
        <DemoBox>Right Column</DemoBox>
      </GridItem>
    </GridContainer>
  ),
};

// FullWidthGrid
export const FullWidth = {
  render: () => (
    <GridContainer>
      <FullWidthGrid>
        <DemoBox>Full Width Item</DemoBox>
      </FullWidthGrid>
      <FullWidthGrid>
        <DemoBox>Another Full Width Item</DemoBox>
      </FullWidthGrid>
    </GridContainer>
  ),
};

// HalfWidthGrid
export const HalfWidth = {
  render: () => (
    <GridContainer>
      <HalfWidthGrid>
        <DemoBox>Half Width 1</DemoBox>
      </HalfWidthGrid>
      <HalfWidthGrid>
        <DemoBox>Half Width 2</DemoBox>
      </HalfWidthGrid>
    </GridContainer>
  ),
};

// ThirdWidthGrid
export const ThirdWidth = {
  render: () => (
    <GridContainer>
      <ThirdWidthGrid>
        <DemoBox>1/3 Width</DemoBox>
      </ThirdWidthGrid>
      <ThirdWidthGrid>
        <DemoBox>1/3 Width</DemoBox>
      </ThirdWidthGrid>
      <ThirdWidthGrid>
        <DemoBox>1/3 Width</DemoBox>
      </ThirdWidthGrid>
    </GridContainer>
  ),
};

// QuarterWidthGrid
export const QuarterWidth = {
  render: () => (
    <GridContainer>
      <QuarterWidthGrid>
        <DemoBox>1/4</DemoBox>
      </QuarterWidthGrid>
      <QuarterWidthGrid>
        <DemoBox>1/4</DemoBox>
      </QuarterWidthGrid>
      <QuarterWidthGrid>
        <DemoBox>1/4</DemoBox>
      </QuarterWidthGrid>
      <QuarterWidthGrid>
        <DemoBox>1/4</DemoBox>
      </QuarterWidthGrid>
    </GridContainer>
  ),
};

// ResponsiveGrid
export const Responsive = {
  render: () => (
    <ResponsiveGrid columns={4} mobileColumns={1} spacing={2}>
      <DemoBox>Card 1</DemoBox>
      <DemoBox>Card 2</DemoBox>
      <DemoBox>Card 3</DemoBox>
      <DemoBox>Card 4</DemoBox>
    </ResponsiveGrid>
  ),
};

// AutoGrid
export const Auto = {
  render: () => (
    <AutoGrid minWidth={200} spacing={2}>
      <DemoBox>Auto 1</DemoBox>
      <DemoBox>Auto 2</DemoBox>
      <DemoBox>Auto 3</DemoBox>
      <DemoBox>Auto 4</DemoBox>
      <DemoBox>Auto 5</DemoBox>
      <DemoBox>Auto 6</DemoBox>
    </AutoGrid>
  ),
};

// CenteredGrid
export const Centered = {
  render: () => (
    <CenteredGrid>
      <GridItem xs={12} md={6}>
        <DemoBox>Centered Content</DemoBox>
      </GridItem>
    </CenteredGrid>
  ),
};

// ColumnGrid
export const ColumnGridStory = {
  render: () => (
    <GridContainer>
      <ColumnGrid columns={8}>
        <DemoBox>8 Columns</DemoBox>
      </ColumnGrid>
      <ColumnGrid columns={4}>
        <DemoBox>4 Columns</DemoBox>
      </ColumnGrid>
    </GridContainer>
  ),
};

// Complex Layout
export const ComplexLayout = {
  render: () => (
    <GridContainer spacing={3}>
      <FullWidthGrid>
        <DemoBox>Header - Full Width</DemoBox>
      </FullWidthGrid>
      
      <ThirdWidthGrid>
        <DemoBox>Sidebar 1</DemoBox>
      </ThirdWidthGrid>
      <ThirdWidthGrid>
        <DemoBox>Sidebar 2</DemoBox>
      </ThirdWidthGrid>
      <ThirdWidthGrid>
        <DemoBox>Sidebar 3</DemoBox>
      </ThirdWidthGrid>

      <HalfWidthGrid>
        <DemoBox>Left Content</DemoBox>
      </HalfWidthGrid>
      <HalfWidthGrid>
        <DemoBox>Right Content</DemoBox>
      </HalfWidthGrid>

      <FullWidthGrid>
        <DemoBox>Footer - Full Width</DemoBox>
      </FullWidthGrid>
    </GridContainer>
  ),
};

// Different Spacings
export const DifferentSpacings = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Spacing 1</Typography>
      <GridContainer spacing={1} sx={{ mb: 4 }}>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
      </GridContainer>

      <Typography variant="h6" sx={{ mb: 3 }}>Spacing 3</Typography>
      <GridContainer spacing={3} sx={{ mb: 4 }}>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
      </GridContainer>

      <Typography variant="h6" sx={{ mb: 3 }}>Spacing 5</Typography>
      <GridContainer spacing={5}>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
        <GridItem xs={12} md={4}><DemoBox>Item</DemoBox></GridItem>
      </GridContainer>
    </Box>
  ),
};
