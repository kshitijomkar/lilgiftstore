'use client';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4b2e2b] mb-2">Admin Dashboard</h1>
          <p className="text-muted">Welcome back! Here's your store overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold text-[#b96a82] mb-2">2000+</div>
            <p className="text-muted">Total Orders</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold text-[#b96a82] mb-2">500+</div>
            <p className="text-muted">Total Products</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold text-[#b96a82] mb-2">₹50K+</div>
            <p className="text-muted">Revenue</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="text-3xl sm:text-4xl font-bold text-[#b96a82] mb-2">4.9★</div>
            <p className="text-muted">Avg Rating</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4b2e2b] mb-4">Recent Orders</h2>
          <p className="text-muted">No orders to display yet.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
