import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, Settings, Heart, Package, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/AuthModal";
import { isAuthenticated, getUser, logout, isAdmin } from "@/utils/auth";
import { useWishlist } from "@/hooks/useWishlist";
import { getSessionId } from "@/utils/session";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState("login");
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
    
    // Fetch cart count
    fetchCartCount();
    
    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      if (isAuthenticated()) {
        setUser(getUser());
      } else {
        setUser(null);
      }
      fetchCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', fetchCartCount);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', fetchCartCount);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const sessionId = getSessionId();
      const response = await axios.get(`${API}/cart/${sessionId}`);
      const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      // Silently fail - cart might be empty
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const handleAuthModalOpen = (tab = "login") => {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Custom Gifts", path: "/custom-gifts" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-gradient-to-r from-white/85 via-[#fffafc]/90 to-white/85 backdrop-blur-lg shadow-[0_4px_20px_rgba(247,199,211,0.15)] border-b border-[#f7c7d3]/20"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group" data-testid="logo">
            <motion.img
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src="/logo.png"
              alt="The Lil Gift Corner"
              className="h-10 w-10 md:h-14 md:w-14 object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-[#4b2e2b] font-serif transition-colors group-hover:text-[#b96a82]">
                The Lil Gift Corner
              </h1>
              <p className="text-[10px] md:text-xs text-[#b96a82] font-medium">Gifts & Crafts</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-[#4b2e2b] hover:text-[#b96a82] font-medium transition-all duration-300 py-2 px-1 group"
                data-testid={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            ))}

            {user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate("/wishlist")}
                  variant="ghost"
                  size="icon"
                  className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                  data-testid="wishlist-btn"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-br from-[#b96a82] to-[#a05670] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/cart")}
                variant="ghost"
                size="icon"
                className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                data-testid="cart-btn"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-[#b96a82] to-[#a05670] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                      data-testid="user-menu-btn"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-md border-[#f7c7d3] shadow-xl rounded-2xl p-2">
                  <div className="px-3 py-3 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]/30 rounded-xl mb-2">
                    <p className="text-sm font-semibold text-[#4b2e2b]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#4b2e2b]/70">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    data-testid="profile-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                  >
                    <User className="mr-2 h-4 w-4 text-[#b96a82]" />
                    <span className="text-[#4b2e2b]">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/wishlist")}
                    data-testid="wishlist-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                  >
                    <Heart className="mr-2 h-4 w-4 text-[#b96a82]" />
                    <span className="text-[#4b2e2b]">My Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-gradient-to-br from-[#b96a82] to-[#a05670] text-white text-xs rounded-full px-2 py-0.5 font-semibold shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/track-order")}
                    data-testid="track-order-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                  >
                    <Package className="mr-2 h-4 w-4 text-[#b96a82]" />
                    <span className="text-[#4b2e2b]">Track Order</span>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin")}
                      data-testid="admin-menu-item"
                      className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4 text-[#b96a82]" />
                      <span className="text-[#4b2e2b]">Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#f7c7d3]/30 my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid="logout-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleAuthModalOpen("login")}
                  className="bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="login-btn"
                >
                  Login
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={() => navigate("/cart")}
                variant="ghost"
                size="icon"
                className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300"
                data-testid="mobile-cart-btn"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-br from-[#b96a82] to-[#a05670] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* User Icon - Opens AuthModal (not logged in) or Dropdown (logged in) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300"
                      data-testid="mobile-user-menu-btn"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-md border-[#f7c7d3] shadow-xl rounded-2xl p-2">
                  <div className="px-3 py-3 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]/30 rounded-xl mb-2">
                    <p className="text-sm font-semibold text-[#4b2e2b]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#4b2e2b]/70">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-profile-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                  >
                    <User className="mr-2 h-4 w-4 text-[#b96a82]" />
                    <span className="text-[#4b2e2b]">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/wishlist");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-wishlist-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                  >
                    <Heart className="mr-2 h-4 w-4 text-[#b96a82]" />
                    <span className="text-[#4b2e2b]">My Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-gradient-to-br from-[#b96a82] to-[#a05670] text-white text-xs rounded-full px-2 py-0.5 font-semibold shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/track-order");
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-track-order-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                  >
                    <Package className="mr-2 h-4 w-4 text-[#b96a82]" />
                    <span className="text-[#4b2e2b]">Track Order</span>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/admin");
                        setMobileMenuOpen(false);
                      }}
                      data-testid="mobile-admin-menu-item"
                      className="rounded-lg my-1 cursor-pointer hover:bg-[#fce6ec] transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4 text-[#b96a82]" />
                      <span className="text-[#4b2e2b]">Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#f7c7d3]/30 my-2" />
                  <DropdownMenuItem
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="mobile-logout-menu-item"
                    className="rounded-lg my-1 cursor-pointer hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={() => handleAuthModalOpen("login")}
                  variant="ghost"
                  size="icon"
                  className="text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300"
                  data-testid="mobile-login-btn"
                >
                  <User className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Hamburger Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[#4b2e2b] p-2 hover:bg-[#fce6ec] rounded-full transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-btn"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-[#f7c7d3]/20"
              data-testid="mobile-menu"
            >
              <div className="flex flex-col py-3 px-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[#4b2e2b] hover:text-[#b96a82] font-medium transition-colors duration-300 py-2.5"
                      data-testid={`mobile-nav-${link.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Login/Register buttons for non-authenticated users in mobile menu */}
                {!user && (
                  <div className="border-t border-[#f7c7d3]/20 mt-3 pt-3 space-y-2">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                    >
                      <Button
                        onClick={() => handleAuthModalOpen("login")}
                        className="w-full bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] hover:from-[#e8b3c3] hover:to-[#a85973] text-white rounded-full py-5 font-medium transition-all duration-300"
                        data-testid="mobile-menu-login-btn"
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (navLinks.length + 1) * 0.05, duration: 0.3 }}
                    >
                      <Button
                        onClick={() => handleAuthModalOpen("register")}
                        variant="outline"
                        className="w-full border border-[#f7c7d3] text-[#b96a82] hover:text-[#a05670] hover:border-[#b96a82] bg-transparent rounded-full py-5 font-medium transition-all duration-300"
                        data-testid="mobile-menu-register-btn"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setAuthModalOpen(false);
        }}
        defaultTab={authDefaultTab}
      />
    </motion.nav>
  );
};

export default Navbar;
