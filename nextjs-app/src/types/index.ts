// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  tags?: string[];
  stock_quantity: number;
  low_stock_threshold?: number;
  rating?: number;
  created_at: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  added_at: string;
}

export interface Cart {
  items: CartItem[];
  total_amount: number;
  session_id?: string;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
  created_at: string;
  updated_at: string;
}

// Address Types
export interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  product_id: string;
  product?: Product;
  added_at: string;
}

// Review Types
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number;
  current_uses: number;
  expiry_date: string;
  is_active: boolean;
}
