import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Download, Filter } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuthHeaders, isAdmin } from "@/utils/auth";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
    fetchOrders();
  }, [navigate, statusFilter]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter === "all" 
        ? `${API}/admin/orders`
        : `${API}/admin/orders?status=${statusFilter}`;
      
      const response = await axios.get(url, {
        headers: getAuthHeaders()
      });
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#4b2e2b]" data-testid="admin-orders-title">Orders Management</h1>
            <p className="text-[#4b2e2b]/70">View and manage all orders</p>
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[#4b2e2b]/70">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-[#f7c7d3]" data-testid={`order-${order.id}`}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-[#4b2e2b]/70">Order ID</p>
                      <p className="font-mono text-sm">{order.id ? order.id.slice(0, 8) : "UNKNOWN"}...</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#4b2e2b]/70">Customer</p>
                      <p className="font-medium">{order.customer_name || 'Guest'}</p>
                      <p className="text-xs text-[#4b2e2b]/60">{order.customer_email || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#4b2e2b]/70">Total</p>
                      <p className="font-bold text-[#b96a82]">{formatINR(order.total_amount)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#4b2e2b]/70">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(order)}
                        className="border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#f7c7d3]">
                    <p className="text-xs text-[#4b2e2b]/60">
                      Ordered on: {formatDate(order.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Order ID</p>
                  <p className="font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Customer Name</p>
                  <p>{selectedOrder.customer_name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Customer Email</p>
                  <p>{selectedOrder.customer_email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Order Date</p>
                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Total Amount</p>
                  <p className="font-bold text-[#b96a82]">{formatINR(selectedOrder.total_amount)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-[#4b2e2b]">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-[#fce6ec] rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[#4b2e2b]/70">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatINR(item.price * item.quantity)}</p>
                        <p className="text-sm text-[#4b2e2b]/70">{formatINR(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
