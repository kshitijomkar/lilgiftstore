import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function InventoryBadge({ stockQuantity, lowStockThreshold = 10 }) {
  if (stockQuantity === 0) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium" data-testid="out-of-stock">
        <AlertTriangle className="w-4 h-4" />
        Out of Stock
      </div>
    );
  }

  if (stockQuantity <= lowStockThreshold) {
    return (
      <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium" data-testid="low-stock">
        <AlertTriangle className="w-4 h-4" />
        Only {stockQuantity} left!
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium" data-testid="in-stock">
      <CheckCircle className="w-4 h-4" />
      In Stock ({stockQuantity} available)
    </div>
  );
}
