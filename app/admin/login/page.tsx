'use client';

import { FormEvent, useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';
import SplitAuthLayout from '@/components/auth/SplitAuthLayout';
import { loginSchema } from '@/lib/validations/user';

function LockIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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

function VisibilityIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </SvgIcon>
  );
}

function VisibilityOffIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.74-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.17c0-1.66-1.34-3-3-3l-.17.02z" />
    </SvgIcon>
  );
}

function AdminShieldIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z" />
    </SvgIcon>
  );
}

function AdminStatusAlerts() {
  const searchParams = useSearchParams();
  const reset = searchParams.get('reset');

  const [visibleMessage, setVisibleMessage] = useState<string | null>(
    reset === 'success' ? 'Admin password reset successfully! Please sign in below.' : null
  );

  useEffect(() => {
    if (reset === 'success') {
      setVisibleMessage('Admin password reset successfully! Please sign in below.');
    }
  }, [reset]);

  useEffect(() => {
    if (visibleMessage) {
      const timer = setTimeout(() => {
        setVisibleMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessage]);

  if (!visibleMessage) return null;

  return (
    <Alert
      severity="success"
      variant="filled"
      onClose={() => setVisibleMessage(null)}
      sx={{
        mb: 3,
        borderRadius: 2.5,
        backgroundColor: '#05CD99',
        color: '#ffffff',
        fontSize: '0.875rem',
        fontWeight: 500,
        boxShadow: '0 4px 14px rgba(5, 205, 153, 0.25)',
      }}
    >
      {visibleMessage}
    </Alert>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  // Auto-dismiss global error message after 5 seconds
  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => {
        setGlobalError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError('');
    setFieldErrors({});

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof typeof formattedErrors;
        if (fieldName && !formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      setGlobalError('Please fix the validation errors below.');
      return;
    }

    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setGlobalError('Invalid administrator email or password. Please try again.');
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <SplitAuthLayout
      heroTitle="Unified Store Management & Analytics Portal"
      heroSubtitle="Control products, inventory, orders, and customer insights from a single powerful dashboard."
      heroFeatures={[
        'Full Administrative Control & Role Management',
        'Real-time Inventory & Product Operations',
        'Advanced Analytics & Revenue Reporting',
      ]}
      icon={<AdminShieldIcon sx={{ color: '#fff', fontSize: 26 }} />}
      title="Admin Portal"
      subtitle="Sign in with administrator credentials"
      badgeText="ADMIN PORTAL"
      formMaxWidth={440}
    >
      <Suspense fallback={null}>
        <AdminStatusAlerts />
      </Suspense>

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

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        <TextField
          id="admin-email"
          label="Email Address"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          variant="outlined"
          slotProps={{
            htmlInput: {
              maxLength: 100,
            },
            formHelperText: {
              sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 },
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: fieldErrors.email ? '#EE5D50' : '#6366F1' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            id="admin-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            variant="outlined"
            slotProps={{
              htmlInput: {
                maxLength: 64,
              },
              formHelperText: {
                sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: fieldErrors.password ? '#EE5D50' : '#6366F1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94A3B8' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
            <Typography
              component={Link}
              href="/admin/forgot-password"
              variant="body2"
              sx={{
                color: '#6366F1',
                fontWeight: 600,
                fontSize: '0.8125rem',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Box>

        <Button
          id="admin-submit-btn"
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 0.5 }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#ffffff' }} />
          ) : (
            'Sign In'
          )}
        </Button>
      </Box>
    </SplitAuthLayout>
  );
}