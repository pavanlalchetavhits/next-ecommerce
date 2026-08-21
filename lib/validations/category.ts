import {z} from 'zod';

export const categorySchema = z.object({
    name: z
        .string()
        .min(2,'Category name must be at least 2 characters')
        .max(255),
    slug: z
        .string()
        .min(2,'Slug is required')
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can only contain lowercase letters,numbers and hyphens"
        ),

    description: z
        .string()
        .optional(),

    image: z
        .string()
        .optional(),
    
    status: z
        .enum(['active','inactive'])
        .default('active'),
    
    sort_order: z
        .number()
        .int()
        .min(0)
        .default(0),
})

export type CategoryInput = z.infer<typeof categorySchema>;