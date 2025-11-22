// Core types for the application
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  tags: string[];
  stock: number;
  rating: number;
  reviews_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  stripe_session_id?: string;
  payment_intent_id?: string;
  shipping_address: Address;
  created_at: Date;
  updated_at: Date;
  paid_at?: Date;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'expired';

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_ids: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  used_count: number;
  expiry_date: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface APIError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, any>;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
