import { z } from 'zod';

export const registerSchema = z.object({

    name: z
        .string()
        .min(2,'Name must be at least 2 characters')
        .max(150),

    email: z
        .string()
        .email('Invalid email address')
        .max(255),
    
    password: z
        .string()
        .min(8,'Password must be leat 8 characters')
        .max(100),

    phone: z
        .string()
        .max(20)
        .optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>;