// src/components/IconBadge/IconBadgeShowcase.js
import React, { useState } from 'react';
import { IconBadge } from './IconBadge';
import { Button } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { H2, H3, BodySmall, Label } from '../Typography';
import { VStack, HStack } from '../Stack/Stack';
import { Card } from '../Card/Card';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import GridViewIcon from '@mui/icons-material/GridView';
import ComputerIcon from '@mui/icons-material/Computer';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary'] },
  { label: 'Core', colors: ['white', 'black'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

const ICONS = [HomeIcon, CodeIcon, CheckCircleOutlineIcon, StarIcon, GridViewIcon, ComputerIcon];

export function IconBadgeShowcase() {
  const [color, setColor] = useState('primary');
  const [variant, setVariant] = useState('solid');
  const [size, setSize] = useState('medium');

  const IconComp = ICONS[0];

  return (
    <VStack spacing={4} style={{ paddingBottom: 64 }}>
      <H2>Icon Badge</H2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Preview */}
        <Card padding="medium">
          <VStack spacing={4} alignItems="center">
            {/* Main preview */}
            <div style={{ padding: 40 }}>
              <IconBadge color={color} variant={variant} size={size}>
                <IconComp />
              </IconBadge>
            </div>

            {/* All sizes */}
            <HStack spacing={4} alignItems="flex-end">
              {['small', 'medium', 'large'].map((s) => (
                <VStack key={s} spacing={1} alignItems="center">
                  <IconBadge color={color} variant={variant} size={s}>
                    <IconComp />
                  </IconBadge>
                  <BodySmall style={{ color: 'var(--Quiet)' }}>{cap(s)}</BodySmall>
                </VStack>
              ))}
            </HStack>

            {/* All variants for current color */}
            <VStack spacing={1} alignItems="center">
              <BodySmall style={{ color: 'var(--Quiet)', fontWeight: 600, fontSize: '0.7rem' }}>Variants</BodySmall>
              <HStack spacing={3}>
                {['solid', 'light', 'dark'].map((v) => (
                  <VStack key={v} spacing={1} alignItems="center">
                    <IconBadge color={color} variant={v} size="medium">
                      <IconComp />
                    </IconBadge>
                    <BodySmall style={{ color: 'var(--Quiet)', fontSize: '0.65rem' }}>{cap(v)}</BodySmall>
                  </VStack>
                ))}
              </HStack>
            </VStack>

            {/* All colors grid */}
            <VStack spacing={1} alignItems="center">
              <BodySmall style={{ color: 'var(--Quiet)', fontWeight: 600, fontSize: '0.7rem' }}>All Colors</BodySmall>
              <HStack spacing={2} style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                {COLOR_GROUPS.flatMap(g => g.colors).map((c) => (
                  <VStack key={c} spacing={0} alignItems="center">
                    <IconBadge color={c} variant={variant} size="small">
                      <IconComp />
                    </IconBadge>
                    <BodySmall style={{ color: 'var(--Quiet)', fontSize: '0.55rem' }}>{cap(c)}</BodySmall>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </VStack>
        </Card>

        {/* Controls */}
        <Card padding="medium">
          <VStack spacing={4}>
            <H3 style={{ fontSize: '1rem' }}>Playground</H3>

            {/* Color */}
            <VStack spacing={2}>
              <Label>Color</Label>
              {COLOR_GROUPS.map((group) => (
                <VStack key={group.label} spacing={1}>
                  <BodySmall style={{ color: 'var(--Quiet)', fontWeight: 600, fontSize: '0.7rem' }}>{group.label}</BodySmall>
                  <HStack spacing={1}>
                    {group.colors.map((c) => (
                      <Button
                        key={c}
                        variant={color === c ? 'default' : 'outline'}
                        size="small"
                        onClick={() => setColor(c)}
                      >
                        {cap(c)}
                      </Button>
                    ))}
                  </HStack>
                </VStack>
              ))}
            </VStack>

            {/* Variant */}
            <VStack spacing={1}>
              <Label>Variant</Label>
              <ButtonGroup size="small">
                {['solid', 'light', 'dark'].map((v) => (
                  <Button
                    key={v}
                    variant={variant === v ? 'default' : 'outline'}
                    size="small"
                    onClick={() => setVariant(v)}
                  >
                    {cap(v)}
                  </Button>
                ))}
              </ButtonGroup>
            </VStack>

            {/* Size */}
            <VStack spacing={1}>
              <Label>Size</Label>
              <ButtonGroup size="small">
                {['small', 'medium', 'large'].map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? 'default' : 'outline'}
                    size="small"
                    onClick={() => setSize(s)}
                  >
                    {cap(s)}
                  </Button>
                ))}
              </ButtonGroup>
            </VStack>

            {/* Token info */}
            <VStack spacing={0}>
              <BodySmall style={{ color: 'var(--Quiet)' }}>data-theme: {cap(color)}{variant === 'light' ? '-Light' : ''}</BodySmall>
              <BodySmall style={{ color: 'var(--Quiet)' }}>data-surface: {variant === 'dark' ? 'Surface-Dimmest' : 'Surface'}</BodySmall>
              <BodySmall style={{ color: 'var(--Quiet)' }}>bg: var(--Background)</BodySmall>
              <BodySmall style={{ color: 'var(--Quiet)' }}>icon: var(--Text)</BodySmall>
            </VStack>
          </VStack>
        </Card>
      </div>
    </VStack>
  );
}

export default IconBadgeShowcase;
