'use client';
import { cn } from '@/lib/utils';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 space-y-4 animate-pulse">
      <div className="aspect-video bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded w-1/2" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded-full flex-1" />
        <div className="h-10 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded-full w-10" />
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 flex gap-4 animate-pulse">
      <div className="w-24 h-24 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded w-3/4" />
        <div className="h-4 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded w-1/2" />
        <div className="h-4 bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20 rounded w-1/4" />
      </div>
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gradient-to-r from-[#f7c7d3]/20 to-[#fce6ec]/20', className)}
      {...props}
    />
  );
}
