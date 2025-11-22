'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, defaultTab = 'login' }: any) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setLoginData({ email: '', password: '' });
      setRegisterData({ name: '', email: '', password: '' });
      setErrors({});
      setShowLoginPassword(false);
      setShowRegisterPassword(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, defaultTab]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setErrors({});
    const newErrors: any = {};
    
    if (!validateEmail(loginData.email)) {
      newErrors.loginEmail = 'Please enter a valid email address';
    }
    if (!validatePassword(loginData.password)) {
      newErrors.loginPassword = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful! Welcome back!', {
          description: `Logged in as ${data.user.email}`,
        });
        onClose();
        if (onLoginSuccess) onLoginSuccess(data.user);
        window.location.reload();
      } else {
        const errorMsg = data.error || 'Login failed. Please check your credentials.';
        toast.error('Login Failed', { description: errorMsg });
        setErrors({ loginGeneral: errorMsg });
      }
    } catch (error) {
      toast.error('Login Failed', { description: 'Network error. Please try again.' });
      setErrors({ loginGeneral: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setErrors({});
    const newErrors: any = {};
    
    if (!registerData.name.trim()) {
      newErrors.registerName = 'Name is required';
    }
    if (!validateEmail(registerData.email)) {
      newErrors.registerEmail = 'Please enter a valid email address';
    }
    if (!validatePassword(registerData.password)) {
      newErrors.registerPassword = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Registration successful! Welcome to The Lil Gift Corner!', {
          description: `Account created for ${data.user.email}`,
        });
        onClose();
        if (onLoginSuccess) onLoginSuccess(data.user);
        window.location.reload();
      } else {
        const errorMsg = data.error || 'Registration failed. Please try again.';
        toast.error('Registration Failed', { description: errorMsg });
        setErrors({ registerGeneral: errorMsg });
      }
    } catch (error) {
      toast.error('Registration Failed', { description: 'Network error. Please try again.' });
      setErrors({ registerGeneral: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            className="sm:max-w-[500px] bg-gradient-to-br from-white via-[#fffafc] to-[#fce6ec]/30 
                       border-2 border-[#f7c7d3]/40 shadow-2xl rounded-lg backdrop-blur-sm 
                       overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <DialogHeader className="text-center space-y-3 pb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-[#f7c7d3] to-[#b96a82] 
                             rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <DialogTitle className="text-3xl font-bold text-[#4b2e2b] font-serif">
                  Welcome Back!
                </DialogTitle>
                <p className="text-sm text-[#4b2e2b]/70 leading-relaxed px-4">
                  Sign in to access your wishlist, orders, and exclusive boutique perks
                </p>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2 bg-[#fce6ec]/60 p-1.5 rounded-xl shadow-inner">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#b96a82] 
                               data-[state=active]:shadow-md rounded-lg transition-all duration-300 font-medium"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#b96a82] 
                               data-[state=active]:shadow-md rounded-lg transition-all duration-300 font-medium"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                {/* LOGIN FORM */}
                <TabsContent value="login" className="mt-6">
                  <motion.form
                    onSubmit={handleLogin}
                    className="space-y-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.loginGeneral && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 bg-red-100/80 text-red-700 rounded-xl"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errors.loginGeneral}</span>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-[#4b2e2b] font-medium text-sm">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) => {
                            setLoginData({ ...loginData, email: e.target.value });
                            if (errors.loginEmail) setErrors({ ...errors, loginEmail: null });
                          }}
                          onBlur={(e) => {
                            if (e.target.value && !validateEmail(e.target.value)) {
                              setErrors({ ...errors, loginEmail: 'Please enter a valid email' });
                            }
                          }}
                          className={`pl-10 bg-white/90 border-[#f7c7d3]/50 focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.loginEmail ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.loginEmail && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-xs mt-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.loginEmail}
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-[#4b2e2b] font-medium text-sm">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => {
                            setLoginData({ ...loginData, password: e.target.value });
                            if (errors.loginPassword) setErrors({ ...errors, loginPassword: null });
                          }}
                          className={`pl-10 pr-10 bg-white/90 border-[#f7c7d3]/50 focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.loginPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b96a82]/60 hover:text-[#b96a82] transition-colors"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.loginPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-xs mt-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.loginPassword}
                        </motion.div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </motion.form>
                </TabsContent>

                {/* REGISTER FORM */}
                <TabsContent value="register" className="mt-6">
                  <motion.form
                    onSubmit={handleRegister}
                    className="space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.registerGeneral && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 bg-red-100/80 text-red-700 rounded-xl"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{errors.registerGeneral}</span>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-[#4b2e2b] font-medium text-sm">
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Your full name"
                          value={registerData.name}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, name: e.target.value });
                            if (errors.registerName) setErrors({ ...errors, registerName: null });
                          }}
                          className={`pl-10 bg-white/90 border-[#f7c7d3]/50 focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.registerName ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.registerName && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-xs mt-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.registerName}
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-[#4b2e2b] font-medium text-sm">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          value={registerData.email}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, email: e.target.value });
                            if (errors.registerEmail) setErrors({ ...errors, registerEmail: null });
                          }}
                          className={`pl-10 bg-white/90 border-[#f7c7d3]/50 focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.registerEmail ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                      </div>
                      {errors.registerEmail && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-xs mt-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.registerEmail}
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-[#4b2e2b] font-medium text-sm">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, password: e.target.value });
                            if (errors.registerPassword) setErrors({ ...errors, registerPassword: null });
                          }}
                          className={`pl-10 pr-10 bg-white/90 border-[#f7c7d3]/50 focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.registerPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b96a82]/60 hover:text-[#b96a82] transition-colors"
                        >
                          {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.registerPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-500 text-xs mt-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.registerPassword}
                        </motion.div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {loading ? 'Creating account...' : 'Register'}
                    </Button>
                  </motion.form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
