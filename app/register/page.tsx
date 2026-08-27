'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { registerFormSchema } from '@/lib/validations/user';

function PersonIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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

function PhoneIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
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

function PersonAddIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zM6 10V7H4v3H1v2h3v3h2v-3h3v-2H6z" />
    </SvgIcon>
  );
}

type FieldErrors = {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    // For full name field, strictly allow letters and spaces only
    let sanitizedValue = value;
    if (name === 'name') {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phone') {
      sanitizedValue = value.replace(/\D/g, '');
    }

    setForm((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError('');
    setFieldErrors({});

    // Client-side Zod validation
    const validationResult = registerFormSchema.safeParse(form);

    if (!validationResult.success) {
      const formattedErrors: FieldErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FieldErrors;
        if (fieldName && !formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      setGlobalError('Please fix the errors highlighted below to create your account.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });

      if (response.data.success || response.status === 201) {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        const msg = 'This email address is already registered. Please sign in instead.';
        setGlobalError(msg);
        setFieldErrors((prev) => ({ ...prev, email: 'Email address already in use' }));
      } else {
        const msg = err.response?.data?.message || 'Registration failed. Please try again.';
        setGlobalError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SplitAuthLayout
      heroTitle="Start your shopping journey today"
      heroSubtitle="Create a free account to unlock exclusive member discounts, faster checkout, and order updates."
      heroFeatures={[
        'Free Member Account & Instant Access',
        'Save Favorites & Wishlist Sync',
        'Priority Customer Care & Support',
      ]}
      icon={<PersonAddIcon sx={{ color: '#fff', fontSize: 26 }} />}
      title="Create Account"
      subtitle="Fill in your details below to get started"
      badgeText="JOIN US TODAY"
      formMaxWidth={500}
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

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {/* Row 1: Full Name & Phone Number */}
          <Box sx={{ gridColumn: 'span 1' }}>
            <TextField
              id="register-name"
              name="name"
              label="Full Name"
              type="text"
              fullWidth
              required
              value={form.name}
              onChange={handleChange}
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name}
              variant="outlined"
              slotProps={{
                htmlInput: {
                  maxLength: 50,
                },
                formHelperText: {
                  sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 },
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: fieldErrors.name ? '#EE5D50' : '#6366F1' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ gridColumn: 'span 1' }}>
            <TextField
              id="register-phone"
              name="phone"
              label="Phone Number (Optional)"
              type="tel"
              fullWidth
              value={form.phone}
              onChange={handleChange}
              error={Boolean(fieldErrors.phone)}
              helperText={fieldErrors.phone}
              variant="outlined"
              slotProps={{
                htmlInput: {
                  maxLength: 10,
                },
                formHelperText: {
                  sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', mx: 0.5 },
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: fieldErrors.phone ? '#EE5D50' : '#6366F1' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Row 2: Email Address */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
            <TextField
              id="register-email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={handleChange}
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
          </Box>

          {/* Row 3: Password & Confirm Password */}
          <Box sx={{ gridColumn: 'span 1' }}>
            <TextField
              id="register-password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              value={form.password}
              onChange={handleChange}
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
          </Box>

          <Box sx={{ gridColumn: 'span 1' }}>
            <TextField
              id="register-confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              required
              value={form.confirmPassword}
              onChange={handleChange}
              error={Boolean(fieldErrors.confirmPassword)}
              helperText={fieldErrors.confirmPassword}
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
                      <LockIcon sx={{ color: fieldErrors.confirmPassword ? '#EE5D50' : '#6366F1' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{ color: '#94A3B8' }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Box>

        <Button
          id="register-submit-btn"
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#ffffff' }} />
          ) : (
            'Create Account'
          )}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Already have an account?{' '}
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