'use client';
import Link from 'next/link';
import { ShoppingCart, Heart, FileText, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'orders' | 'search';
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const defaults: Record<string, { title: string; description: string; icon: React.ReactNode; action: { label: string; href: string } }> = {
    cart: {
      title: 'Your cart is empty',
      description: "Looks like you haven't added any items yet. Explore our collection and find something you love!",
      icon: <ShoppingCart className="w-16 h-16 text-[#b96a82]/40" />,
      action: { label: 'Start Shopping', href: '/shop' },
    },
    wishlist: {
      title: 'Your wishlist is empty',
      description: 'Save your favorite items here for easy access later. Start adding items to your wishlist!',
      icon: <Heart className="w-16 h-16 text-[#b96a82]/40" />,
      action: { label: 'Browse Products', href: '/shop' },
    },
    orders: {
      title: 'No orders yet',
      description: "You haven't placed any orders. Start shopping to see your order history here!",
      icon: <FileText className="w-16 h-16 text-[#b96a82]/40" />,
      action: { label: 'Continue Shopping', href: '/shop' },
    },
    search: {
      title: 'No results found',
      description: 'Try adjusting your search terms or browse our categories to find what you are looking for.',
      icon: <Search className="w-16 h-16 text-[#b96a82]/40" />,
      action: { label: 'Go to Shop', href: '/shop' },
    },
  };

  const config = defaults[type];
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalAction = action || config.action;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">{config.icon}</div>
      <h3 className="text-2xl font-bold text-[#4b2e2b] mb-2">{finalTitle}</h3>
      <p className="text-[#4b2e2b]/70 text-center mb-6 max-w-sm">{finalDescription}</p>
      <Link
        href={finalAction.href}
        className="bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full px-8 py-3 font-medium transition-all hover:shadow-lg"
      >
        {finalAction.label}
      </Link>
    </div>
  );
}
