'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';

export default function Products() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-2">Products</h1>
            <p className="text-muted">Manage your product catalog</p>
          </div>
          <Button className="bg-[#b96a82] hover:bg-[#a05670] text-white">
            Add Product
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f7c7d3]">
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Name</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Category</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Price</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Stock</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#f7c7d3]">
                <td colSpan={5} className="p-8 text-center text-muted">
                  No products to display yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
