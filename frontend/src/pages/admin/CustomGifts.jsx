import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Mail, Phone } from "lucide-react";
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
import { getAuthHeaders, isAdmin } from "@/utils/auth";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCustomGifts = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
    fetchGifts();
  }, [navigate]);

  const fetchGifts = async () => {
    try {
      const response = await axios.get(`${API}/admin/custom-gifts`, {
        headers: getAuthHeaders()
      });
      setGifts(response.data.custom_gifts || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast.error("Failed to load custom gift requests");
      setLoading(false);
    }
  };

  const handleViewDetails = (gift) => {
    setSelectedGift(gift);
    setDetailsOpen(true);
  };

  const handleStatusUpdate = async (giftId, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/custom-gifts/${giftId}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      toast.success("Status updated");
      fetchGifts();
      setDetailsOpen(false);
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
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
        <div>
          <h1 className="text-3xl font-bold text-[#4b2e2b]" data-testid="admin-gifts-title">Custom Gift Requests</h1>
          <p className="text-[#4b2e2b]/70">Manage custom gift inquiries</p>
        </div>

        {gifts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[#4b2e2b]/70">No custom gift requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {gifts.map((gift) => (
              <Card key={gift.id} className="border-[#f7c7d3]" data-testid={`gift-${gift.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-[#4b2e2b]">{gift.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(gift.status)}`}>
                          {gift.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm mb-3">
                        <p className="flex items-center gap-2 text-[#4b2e2b]/70">
                          <Mail className="w-4 h-4" />
                          {gift.email}
                        </p>
                        {gift.phone && (
                          <p className="flex items-center gap-2 text-[#4b2e2b]/70">
                            <Phone className="w-4 h-4" />
                            {gift.phone}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-[#4b2e2b]/70 mb-1">Occasion: <span className="font-medium text-[#4b2e2b]">{gift.occasion}</span></p>
                        {gift.budget && (
                          <p className="text-sm text-[#4b2e2b]/70">Budget: <span className="font-medium text-[#4b2e2b]">{gift.budget}</span></p>
                        )}
                      </div>
                      
                      <p className="text-sm text-[#4b2e2b]/80 line-clamp-2">{gift.description}</p>
                      
                      <p className="text-xs text-[#4b2e2b]/60 mt-3">
                        Submitted on: {formatDate(gift.created_at)}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(gift)}
                      className="ml-4 border-[#b96a82] text-[#b96a82] hover:bg-[#b96a82] hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Gift Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom Gift Request Details</DialogTitle>
            <DialogDescription>
              Full information about this request
            </DialogDescription>
          </DialogHeader>
          
          {selectedGift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Name</p>
                  <p className="font-medium">{selectedGift.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedGift.status)}`}>
                    {selectedGift.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Email</p>
                  <p>{selectedGift.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Phone</p>
                  <p>{selectedGift.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Occasion</p>
                  <p>{selectedGift.occasion}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Budget</p>
                  <p>{selectedGift.budget || 'Not specified'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#4b2e2b]/70">Submitted on</p>
                  <p>{formatDate(selectedGift.created_at)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-[#4b2e2b]/70 mb-2">Description</p>
                <div className="p-4 bg-[#fce6ec] rounded-lg">
                  <p className="text-[#4b2e2b]">{selectedGift.description}</p>
                </div>
              </div>
              
              {selectedGift.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusUpdate(selectedGift.id, 'responded')}
                    className="flex-1 bg-[#b96a82] hover:bg-[#a05670] text-white"
                  >
                    Mark as Responded
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCustomGifts;
