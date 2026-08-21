import {z} from 'zod';

export const productVariantSchema = z.object({
    sku:z
        .string()
        .min(1,'SKU is required')
        .max(100),
    
    variant_name: z
        .string()
        .min(1,'Varient name is required')
        .max(255),

    attributes: z
        .record(z.string(),z.string())
        .optional()
        .default({}),

    price: z
        .number()
        .nonnegative()
        .optional()
        .nullable(),

    status: z
        .enum(['active','inactive'])
        .default('active'),
})

export type ProductVarientInput = z.infer<typeof productVariantSchema>;