'use client';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Contacts() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="heading-2">Contact Messages</h1>
          <p className="text-muted">View and manage customer contact messages</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f7c7d3]">
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Name</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Email</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Subject</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Date</th>
                <th className="text-left p-4 text-[#4b2e2b] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#f7c7d3]">
                <td colSpan={5} className="p-8 text-center text-muted">
                  No messages to display yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
