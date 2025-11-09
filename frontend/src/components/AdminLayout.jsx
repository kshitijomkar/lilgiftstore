import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingBag, Users, MessageSquare, Gift, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { logout } from "@/utils/auth";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: Gift, label: "Custom Gifts", path: "/admin/custom-gifts" },
    { icon: MessageSquare, label: "Contacts", path: "/admin/contacts" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffafc] to-[#fce6ec]" data-testid="admin-layout">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-md border-r border-[#f7c7d3] shadow-lg">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3 mb-8" data-testid="admin-logo">
              <img src="/logo.png" alt="The Lil Gift Corner" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-[#4b2e2b]">Admin Panel</h1>
                <p className="text-xs text-[#b96a82]">The Lil Gift Corner</p>
              </div>
            </Link>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#b96a82] text-white"
                        : "text-[#4b2e2b] hover:bg-[#fce6ec]"
                    }`}
                    data-testid={`admin-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-[#f7c7d3]">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start gap-3 border-[#f7c7d3] text-[#4b2e2b] hover:bg-[#fce6ec]"
                data-testid="admin-logout-btn"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;