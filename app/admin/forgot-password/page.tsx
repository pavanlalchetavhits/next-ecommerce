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

function AdminShieldIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z" />
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

export default function AdminForgotPasswordPage() {
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
      const res = await api.post('/api/auth/forgot-password', { email, role: 'admin' });
      if (res.data.success) {
        setGlobalSuccess('A password reset link valid for 10 minutes has been sent to your administrator email address.');
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
      heroTitle="Unified Store Management & Security Portal"
      heroSubtitle="Reset administrator credentials securely to regain access to full store control and analytics."
      heroFeatures={[
        '10-Minute Expiration Security Window',
        '256-Bit Encrypted Token Link Verification',
        '24/7 Dedicated Administrator Support',
      ]}
      icon={<AdminShieldIcon sx={{ color: '#fff', fontSize: 26 }} />}
      title="Admin Password Recovery"
      subtitle="Enter your registered administrator email address to receive a password reset link"
      badgeText="ADMIN RECOVERY"
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
          id="admin-recovery-email"
          label="Admin Email Address"
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
          id="admin-request-reset-link-btn"
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
            Remember admin password?{' '}
            <Typography
              component={Link}
              href="/admin/login"
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
