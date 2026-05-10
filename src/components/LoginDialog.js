// src/components/LoginDialog.js
// Sign-in modal with Google + Email/Password options.

import React, { useState } from 'react';
import { Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../AuthProvider';
import { Button } from './Button/Button';
import { Icon } from './Icon/Icon';
import { Divider } from './Divider/Divider';
import { H5, BodySmall, Caption } from './Typography';

export function LoginDialog({ open, onClose }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!open) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      if (isSignUp) await signUpWithEmail(email, password);
      else await signInWithEmail(email, password);
      onClose();
    } catch (err) {
      setLocalError(err.message?.replace('Firebase: ', '') || 'Sign-in failed');
    }
  };

  const handleGoogle = async () => {
    setLocalError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setLocalError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed');
    }
  };

  const inputSx = {
    width: '100%', padding: '8px 12px', fontSize: '14px', fontFamily: 'inherit',
    border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
    backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
    boxSizing: 'border-box',
    '&:focus': { borderColor: 'var(--Focus-Visible)' },
  };

  return (
    <>
      {/* Backdrop */}
      <Box onClick={onClose} sx={{
        position: 'fixed', inset: 0, zIndex: 2000000000,
        backgroundColor: 'rgba(0,0,0,0.4)',
      }} />

      {/* Dialog */}
      <Box
        data-theme="Default"
        data-surface="Surface-Bright"
        sx={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000000001,
          width: 380, maxWidth: '90vw',
          backgroundColor: 'var(--Background)',
          border: '1px solid var(--Border)',
          borderRadius: 'var(--Style-Border-Radius)',
          boxShadow: 'var(--Effect-Level-4)',
          p: 4,
        }}
      >
        <H5 style={{ marginBottom: 8, textAlign: 'center' }}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </H5>
        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Sign in to manage your design systems
        </Caption>

        {/* Google */}
        <Button variant="default-outline" size="medium" fullWidth onClick={handleGoogle}
          startIcon={<Icon size="small"><GoogleIcon /></Icon>}>
          Continue with Google
        </Button>

        <Box sx={{ my: 3 }}>
          <Divider indicatorText="or" indicatorStyle="outline" color="default" />
        </Box>

        {/* Email form */}
        <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Email</Caption>
            <Box component="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required sx={inputSx} />
          </Box>
          <Box>
            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Password</Caption>
            <Box component="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={6} sx={inputSx} />
          </Box>

          {(localError || error) && (
            <Caption style={{ color: 'var(--Buttons-Error-Button)', display: 'block' }}>
              {localError || error?.message}
            </Caption>
          )}

          <Button variant="primary" size="medium" fullWidth type="submit">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Caption style={{ color: 'var(--Text-Quiet)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Box component="span" onClick={() => setIsSignUp(!isSignUp)}
              sx={{ color: 'var(--Hotlink)', cursor: 'pointer', textDecoration: 'underline' }}>
              {isSignUp ? 'Sign in' : 'Create one'}
            </Box>
          </Caption>
        </Box>
      </Box>
    </>
  );
}

export default LoginDialog;
