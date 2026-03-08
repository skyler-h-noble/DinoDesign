import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'var(--Primary-Color-11)',
      light: 'var(--Hover-Primary-Color-11)',
      lighter: 'var(--Hover-Primary-Color-11)',
      dark: 'var(--Active-Primary-Color-11)',
      darker: 'var(--Active-Primary-Color-11)',
      contrastText: 'var(--Text-Primary-Color-11)',
    },
    
    secondary: {
      main: 'var(--Secondary-Color-11)',
      light: 'var(--Hover-Secondary-Color-11)',
      darker: 'var(--Active-Secondary-Color-11)',
      contrastText: 'var(--Text-Secondary-Color-11)',
    },

    tertiary: {
      main: 'var(--Tertiary-Color-11)',
      light: 'var(--Hover-Tertiary-Color-11)',
      darker: 'var(--Active-Tertiary-Color-11)',
      contrastText: 'var(--Text-Tertiary-Color-11)',
    },
    
    error: {
      main: 'var(--Error-Color-11)',
      light: 'var(--Hover-Error-Color-11)',
      dark: 'var(--Active-Error-Color-11)',
      contrastText: 'var(--Text-Error-Color-11)',
    },
    
    warning: {
      main: 'var(--Warning-Color-11)',
      light: 'var(--Hover-Warning-Color-11)',
      dark: 'var(--Active-Warning-Color-11)',
      contrastText: 'var(--Text-Warning-Color-11)',
    },
    
    info: {
      main: 'var(--Info-Color-11)',
      light: 'var(--Hover-Info-Color-11)',
      dark: 'var(--Active-Info-Color-11)',
      contrastText: 'var(--Text-Info-Color-11)',
    },
    
    success: {
      main: 'var(--Success-Color-11)',
      light: 'var(--Hover-Success-Color-11)',
      dark: 'var(--Active-Success-Color-11)',
      contrastText: 'var(--Text-Success-Color-11)',
    },
    
    grey: {
      50: 'var(--Neutral-Color-13)',
      100: 'var(--Neutral-Color-12)',
      200: 'var(--Neutral-Color-11)',
      300: 'var(--Neutral-Color-10)',
      400: 'var(--Neutral-Color-9)',
      500: 'var(--Neutral-Color-8)',
      600: 'var(--Neutral-Color-7)',
      700: 'var(--Neutral-Color-6)',
      800: 'var(--Neutral-Color-5)',
      900: 'var(--Neutral-Color-4)',
      A100: 'var(--Neutral-Color-3)',
      A200: 'var(--Neutral-Color-2)',
      A400: 'var(--Neutral-Color-1)',
    },
    
    background: {
      default: 'var(--Surface)',
      paper: 'var(--Container)',
    },
    
    text: {
      primary: 'var(--Text)',
      secondary: 'var(--Text-Quiet)',
      disabled: 'color-mix(in oklab, var(--Text), 37%, var(--Background))'
    },
    
    action: {
      active: 'var(--Buttons-Primary-Button)',
      hover: 'var(--Buttons-Primary-Hover)',
      selected: 'var(--Buttons-Primary-Active)',
      disabled: 'color-mix(in oklab, var(--Buttons-Primary-Button), 37%, var(--Background))',
      disabledBackground: 'var(--Neutral-Color-11)',
      focus: 'var(--Buttons-Primary-Active)',
    },
    
    divider: 'var(--Border-Variant)',
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    
    h1: {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '-1px',
    },
    
    h2: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-1px',
    },
    
    h3: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.286,
      letterSpacing: '-0.5px',
    },
    
    h4: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.333,
      letterSpacing: '-0.5px',
    },
    
    h5: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0px',
    },
    
    h6: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: 1.444,
      letterSpacing: '0px',
    },
    
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0px',
    },
    
    button: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '0px',
      textTransform: 'none',
    },
    
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.667,
      letterSpacing: '0.4px',
    },
    
    overline: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: 1.667,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    
    subtitle1: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0px',
    },
    
    subtitle2: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.571,
      letterSpacing: '0.1px',
    },
  },
  
  spacing: 8,
  
  shape: {
    borderRadius: 4,
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          minHeight: '32px',
          padding: '0 16px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
          },
          '&:focus-visible': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});