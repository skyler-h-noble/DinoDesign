// src/components/Stepper/Stepper.stories.js
import React from 'react';
import { Stepper, Step } from './Stepper';
import { Box, Stack } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default { title: 'Navigation/Stepper', component: Stepper };

const LABELS = ['Order placed', 'Processing', 'Shipped', 'Delivered'];

export const Default = {
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Stepper activeStep={1}>
        {LABELS.map((l, i) => <Step key={i} label={l} />)}
      </Stepper>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={6} sx={{ p: 4, width: '100%' }}>
      {['small', 'medium', 'large'].map((s) => (
        <Box key={s}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s}</Box>
          <Stepper size={s} activeStep={1}>
            {LABELS.map((l, i) => <Step key={i} label={l} />)}
          </Stepper>
        </Box>
      ))}
    </Stack>
  ),
};

export const Colors = {
  name: 'All Colors',
  render: () => (
    <Stack spacing={4} sx={{ p: 4, width: '100%' }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Box key={c}>
          <Box sx={{ mb: 1, fontSize: '12px', color: 'var(--Text-Quiet)' }}>{c}</Box>
          <Stepper color={c} activeStep={1}>
            {['Step 1', 'Step 2', 'Step 3'].map((l, i) => <Step key={i} label={l} />)}
          </Stepper>
        </Box>
      ))}
    </Stack>
  ),
};

export const Vertical = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 300 }}>
      <Stepper orientation="vertical" activeStep={2}>
        {LABELS.map((l, i) => <Step key={i} label={l} />)}
      </Stepper>
    </Box>
  ),
};

export const WithIcons = {
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Stepper activeStep={1}>
        <Step label="Order" icon={<ShoppingCartIcon sx={{ fontSize: 'inherit' }} />} />
        <Step label="Payment" icon={<PaymentIcon sx={{ fontSize: 'inherit' }} />} />
        <Step label="Shipping" icon={<LocalShippingIcon sx={{ fontSize: 'inherit' }} />} />
      </Stepper>
    </Box>
  ),
};

export const Clickable = {
  render: () => {
    const [active, setActive] = React.useState(1);
    return (
      <Box sx={{ p: 4, width: '100%' }}>
        <Stepper activeStep={active} clickable onStepClick={setActive}>
          {LABELS.map((l, i) => <Step key={i} label={l} />)}
        </Stepper>
      </Box>
    );
  },
};

export const DashedIncomplete = {
  name: 'Dashed Incomplete Connectors',
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Stepper activeStep={1} dashedIncomplete>
        {LABELS.map((l, i) => <Step key={i} label={l} />)}
      </Stepper>
    </Box>
  ),
};

export const SixSteps = {
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Stepper activeStep={3}>
        {['Cart', 'Address', 'Payment', 'Review', 'Confirm', 'Done'].map((l, i) => (
          <Step key={i} label={l} />
        ))}
      </Stepper>
    </Box>
  ),
};

export const VerticalClickableWithIcons = {
  name: 'Vertical + Clickable + Icons + Dashed',
  render: () => {
    const [active, setActive] = React.useState(1);
    return (
      <Box sx={{ p: 4, maxWidth: 300 }}>
        <Stepper orientation="vertical" color="success" activeStep={active} clickable onStepClick={setActive} dashedIncomplete>
          <Step label="Order" icon={<ShoppingCartIcon sx={{ fontSize: 'inherit' }} />} />
          <Step label="Payment" icon={<PaymentIcon sx={{ fontSize: 'inherit' }} />} />
          <Step label="Shipping" icon={<LocalShippingIcon sx={{ fontSize: 'inherit' }} />} />
        </Stepper>
      </Box>
    );
  },
};

export const CompletedAllSteps = {
  name: 'All Steps Completed',
  render: () => (
    <Box sx={{ p: 4, width: '100%' }}>
      <Stepper activeStep={3}>
        {['Step 1', 'Step 2', 'Step 3', 'Step 4'].map((l, i) => <Step key={i} label={l} />)}
      </Stepper>
    </Box>
  ),
};
