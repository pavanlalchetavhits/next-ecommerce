'use client';

import { FormEvent, useState, useEffect, Suspense } from 'react';
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
import api from '@/lib/axios';
import { resetPasswordSchema } from '@/lib/validations/user';

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

function LockIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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

type FieldErrors = {
  email?: string;
  token?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlEmail = searchParams.get('email') || '';
  const urlToken = searchParams.get('token') || '';

  const [email, setEmail] = useState(urlEmail);
  const [token, setToken] = useState(urlToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlEmail) setEmail(urlEmail);
    if (urlToken) setToken(urlToken);
  }, [urlEmail, urlToken]);

  // Auto-dismiss error alert after 5 seconds
  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError('');
    setFieldErrors({});

    const currentEmail = email || urlEmail;
    const currentToken = token || urlToken;

    if (!currentToken || !currentEmail) {
      setGlobalError('Invalid or missing reset token. Please click the link sent to your email.');
      return;
    }

    const validation = resetPasswordSchema.safeParse({
      email: currentEmail,
      token: currentToken,
      newPassword,
      confirmNewPassword,
    });

    if (!validation.success) {
      const formattedErrors: FieldErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FieldErrors;
        if (fieldName && !formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      setGlobalError('Please fix the errors highlighted below.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/reset-password', {
        email: currentEmail,
        token: currentToken,
        newPassword,
        confirmNewPassword,
      });

      if (res.data.success) {
        router.push('/login?reset=success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Password reset link is invalid or has expired (10 minute limit). Please request a new link.';
      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isMissingParams = !urlToken && !token;

  return (
    <SplitAuthLayout
      heroTitle="Set Your New Account Password"
      heroSubtitle="Enter your new password below to regain full access to your NexCart customer account."
      heroFeatures={[
        '10-Minute Secure Token Link Verification',
        '256-Bit Password Encryption',
        'Instant Automatic Sign-In Access',
      ]}
      icon={<LockResetIcon sx={{ color: '#fff', fontSize: 26 }} />}
      title="Reset Password"
      subtitle="Enter a new password for your account below"
      badgeText="SECURITY PORTAL"
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

      {isMissingParams ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, textAlign: 'center' }}>
          <Alert
            severity="warning"
            variant="outlined"
            sx={{
              borderRadius: 2.5,
              borderColor: '#F59E0B',
              color: '#B45309',
              backgroundColor: '#FFFBEB',
            }}
          >
            No valid reset token found in URL. Please click the reset password link sent to your registered email address.
          </Alert>

          <Button
            component={Link}
            href="/forgot-password"
            fullWidth
            variant="contained"
            sx={{ mt: 1 }}
          >
            Request New Password Reset Link
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
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
              Back to Sign In
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id="reset-email-disabled"
            label="Email Address"
            type="email"
            fullWidth
            disabled
            value={email || urlEmail}
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            id="reset-new-password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (fieldErrors.newPassword) setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
            }}
            error={Boolean(fieldErrors.newPassword)}
            helperText={fieldErrors.newPassword}
            variant="outlined"
            slotProps={{
              htmlInput: { maxLength: 64 },
              formHelperText: { sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 } },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: fieldErrors.newPassword ? '#EE5D50' : '#6366F1' }} />
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

          <TextField
            id="reset-confirm-password"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            required
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              if (fieldErrors.confirmNewPassword) setFieldErrors((prev) => ({ ...prev, confirmNewPassword: undefined }));
            }}
            error={Boolean(fieldErrors.confirmNewPassword)}
            helperText={fieldErrors.confirmNewPassword}
            variant="outlined"
            slotProps={{
              htmlInput: { maxLength: 64 },
              formHelperText: { sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 } },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: fieldErrors.confirmNewPassword ? '#EE5D50' : '#6366F1' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#94A3B8' }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            id="reset-submit-btn"
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Set New Password'}
          </Button>

          <Box sx={{ mt: 1, textAlign: 'center' }}>
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
              Back to Sign In
            </Typography>
          </Box>
        </Box>
      )}
    </SplitAuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
