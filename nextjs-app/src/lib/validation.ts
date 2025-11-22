/**
 * Zod validation schemas for all API endpoints
 * Ensures consistent input validation across the application
 */

import { z } from 'zod';

// Authentication Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  ),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

export const PasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Product Schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name required').max(200),
  description: z.string().min(10, 'Description too short'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image required'),
  tags: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative('Stock must be non-negative').optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Cart Schemas
export const AddToCartSchema = z.object({
  product_id: z.string().min(1, 'Product ID required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  session_id: z.string().optional(),
});

export const UpdateCartSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive').optional(),
});

// Order Schemas
export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, 'At least one item required'),
  shipping_address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().min(1),
  }),
  email: z.string().email().optional(),
});

// Review Schemas
export const CreateReviewSchema = z.object({
  product_id: z.string().min(1, 'Product ID required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Title too short').max(100),
  comment: z.string().min(10, 'Comment too short').max(1000),
});

export const UpdateReviewSchema = CreateReviewSchema.partial();

// Coupon Schema
export const CouponValidationSchema = z.object({
  code: z.string().min(1, 'Coupon code required'),
  amount: z.number().positive('Amount must be positive').optional(),
});

// Contact Schema
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject too short'),
  message: z.string().min(10, 'Message too short').max(2000),
});

// Custom Gift Schema
export const CustomGiftSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10, 'Message too short'),
  budget: z.number().positive('Budget must be positive'),
  occasion: z.string().min(1),
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(10).optional(),
  skip: z.number().int().nonnegative().default(0).optional(),
});

// Product Filter Schema
export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price-low', 'price-high', 'popular']).optional(),
  ...PaginationSchema.shape,
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
export type CustomGiftInput = z.infer<typeof CustomGiftSchema>;
