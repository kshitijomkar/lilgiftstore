export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  phone?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  tags: string[];
  in_stock: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  session_id: string;
  user_id?: string;
  created_at: string;
}

export interface Order {
  id: string;
  session_id: string;
  items: {
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
  }[];
  total_amount: number;
  customer_email?: string;
  customer_name?: string;
  user_id?: string;
  payment_method: "stripe" | "cod";
  address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
  status: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  review_text: string;
  verified_purchase: boolean;
  helpful_count: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit: number;
  usage_count: number;
  user_usage_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

export interface CustomGiftRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  description: string;
  budget?: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "responded";
  created_at: string;
}
