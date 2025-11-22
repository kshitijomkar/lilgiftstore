'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, Calendar, MapPin, Edit, Plus, Trash2, Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { formatINR } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface User {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items?: any[];
  payment_method?: string;
  address?: any;
}

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          toast.error('Please login to view your profile');
          router.push('/');
          return;
        }

        const userData = await res.json();
        setUser(userData);
        setProfileForm({
          name: userData.name || '',
          phone: userData.phone || '',
        });

        // Fetch both orders and addresses
        const [ordersRes, addressesRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/addresses'),
        ]);

        if (ordersRes.ok) {
          const profileData = await ordersRes.json();
          setOrders(profileData.orders || []);
        }

        if (addressesRes.ok) {
          const addressData = await addressesRes.json();
          setAddresses(addressData.addresses || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (res.ok) {
        const updatedUser = { ...user, ...profileForm };
        setUser(updatedUser as User);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
        setEditProfileOpen(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });

      if (res.ok) {
        toast.success('Address added successfully!');
        setAddAddressOpen(false);
        resetAddressForm();
        fetchData();
      } else {
        toast.error('Failed to add address');
      }
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) return;

    try {
      const res = await fetch(`/api/user/addresses/${selectedAddress.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });

      if (res.ok) {
        toast.success('Address updated successfully!');
        setEditAddressOpen(false);
        setSelectedAddress(null);
        resetAddressForm();
        fetchData();
      } else {
        toast.error('Failed to update address');
      }
    } catch (error) {
      toast.error('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Address deleted successfully!');
        fetchData();
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      is_default: false,
    });
  };

  const openEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setAddressForm({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setEditAddressOpen(true);
  };

  const fetchData = async () => {
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/addresses'),
      ]);

      if (ordersRes.ok) {
        const profileData = await ordersRes.json();
        setOrders(profileData.orders || []);
      }

      if (addressesRes.ok) {
        const addressData = await addressesRes.json();
        setAddresses(addressData.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <SEOHead
        title="My Profile - The Lil Gift Corner"
        description="Manage your profile, addresses, and order history."
        type="website"
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <h1 className="text-4xl font-bold text-[#4b2e2b] mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Info & Addresses */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info Card */}
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm">
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
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Name</p>
                  <p className="text-lg font-semibold text-[#4b2e2b]">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Email</p>
                  <p className="text-lg font-semibold text-[#4b2e2b]">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-[#4b2e2b]/70">Phone</p>
                    <p className="text-lg font-semibold text-[#4b2e2b]">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[#4b2e2b]/70">Role</p>
                  <p className="text-lg font-semibold text-[#4b2e2b] capitalize">{user.role}</p>
                </div>
              </CardContent>
            </Card>

            {/* Addresses Card */}
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm">
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
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <MapPin className="w-12 h-12 mx-auto text-[#f7c7d3] mb-2" />
                    <p className="text-sm text-[#4b2e2b]/70">No addresses added</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-3 bg-[#fce6ec]/30 rounded-lg border border-[#f7c7d3] relative"
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

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <Card className="border-[#f7c7d3] bg-white/60 backdrop-blur-sm">
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
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto text-[#f7c7d3] mb-4" />
                    <p className="text-lg text-[#4b2e2b]/70">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 bg-[#fce6ec]/30 rounded-lg border border-[#f7c7d3]">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-[#4b2e2b]">
                              Order #{order.id ? order.id.slice(0, 8) : 'UNKNOWN'}
                            </p>
                            <p className="text-sm text-[#4b2e2b]/70 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-[#4b2e2b]/60 mt-1">
                              Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-[#b96a82]">
                              {formatINR(order.total_amount)}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
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
              <Label htmlFor="add-default" className="cursor-pointer">
                Set as default address
              </Label>
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
              <Label htmlFor="edit-default" className="cursor-pointer">
                Set as default address
              </Label>
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
}
