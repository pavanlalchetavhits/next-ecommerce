'use client';

import { ReactNode } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Chip,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';

// Modern Light Admin Theme (Horizon UI / Modern Light E-Commerce Theme)
export const authTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4318FF', // Horizon Indigo Primary Accent
      light: '#6AD2FF',
      dark: '#2B3674',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3965FF',
      light: '#7090FF',
      dark: '#1B2559',
    },
    background: {
      default: '#F4F7FE', // Soft Off-White Light Base
      paper: '#FFFFFF',    // Pure White Card Surface
    },
    text: {
      primary: '#1B2559',   // Deep Dark Navy Slate
      secondary: '#707EAE', // Cool Slate Gray
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          transition: 'all 0.2s ease-in-out',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E9EDF7',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#B0BBD5',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4318FF',
            borderWidth: 2,
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(67, 24, 255, 0.12)',
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
          background: 'linear-gradient(135deg, #4318FF 0%, #3965FF 100%)',
          color: '#FFFFFF',
          boxShadow: '0 8px 20px rgba(67, 24, 255, 0.25)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3311CC 0%, #2B52E0 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 25px rgba(67, 24, 255, 0.38)',
          },
        },
      },
    },
  },
});

export function LockIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </SvgIcon>
  );
}

interface AuthLayoutProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm';
}

export default function AuthLayout({
  icon,
  title,
  subtitle,
  badgeText,
  children,
  maxWidth = 'xs',
}: AuthLayoutProps) {
  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F4F7FE',
          backgroundImage:
            'radial-gradient(circle at 50% 10%, rgba(67, 24, 255, 0.05) 0%, #F4F7FE 65%)',
          position: 'relative',
          overflow: 'hidden',
          py: 5,
          px: 2,
        }}
      >
        {/* Soft Ambient Light Glow Circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(67, 24, 255, 0.06) 0%, rgba(244, 247, 254, 0) 70%)',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth={maxWidth} sx={{ position: 'relative', zIndex: 1 }}>
          <Card
            elevation={0}
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9EDF7',
              boxShadow:
                '0 20px 40px -15px rgba(112, 144, 176, 0.12), 0 1px 3px rgba(112, 144, 176, 0.05)',
              overflow: 'hidden',
              borderRadius: '24px',
            }}
          >
            <CardContent sx={{ p: { xs: 3.5, sm: 4.5 } }}>
              {/* Header Icon & Title */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3.5,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '18px',
                    background:
                      'linear-gradient(135deg, #4318FF 0%, #3965FF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(67, 24, 255, 0.25)',
                    mb: 2,
                  }}
                >
                  {icon}
                </Box>

                {badgeText && (
                  <Chip
                    label={badgeText}
                    size="small"
                    sx={{
                      mb: 1.5,
                      backgroundColor: 'rgba(67, 24, 255, 0.08)',
                      color: '#4318FF',
                      borderColor: 'rgba(67, 24, 255, 0.2)',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                    }}
                  />
                )}

                <Typography
                  component="h1"
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#1B2559',
                    letterSpacing: '-0.5px',
                    fontSize: { xs: '1.4rem', sm: '1.6rem' },
                    textAlign: 'center',
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#707EAE', mt: 0.5, textAlign: 'center' }}
                >
                  {subtitle}
                </Typography>
              </Box>

              {/* Form Content */}
              {children}
            </CardContent>
          </Card>

          {/* Footer Security Notice */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#707EAE',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                fontSize: '0.75rem',
              }}
            >
              <LockIcon sx={{ fontSize: 14, color: '#4318FF' }} />
              Protected by NextAuth SSL 256-bit encryption
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
