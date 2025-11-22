'use client';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Orders() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="heading-2">Orders</h1>
          <p className="text-muted">Manage customer orders</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f7c7d3]">
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Order ID</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Customer</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Total</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Status</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#f7c7d3]">
                <td colSpan={5} className="p-8 text-center text-muted">
                  No orders to display yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
