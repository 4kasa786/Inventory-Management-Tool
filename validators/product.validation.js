import { z } from 'zod';

export const productSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    type: z.string()
        .transform(val => val.toLowerCase().trim())
        .pipe(z.enum(['electronics', 'apparel', 'grocery', 'beauty', 'books', 'other'])),
    sku: z.string()
        .min(1, 'SKU is required')
        .max(50, 'SKU cannot exceed 50 characters')
        .regex(/^[A-Z0-9-_]+$/i, 'SKU can only contain letters, numbers, hyphens, and underscores')
        .trim(),
    image_url: z.union([
        z.string().url('Invalid image URL'),
        z.string().length(0), // Allow empty string
        z.undefined()
    ]).optional(),
    description: z.string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    quantity: z.number()
        .int('Quantity must be a whole number')
        .nonnegative('Quantity cannot be negative')
        .max(999999, 'Quantity cannot exceed 999,999'),
    price: z.number()
        .nonnegative('Price cannot be negative')
        .max(999999.99, 'Price cannot exceed $999,999.99')
        .multipleOf(0.01, 'Price can only have up to 2 decimal places'),
});

export const updateQuantitySchema = z.object({
    quantity: z.number()
        .int('Quantity must be a whole number')
        .nonnegative('Quantity cannot be negative')
        .max(999999, 'Quantity cannot exceed 999,999'),
});

export const getProductsQuerySchema = z.object({
    page: z.coerce.number()
        .int('Page must be a whole number')
        .min(1, 'Page must be greater than 0')
        .default(1),
    limit: z.coerce.number()
        .int('Limit must be a whole number')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must be between 1 and 100')
        .default(10),
    sortBy: z.enum(['name', 'price', 'quantity', 'createdAt', 'updatedAt'])
        .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc'])
        .default('desc'),
    type: z.string()
        .transform(val => val.toLowerCase().trim())
        .pipe(z.enum(['electronics', 'apparel', 'grocery', 'beauty', 'books', 'other']))
        .optional(),
    search: z.string()
        .min(1, 'Search term cannot be empty')
        .max(100, 'Search term cannot exceed 100 characters')
        .trim()
        .optional()
});