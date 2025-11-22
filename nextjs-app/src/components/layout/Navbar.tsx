'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Menu, X, User, LogOut, Package, Settings, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/auth/AuthModal';
import { getSessionId } from '@/lib/session';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const fetchCartCount = async (setCartCount: any) => {
  try {
    const sessionId = getSessionId();
    const res = await fetch(`/api/cart?session_id=${sessionId}`);
    if (res.ok) {
      const data = await res.json();
      const totalItems = (data.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    }
  } catch (error) {
    console.error('Error fetching cart count:', error);
  }
};

const fetchWishlistCount = async (setWishlistCount: any) => {
  try {
    const res = await fetch('/api/wishlist');
    if (res.ok) {
      const data = await res.json();
      setWishlistCount((data.items || []).length);
    }
  } catch (error) {
    console.error('Error fetching wishlist count:', error);
  }
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    
    fetchCartCount(setCartCount);
    fetchWishlistCount(setWishlistCount);
    
    const handleCartUpdate = () => fetchCartCount(setCartCount);
    const handleWishlistUpdate = () => fetchWishlistCount(setWishlistCount);
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Custom Gifts', path: '/custom-gifts' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMobileMenuOpen(false);
  };

  const handleAuthModalOpen = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <motion.nav
      suppressHydrationWarning
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white border-b border-[#f0f0f0]"
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-3.5">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <motion.img
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src="/logo.png"
              alt="The Lil Gift Corner"
              className="h-10 w-10 md:h-14 md:w-14 object-contain drop-shadow-sm"
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-[#4b2e2b] transition-colors group-hover:text-[#b96a82]">
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
                href={link.path}
                className="relative text-[#4b2e2b] hover:text-[#b96a82] font-medium transition-all duration-300 py-2 px-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            ))}

            {/* Wishlist Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
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
              </Link>
            </motion.div>

            {/* Cart Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
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
              </Link>
            </motion.div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-md border-[#f7c7d3] shadow-xl rounded-2xl p-2">
                  <div className="px-3 py-3 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3]/30 rounded-xl mb-2">
                    <p className="text-sm font-semibold text-[#4b2e2b]">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-[#4b2e2b]/70">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-[#b96a82]" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg cursor-pointer">
                      <Heart className="mr-2 h-4 w-4 text-[#b96a82]" />
                      <span>My Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-gradient-to-br from-[#b96a82] to-[#a05670] text-white text-xs rounded-full px-2 py-0.5 font-semibold shadow-sm">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/order-tracking" className="text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg cursor-pointer">
                      <Package className="mr-2 h-4 w-4 text-[#b96a82]" />
                      <span>Track Order</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg cursor-pointer">
                          <Settings className="mr-2 h-4 w-4 text-[#b96a82]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => handleAuthModalOpen('login')}
                className="bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Icons & Menu */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Cart Icon */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open shopping cart"
                className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#b96a82] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Wishlist Icon */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open wishlist"
                className="relative text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#b96a82] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Profile/User Icon */}
            <div suppressHydrationWarning>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="User menu"
                      className="text-[#b96a82] hover:bg-[#fce6ec] rounded-full transition-all duration-300"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-[#f7c7d3]">
                    <DropdownMenuItem disabled className="text-[#4b2e2b] font-medium text-xs">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="text-[#4b2e2b] hover:bg-[#fce6ec]">
                        <Package className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/order-tracking" className="text-[#4b2e2b] hover:bg-[#fce6ec]">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="text-[#4b2e2b] hover:bg-[#fce6ec]">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-[#f7c7d3]/30" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 space-y-2 border-t border-[#f7c7d3]/20 pt-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div suppressHydrationWarning>
                {user ? (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-[#4b2e2b] hover:bg-[#fce6ec] rounded-lg transition-colors">
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAuthModalOpen('login');
                    }}
                    className="w-full px-4 py-2 bg-[#b96a82] hover:bg-[#a05670] text-white rounded-lg transition-colors"
                    aria-label="Login button"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authModalTab} />
    </motion.nav>
  );
}
