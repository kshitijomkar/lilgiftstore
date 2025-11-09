import { Check, Circle, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Order Placed', icon: Circle, color: 'text-gray-400' },
  confirmed: { label: 'Confirmed', icon: Check, color: 'text-blue-500' },
  processing: { label: 'Processing', icon: Package, color: 'text-orange-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-500' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500' }
};

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderStatusTimeline({ currentStatus, timeline = [] }) {
  const getStatusIndex = (status) => STATUS_ORDER.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-medium">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="order-timeline">
      {STATUS_ORDER.map((status, index) => {
        const config = STATUS_CONFIG[status];
        const Icon = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const timelineItem = timeline.find(t => t.status === status);

        return (
          <div key={status} className="flex gap-4 items-start">
            {/* Icon */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-[#b96a82] text-white' 
                  : 'bg-gray-200 text-gray-400'
              } transition-all`}>
                <Icon className="w-5 h-5" />
              </div>
              {index < STATUS_ORDER.length - 1 && (
                <div className={`absolute top-10 left-5 w-0.5 h-16 ${
                  isCompleted ? 'bg-[#b96a82]' : 'bg-gray-200'
                } transition-all`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium ${
                    isCompleted ? 'text-[#4b2e2b]' : 'text-[#4b2e2b]/40'
                  }`}>
                    {config.label}
                    {isCurrent && (
                      <span className="ml-2 text-xs bg-[#b96a82] text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  {timelineItem?.note && (
                    <p className="text-sm text-[#4b2e2b]/60 mt-1">{timelineItem.note}</p>
                  )}
                </div>
                {timelineItem?.timestamp && (
                  <span className="text-xs text-[#4b2e2b]/50">
                    {new Date(timelineItem.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
