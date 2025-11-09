import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders, getUser, isAuthenticated } from "@/utils/auth";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";
import { User, ShoppingBag, Calendar } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to view your profile");
      navigate("/");
      return;
    }
    
    const currentUser = getUser();
    setUser(currentUser);
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/user/orders`, {
        headers: getAuthHeaders()
      });
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#4b2e2b] mb-8" data-testid="profile-title">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <Card className="lg:col-span-1 border-[#f7c7d3] bg-white/60 backdrop-blur-sm" data-testid="user-info-card">
            <CardHeader>
              <CardTitle className="text-[#4b2e2b] flex items-center gap-2">
                <User className="w-5 h-5 text-[#b96a82]" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-[#4b2e2b]/70">Name</p>
                <p className="text-lg font-semibold text-[#4b2e2b]" data-testid="user-name">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#4b2e2b]/70">Email</p>
                <p className="text-lg font-semibold text-[#4b2e2b]" data-testid="user-email">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#4b2e2b]/70">Role</p>
                <p className="text-lg font-semibold text-[#4b2e2b] capitalize" data-testid="user-role">{user.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm" data-testid="orders-card">
              <CardHeader>
                <CardTitle className="text-[#4b2e2b] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#b96a82]" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-[#f7c7d3] border-t-[#b96a82] rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-orders">
                    <ShoppingBag className="w-16 h-16 mx-auto text-[#f7c7d3] mb-4" />
                    <p className="text-lg text-[#4b2e2b]/70">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 bg-[#fce6ec]/30 rounded-lg border border-[#f7c7d3]" data-testid={`order-${order.id}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-[#4b2e2b]">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-[#4b2e2b]/70 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-[#b96a82]">{formatINR(order.total_amount)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-[#4b2e2b]/70">
                          {order.items?.length || 0} item(s)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
