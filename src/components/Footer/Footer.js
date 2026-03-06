// src/components/Footer/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
} from '@mui/material';
import { Divider } from '../Divider';

/**
 * Footer Component
 * Main footer with links and copyright information
 * Uses design system variables for styling
 * 
 * @param {string} surface - Surface variant: Container, Surface, Dim (default: Container)
 * @param {ReactNode} children - Custom footer content
 * @param {object} sx - Additional MUI sx props
 * @param {object} ...props - Other props
 */
export function Footer({
  surface = 'Container',
  children,
  sx = {},
  ...props
}) {
  const surfaceVar = `var(--${surface})`;

  return (
    <Box
      component="footer"
      {...props}
      sx={{
        backgroundColor: surfaceVar,
        borderTop: '1px solid var(--Border-Variant)',
        marginTop: 'var(--Spacing-8)',
        paddingY: 'var(--Spacing-6)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
    >
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
}

/**
 * Footer Layout Component
 * Standard footer layout with multiple columns
 * 
 * @param {Array} columns - Array of {title, links} objects
 * @param {string} copyrightText - Copyright text
 * @param {string} buildText - Build credit text
 * @param {object} props - Additional props
 */
export function FooterLayout({
  columns = [],
  copyrightText = '© 2024 MyApp. All rights reserved.',
  buildText = 'Built with React & Material-UI',
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={4}>
      {/* Footer Content */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        justifyContent="space-between"
      >
        {columns.map((column, index) => (
          <Stack key={index} spacing={1}>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--Text)',
                fontWeight: 700,
              }}
            >
              {column.title}
            </Typography>
            {column.links.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                href={link.href || '#'}
                sx={{
                  color: 'var(--Text)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: 'var(--Primary-Color-11)',
                  },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        ))}
      </Stack>

      <Divider />

      {/* Copyright */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'var(--Text-Secondary)',
          }}
        >
          {copyrightText}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--Text-Secondary)',
          }}
        >
          {buildText}
        </Typography>
      </Stack>
    </Stack>
  );
}

/**
 * Minimal Footer Component
 * Simple footer with just copyright
 * 
 * @param {string} copyrightText - Copyright text
 * @param {object} props - Additional props
 */
export function MinimalFooter({
  copyrightText = '© 2024 MyApp. All rights reserved.',
  sx = {},
  ...props
}) {
  return (
    <Box
      component="footer"
      {...props}
      sx={{
        backgroundColor: 'var(--Container)',
        borderTop: '1px solid var(--Border-Variant)',
        paddingY: 'var(--Spacing-4)',
        marginTop: 'var(--Spacing-8)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            color: 'var(--Text-Secondary)',
            textAlign: 'center',
          }}
        >
          {copyrightText}
        </Typography>
      </Container>
    </Box>
  );
}

/**
 * Social Footer Component
 * Footer with social media links
 * 
 * @param {Array} socials - Array of {label, href, icon} objects
 * @param {object} props - Additional props
 */
export function SocialFooter({
  socials = [],
  sx = {},
  ...props
}) {
  return (
    <Box
      component="footer"
      {...props}
      sx={{
        backgroundColor: 'var(--Container)',
        borderTop: '1px solid var(--Border-Variant)',
        paddingY: 'var(--Spacing-4)',
        marginTop: 'var(--Spacing-8)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center">
          <Stack direction="row" spacing={2} justifyContent="center">
            {socials.map((social, index) => (
              <Link
                key={index}
                href={social.href || '#'}
                sx={{
                  color: 'var(--Text)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: 'var(--Primary-Color-11)',
                  },
                }}
              >
                {social.label}
              </Link>
            ))}
          </Stack>
          <Divider />
          <Typography
            variant="body2"
            sx={{
              color: 'var(--Text-Secondary)',
            }}
          >
            © 2024 MyApp. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

/**
 * Multi Column Footer Component
 * Footer with company info, links, and newsletter signup
 * 
 * @param {object} company - {name, description}
 * @param {Array} columns - Column data
 * @param {object} props - Additional props
 */
export function MultiColumnFooter({
  company = {
    name: 'MyApp',
    description: 'Building amazing products',
  },
  columns = [],
  sx = {},
  ...props
}) {
  return (
    <Box
      component="footer"
      {...props}
      sx={{
        backgroundColor: 'var(--Container)',
        borderTop: '1px solid var(--Border-Variant)',
        paddingY: 'var(--Spacing-8)',
        marginTop: 'var(--Spacing-8)',
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Top Section - Company Info + Columns */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
          >
            {/* Company Info */}
            <Stack spacing={1} sx={{ maxWidth: '250px' }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'var(--Text)',
                  fontWeight: 700,
                }}
              >
                {company.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--Text-Secondary)',
                }}
              >
                {company.description}
              </Typography>
            </Stack>

            {/* Columns */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              flex={1}
            >
              {columns.map((column, index) => (
                <Stack key={index} spacing={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--Text)',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    {column.title}
                  </Typography>
                  {column.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href || '#'}
                      sx={{
                        color: 'var(--Text)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease-in-out',
                        '&:hover': {
                          color: 'var(--Primary-Color-11)',
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Divider />

          {/* Bottom Section - Copyright */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'var(--Text-Secondary)',
              }}
            >
              © 2024 {company.name}. All rights reserved.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--Text-Secondary)',
              }}
            >
              Built with React & Material-UI
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
