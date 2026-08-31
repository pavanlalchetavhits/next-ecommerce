import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(64, 'Password cannot exceed 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least 1 number');

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (password.length > 64) return 'Password cannot exceed 64 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least 1 lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  return null;
}

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full Name must be at least 2 characters')
    .max(50, 'Full Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full Name can only contain letters and spaces'),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@example.com)')
    .max(100, 'Email cannot exceed 100 characters'),

  password: passwordSchema,

  phone: z
    .string()
    .trim()
    .max(10, 'Phone number cannot exceed 10 digits')
    .regex(/^\d*$/, 'Phone number must contain numbers only')
    .optional()
    .or(z.literal('')),
});

export const registerFormSchema = registerSchema.extend({
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
    .max(64, 'Confirm password cannot exceed 64 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@example.com)')
    .max(100, 'Email cannot exceed 100 characters'),

  password: z
    .string()
    .min(1, 'Password is required')
    .max(64, 'Password cannot exceed 64 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@example.com)')
    .max(100, 'Email cannot exceed 100 characters'),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(100, 'Email cannot exceed 100 characters'),

  token: z
    .string()
    .trim()
    .min(1, 'Reset token is required')
    .max(100, 'Reset token is invalid'),

  newPassword: passwordSchema,

  confirmNewPassword: z
    .string()
    .min(1, 'Please confirm your new password')
    .max(64, 'Confirm password cannot exceed 64 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;