import {z} from 'zod';

export const productSchema = z.object({
    category_id: z
        .number()
        .int()
        .positive('Category is required'),
    
    name: z
        .string()
        .min(2,'Product name must be at least 2 characters')
        .max(255),
    
    slug:z
        .string()
        .min(2,'Slug is required')
        .max(255)
        .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers and hyphens"
    ),

    description: z
        .string()
        .optional()
        .nullable(),

    short_description: z
        .string()
        .optional()
        .nullable(),

    care_instructions: z
        .string()
        .optional()
        .nullable(),

    specifications: z
        .union([
            z.string(),
            z.array(
                z.object({
                    key: z.string(),
                    value: z.string()
                })
            )
        ])
        .optional()
        .nullable(),

    shipping_info: z
        .string()
        .optional()
        .nullable(),

    faq: z
        .array(
            z.object({
                question: z.string(),
                answer: z.string()
            })
        )
        .optional()
        .nullable(),

    sku: z
        .string()
        .min(1,'SKU is required')
        .max(100),

    price: z
        .number()
        .nonnegative('Price cannnot be negative'),
    
    compare_at_price: z
        .number()
        .nonnegative()
        .optional()
        .nullable(),

    status: z
        .enum(['active','inactive','draft'])
        .default('draft'),

    featured: z
        .boolean()
        .default(false),

    images: z
        .array(
            z.object({
                id: z.number().optional(),
                image_url: z.string(),
                alt_text: z.string().optional().nullable(),
                is_primary: z.boolean().optional().default(false),
                sort_order: z.number().optional().default(0),
            })
        )
        .optional()
        .nullable()
})

export type ProductInput = z.infer<typeof productSchema>;