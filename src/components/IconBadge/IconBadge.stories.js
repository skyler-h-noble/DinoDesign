// src/components/IconBadge/IconBadge.stories.js
import React from 'react';
import { IconBadge } from './IconBadge';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default {
  title: 'Components/IconBadge',
  component: IconBadge,
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'white', 'black', 'info', 'success', 'warning', 'error'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'light', 'dark'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

const Template = (args) => (
  <IconBadge {...args}>
    <HomeIcon />
  </IconBadge>
);

export const Default = Template.bind({});
Default.args = { color: 'primary', variant: 'solid', size: 'medium' };

export const Light = Template.bind({});
Light.args = { color: 'primary', variant: 'light', size: 'medium' };

export const Dark = Template.bind({});
Dark.args = { color: 'primary', variant: 'dark', size: 'medium' };

export const AllColors = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    {['default', 'primary', 'secondary', 'tertiary', 'neutral', 'white', 'black', 'info', 'success', 'warning', 'error'].map(color => (
      <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <IconBadge color={color}><HomeIcon /></IconBadge>
        <span style={{ fontSize: 10, color: 'var(--Quiet)' }}>{color}</span>
      </div>
    ))}
  </div>
);

export const AllSizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <IconBadge size="small" color="primary"><CodeIcon /></IconBadge>
    <IconBadge size="medium" color="primary"><CodeIcon /></IconBadge>
    <IconBadge size="large" color="primary"><CodeIcon /></IconBadge>
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    {['solid', 'light', 'dark'].map(v => (
      <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <IconBadge color="primary" variant={v}><CheckCircleOutlineIcon /></IconBadge>
        <span style={{ fontSize: 10, color: 'var(--Quiet)' }}>{v}</span>
      </div>
    ))}
  </div>
);
