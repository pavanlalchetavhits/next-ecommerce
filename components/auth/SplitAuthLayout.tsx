'use client';

import { ReactNode } from 'react';
import {
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Chip,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';

export const splitAuthTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Vibrant Indigo Matching Hero Brand Accent
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Deep Slate
      secondary: '#64748B', // Cool Slate Gray
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#F8FAFC',
          transition: 'all 0.2s ease-in-out',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E2E8F0',
          },
          '&:hover': {
            backgroundColor: '#FFFFFF',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366F1',
            borderWidth: 2,
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingTop: 12,
          paddingBottom: 12,
          fontWeight: 600,
          fontSize: '0.95rem',
          textTransform: 'none',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#FFFFFF',
          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
            transform: 'translateY(-1.5px)',
            boxShadow: '0 12px 25px rgba(99, 102, 241, 0.45)',
          },
        },
      },
    },
  },
});

function CheckCircleIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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

interface SplitAuthLayoutProps {
  heroTitle: string;
  heroSubtitle: string;
  heroFeatures?: string[];
  icon: ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  children: ReactNode;
  formMaxWidth?: number;
}

export default function SplitAuthLayout({
  heroTitle,
  heroSubtitle,
  heroFeatures = [
    '256-Bit SSL Encrypted Security',
    'Instant Order & Inventory Updates',
    'Dedicated 24/7 Customer Support',
  ],
  icon,
  title,
  subtitle,
  badgeText,
  children,
  formMaxWidth = 460,
}: SplitAuthLayoutProps) {
  return (
    <ThemeProvider theme={splitAuthTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: { md: '100vh' },
          minHeight: '100vh',
          display: 'flex',
          backgroundColor: '#FFFFFF',
          overflow: { md: 'hidden' },
        }}
      >
        {/* Left Side: Brand Hero Panel */}
        <Box
          sx={{
            flex: { xs: 0, md: 1 },
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)',
            position: 'relative',
            overflow: 'hidden',
            p: { md: 5, lg: 7 },
            color: '#FFFFFF',
          }}
        >
          {/* Ambient Glow Circles */}
          <Box
            sx={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
              top: '-10%',
              left: '-10%',
              pointerEvents: 'none',
              filter: 'blur(40px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)',
              bottom: '5%',
              right: '-5%',
              pointerEvents: 'none',
              filter: 'blur(50px)',
            }}
          />

          {/* Top Brand Header */}
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
                }}
              >
                {icon}
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
              >
                NexCart
              </Typography>
            </Box>
          </Box>

          {/* Middle Value Proposition Hero */}
          <Box sx={{ position: 'relative', zIndex: 2, my: 'auto', maxWidth: 520 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: '-1.5px',
                lineHeight: 1.15,
                fontSize: { md: '2.2rem', lg: '2.75rem' },
                mb: 2,
                background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {heroTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#94a3b8',
                fontSize: { md: '1rem', lg: '1.05rem' },
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {heroSubtitle}
            </Typography>

            {/* Feature Badges List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {heroFeatures.map((feature, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    px: 2.25,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#818cf8', fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom Security Footer */}
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.785rem',
              }}
            >
              <LockIcon sx={{ fontSize: 14, color: '#818cf8' }} />
              Protected by NextAuth 256-bit Enterprise Encryption
            </Typography>
          </Box>
        </Box>

        {/* Right Side: Seamless Modern Form Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 3, sm: 6, md: 7 },
            backgroundColor: '#FFFFFF',
            overflowY: { xs: 'auto', md: 'hidden' },
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: formMaxWidth,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              my: 'auto',
            }}
          >
            {/* Header Title & Badge */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 3.5,
              }}
            >
              {badgeText && (
                <Chip
                  label={badgeText}
                  size="small"
                  sx={{
                    mb: 1.5,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#4F46E5',
                    borderColor: 'rgba(99, 102, 241, 0.25)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                  }}
                />
              )}

              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-1px',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  mb: 0.75,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#64748B', fontSize: '0.95rem' }}
              >
                {subtitle}
              </Typography>
            </Box>

            {/* Form Content */}
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
