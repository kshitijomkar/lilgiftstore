import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders, isAdmin } from "@/utils/auth";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/admin/dashboard`, {
        headers: getAuthHeaders()
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#4b2e2b]" data-testid="admin-dashboard-title">Dashboard</h1>
          <p className="text-[#4b2e2b]/70">Overview of your store performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#fce6ec] to-white border-[#f7c7d3]" data-testid="stat-products">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4b2e2b]">Total Products</CardTitle>
              <Package className="h-4 w-4 text-[#b96a82]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4b2e2b]">{stats?.total_products || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#fce6ec] to-white border-[#f7c7d3]" data-testid="stat-orders">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4b2e2b]">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-[#b96a82]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4b2e2b]">{stats?.total_orders || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#fce6ec] to-white border-[#f7c7d3]" data-testid="stat-users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4b2e2b]">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#b96a82]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4b2e2b]">{stats?.total_users || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#fce6ec] to-white border-[#f7c7d3]" data-testid="stat-sales">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4b2e2b]">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-[#b96a82]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4b2e2b]">{formatINR(stats?.total_sales || 0)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#f7c7d3]">
          <CardHeader>
            <CardTitle className="text-[#4b2e2b]">Welcome to Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#4b2e2b]/70">
              Manage your products, orders, users, and view analytics from the sidebar.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;