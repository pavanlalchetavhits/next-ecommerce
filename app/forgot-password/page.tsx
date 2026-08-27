'use client';

import { FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';
import SplitAuthLayout from '@/components/auth/SplitAuthLayout';
import api from '@/lib/axios';
import { forgotPasswordSchema } from '@/lib/validations/user';

function LockResetIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v2h2v-2h2v-2h-8.35zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </SvgIcon>
  );
}

function EmailIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </SvgIcon>
  );
}

type FieldErrors = {
  email?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  useEffect(() => {
    if (globalSuccess) {
      const timer = setTimeout(() => setGlobalSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalSuccess]);

  const handleRequestLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError('');
    setGlobalSuccess('');
    setFieldErrors({});

    const validation = forgotPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setFieldErrors({ email: validation.error.issues[0]?.message });
      setGlobalError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email, role: 'user' });
      if (res.data.success) {
        setGlobalSuccess('A password reset link valid for 10 minutes has been sent to your registered email address.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to request password reset link. Please try again.';
      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitAuthLayout
      heroTitle="Secure & Fast Account Recovery"
      heroSubtitle="Forgot your password? Enter your email address to receive a secure password reset link valid for 10 minutes."
      heroFeatures={[
        '10-Minute Expiration Security Window',
        '256-Bit Encrypted Token Link Verification',
        '24/7 Dedicated Account Protection',
      ]}
      icon={<LockResetIcon sx={{ color: '#fff', fontSize: 26 }} />}
      title="Forgot Password?"
      subtitle="Enter your registered email address to receive a password reset link"
      badgeText="ACCOUNT RECOVERY"
      formMaxWidth={440}
    >
      {globalError && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setGlobalError('')}
          sx={{
            mb: 3,
            borderRadius: 2.5,
            backgroundColor: '#EE5D50',
            fontSize: '0.875rem',
          }}
        >
          {globalError}
        </Alert>
      )}

      {globalSuccess && (
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setGlobalSuccess('')}
          sx={{
            mb: 3,
            borderRadius: 2.5,
            backgroundColor: '#05CD99',
            fontSize: '0.875rem',
          }}
        >
          {globalSuccess}
        </Alert>
      )}

      <Box component="form" onSubmit={handleRequestLink} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          id="recovery-email"
          label="Email Address"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors({});
          }}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          variant="outlined"
          slotProps={{
            htmlInput: { maxLength: 100 },
            formHelperText: { sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 } },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: fieldErrors.email ? '#EE5D50' : '#6366F1' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          id="request-reset-link-btn"
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 0.5 }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Send Reset Link'}
        </Button>

        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Remember your password?{' '}
            <Typography
              component={Link}
              href="/login"
              variant="body2"
              sx={{
                color: '#6366F1',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign In
            </Typography>
          </Typography>
        </Box>
      </Box>
    </SplitAuthLayout>
  );
}
