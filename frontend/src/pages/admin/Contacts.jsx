import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Mail } from "lucide-react";
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

const AdminContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Access denied. Admin only.");
      navigate("/");
      return;
    }
    fetchContacts();
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API}/admin/contacts`, {
        headers: getAuthHeaders()
      });
      setContacts(response.data.contacts || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
      setLoading(false);
    }
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setDetailsOpen(true);
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await axios.put(
        `${API}/admin/contacts/${contactId}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      toast.success("Status updated");
      fetchContacts();
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
          <h1 className="text-3xl font-bold text-[#4b2e2b]" data-testid="admin-contacts-title">Contact Messages</h1>
          <p className="text-[#4b2e2b]/70">Manage customer inquiries</p>
        </div>

        {contacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[#4b2e2b]/70">No contact messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-[#f7c7d3]" data-testid={`contact-${contact.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-[#4b2e2b]">{contact.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                      
                      <p className="flex items-center gap-2 text-sm text-[#4b2e2b]/70 mb-3">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </p>
                      
                      <p className="text-sm text-[#4b2e2b]/80 line-clamp-2">{contact.message}</p>
                      
                      <p className="text-xs text-[#4b2e2b]/60 mt-3">
                        Sent on: {formatDate(contact.created_at)}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(contact)}
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

      {/* Contact Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              Full message from customer
            </DialogDescription>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Name</p>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#4b2e2b]/70">Email</p>
                  <p>{selectedContact.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#4b2e2b]/70">Sent on</p>
                  <p>{formatDate(selectedContact.created_at)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-[#4b2e2b]/70 mb-2">Message</p>
                <div className="p-4 bg-[#fce6ec] rounded-lg">
                  <p className="text-[#4b2e2b]">{selectedContact.message}</p>
                </div>
              </div>
              
              {selectedContact.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'responded')}
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

export default AdminContacts;
