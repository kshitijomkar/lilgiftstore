import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAuthHeaders, getUser, isAuthenticated } from "@/utils/auth";
import { formatINR } from "@/utils/currency";
import { toast } from "sonner";
import { User, ShoppingBag, Calendar, MapPin, Edit, Plus, Trash2, Home } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfileEnhanced = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: ""
  });
  
  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to view your profile");
      navigate("/");
      return;
    }
    
    const currentUser = getUser();
    setUser(currentUser);
    setProfileForm({
      name: currentUser.name || "",
      phone: currentUser.phone || ""
    });
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        axios.get(`${API}/user/orders`, { headers: getAuthHeaders() }),
        axios.get(`${API}/user/addresses`, { headers: getAuthHeaders() })
      ]);
      
      setOrders(ordersRes.data.orders || []);
      setAddresses(addressesRes.data.addresses || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/user/profile`, profileForm, {
        headers: getAuthHeaders()
      });
      
      // Update local storage
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Profile updated successfully!");
      setEditProfileOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/user/addresses`, addressForm, {
        headers: getAuthHeaders()
      });
      
      toast.success("Address added successfully!");
      setAddAddressOpen(false);
      resetAddressForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add address");
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/user/addresses/${selectedAddress.id}`, addressForm, {
        headers: getAuthHeaders()
      });
      
      toast.success("Address updated successfully!");
      setEditAddressOpen(false);
      setSelectedAddress(null);
      resetAddressForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    try {
      await axios.delete(`${API}/user/addresses/${addressId}`, {
        headers: getAuthHeaders()
      });
      
      toast.success("Address deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete address");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      full_name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      is_default: false
    });
  };

  const openEditAddress = (address) => {
    setSelectedAddress(address);
    setAddressForm({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      is_default: address.is_default
    });
    setEditAddressOpen(true);
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
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm" data-testid="user-info-card">
              <CardHeader>
                <CardTitle className="text-[#4b2e2b] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#b96a82]" />
                    Profile
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditProfileOpen(true)}
                    data-testid="edit-profile-btn"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
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
                {user.phone && (
                  <div>
                    <p className="text-sm text-[#4b2e2b]/70">Phone</p>
                    <p className="text-lg font-semibold text-[#4b2e2b]">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Role</p>
                  <p className="text-lg font-semibold text-[#4b2e2b] capitalize" data-testid="user-role">{user.role}</p>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm" data-testid="addresses-card">
              <CardHeader>
                <CardTitle className="text-[#4b2e2b] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#b96a82]" />
                    Addresses
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddAddressOpen(true)}
                    data-testid="add-address-btn"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-6" data-testid="no-addresses">
                    <MapPin className="w-12 h-12 mx-auto text-[#f7c7d3] mb-2" />
                    <p className="text-sm text-[#4b2e2b]/70">No addresses added</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-3 bg-[#fce6ec]/30 rounded-lg border border-[#f7c7d3] relative"
                        data-testid={`address-${address.id}`}
                      >
                        {address.is_default && (
                          <span className="absolute top-2 right-2 text-xs bg-[#b96a82] text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <p className="font-semibold text-[#4b2e2b] text-sm">{address.full_name}</p>
                        <p className="text-xs text-[#4b2e2b]/70">{address.phone}</p>
                        <p className="text-xs text-[#4b2e2b]/70 mt-1">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                        </p>
                        <p className="text-xs text-[#4b2e2b]/70">
                          {address.city}, {address.state} - {address.postal_code}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => openEditAddress(address)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
                            <p className="text-xs text-[#4b2e2b]/60 mt-1">
                              Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
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
                        {order.address && (
                          <div className="mt-2 pt-2 border-t border-[#f7c7d3]">
                            <p className="text-xs text-[#4b2e2b]/60 flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {order.address.city}, {order.address.state}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <Button type="submit" className="w-full bg-[#b96a82] hover:bg-[#a05670]">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog open={addAddressOpen} onOpenChange={setAddAddressOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add-full-name">Full Name *</Label>
                <Input
                  id="add-full-name"
                  value={addressForm.full_name}
                  onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-phone">Phone *</Label>
                <Input
                  id="add-phone"
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="add-address1">Address Line 1 *</Label>
              <Input
                id="add-address1"
                value={addressForm.address_line1}
                onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="add-address2">Address Line 2</Label>
              <Input
                id="add-address2"
                value={addressForm.address_line2}
                onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="add-city">City *</Label>
                <Input
                  id="add-city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-state">State *</Label>
                <Input
                  id="add-state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="add-postal">Postal Code *</Label>
                <Input
                  id="add-postal"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="add-default"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="add-default" className="cursor-pointer">Set as default address</Label>
            </div>
            <Button type="submit" className="w-full bg-[#b96a82] hover:bg-[#a05670]">
              Add Address
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={editAddressOpen} onOpenChange={setEditAddressOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAddress} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-full-name">Full Name *</Label>
                <Input
                  id="edit-full-name"
                  value={addressForm.full_name}
                  onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone *</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-address1">Address Line 1 *</Label>
              <Input
                id="edit-address1"
                value={addressForm.address_line1}
                onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-address2">Address Line 2</Label>
              <Input
                id="edit-address2"
                value={addressForm.address_line2}
                onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-state">State *</Label>
                <Input
                  id="edit-state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-postal">Postal Code *</Label>
                <Input
                  id="edit-postal"
                  value={addressForm.postal_code}
                  onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-default"
                checked={addressForm.is_default}
                onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="edit-default" className="cursor-pointer">Set as default address</Label>
            </div>
            <Button type="submit" className="w-full bg-[#b96a82] hover:bg-[#a05670]">
              Update Address
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProfileEnhanced;
