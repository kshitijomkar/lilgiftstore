import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, Sparkles, Eye, EyeOff, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthModal = ({ isOpen, onClose, onLoginSuccess, defaultTab = "login" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Update active tab when defaultTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset form states when modal closes
      setLoginData({ email: "", password: "" });
      setRegisterData({ name: "", email: "", password: "" });
      setErrors({});
      setShowLoginPassword(false);
      setShowRegisterPassword(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!validateEmail(loginData.email)) {
      newErrors.loginEmail = "Please enter a valid email address";
    }
    if (!validatePassword(loginData.password)) {
      newErrors.loginPassword = "Password must be at least 6 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, loginData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onClose();
      toast.success("Login successful! Welcome back!", {
        description: `Logged in as ${response.data.user.email}`,
      });
      if (onLoginSuccess) onLoginSuccess(response.data.user);

      if (response.data.user.role === "admin") {
        navigate("/admin");
        setTimeout(() => window.location.reload(), 100);
      } else {
        window.location.reload();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error("Login Failed", {
        description: errorMsg,
      });
      setErrors({ loginGeneral: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!registerData.name.trim()) {
      newErrors.registerName = "Name is required";
    }
    if (!validateEmail(registerData.email)) {
      newErrors.registerEmail = "Please enter a valid email address";
    }
    if (!validatePassword(registerData.password)) {
      newErrors.registerPassword = "Password must be at least 6 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/register`, registerData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      onClose();
      toast.success("Registration successful! Welcome to The Lil Gift Corner!", {
        description: `Account created for ${response.data.user.email}`,
      });
      if (onLoginSuccess) onLoginSuccess(response.data.user);

      window.location.reload();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Registration failed. Please try again.";
      toast.error("Registration Failed", {
        description: errorMsg,
      });
      setErrors({ registerGeneral: errorMsg });
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
                       border-2 border-[#f7c7d3]/40 shadow-2xl rounded-3xl backdrop-blur-sm 
                       overflow-hidden max-h-[90vh] overflow-y-auto"
            data-testid="auth-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader className="text-center space-y-3 pb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-[#f7c7d3] to-[#b96a82] 
                             rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <DialogTitle className="text-3xl font-bold text-[#4b2e2b] font-serif">
                  Welcome Back!
                </DialogTitle>
                <p className="text-sm text-[#4b2e2b]/70 leading-relaxed px-4">
                  Sign in to access your wishlist, orders, and exclusive boutique
                  perks
                </p>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2 bg-[#fce6ec]/60 p-1.5 rounded-xl shadow-inner">
                  <TabsTrigger
                    value="login"
                    data-testid="login-tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#b96a82] 
                               data-[state=active]:shadow-md rounded-lg transition-all duration-300 font-medium"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    data-testid="register-tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#b96a82] 
                               data-[state=active]:shadow-md rounded-lg transition-all duration-300 font-medium"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                {/* ---------- LOGIN FORM ---------- */}
                <TabsContent value="login" className="mt-6">
                  <motion.form
                    onSubmit={handleLogin}
                    className="space-y-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-[#4b2e2b] font-medium text-sm"
                      >
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
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            });
                            if (errors.loginEmail) {
                              setErrors({ ...errors, loginEmail: null });
                            }
                          }}
                          required
                          data-testid="login-email"
                          className={`pl-10 bg-white/90 border-[#f7c7d3]/50 
                                     focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 
                                     rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
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
                      <Label
                        htmlFor="login-password"
                        className="text-[#4b2e2b] font-medium text-sm"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => {
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            });
                            if (errors.loginPassword) {
                              setErrors({ ...errors, loginPassword: null });
                            }
                          }}
                          required
                          data-testid="login-password"
                          className={`pl-10 pr-10 bg-white/90 border-[#f7c7d3]/50 
                                     focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 
                                     rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.loginPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b96a82]/60 hover:text-[#b96a82] transition-colors"
                          data-testid="toggle-login-password"
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

                    {errors.loginGeneral && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.loginGeneral}
                      </motion.div>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] 
                                   hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full 
                                   py-6 text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 mt-2"
                        disabled={loading}
                        data-testid="login-submit-btn"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Logging in...
                          </span>
                        ) : (
                          "Login to Your Account"
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>

                {/* ---------- REGISTER FORM ---------- */}
                <TabsContent value="register" className="mt-6">
                  <motion.form
                    onSubmit={handleRegister}
                    className="space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="register-name"
                        className="text-[#4b2e2b] font-medium text-sm"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Your name"
                          value={registerData.name}
                          onChange={(e) => {
                            setRegisterData({
                              ...registerData,
                              name: e.target.value,
                            });
                            if (errors.registerName) {
                              setErrors({ ...errors, registerName: null });
                            }
                          }}
                          required
                          data-testid="register-name"
                          className={`pl-10 bg-white/90 border-[#f7c7d3]/50 
                                     focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 
                                     rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
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
                      <Label
                        htmlFor="register-email"
                        className="text-[#4b2e2b] font-medium text-sm"
                      >
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
                            setRegisterData({
                              ...registerData,
                              email: e.target.value,
                            });
                            if (errors.registerEmail) {
                              setErrors({ ...errors, registerEmail: null });
                            }
                          }}
                          required
                          data-testid="register-email"
                          className={`pl-10 bg-white/90 border-[#f7c7d3]/50 
                                     focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 
                                     rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
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
                      <Label
                        htmlFor="register-password"
                        className="text-[#4b2e2b] font-medium text-sm"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b96a82]/60" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => {
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            });
                            if (errors.registerPassword) {
                              setErrors({ ...errors, registerPassword: null });
                            }
                          }}
                          required
                          data-testid="register-password"
                          className={`pl-10 pr-10 bg-white/90 border-[#f7c7d3]/50 
                                     focus:border-[#b96a82] focus:ring-2 focus:ring-[#b96a82]/20 
                                     rounded-xl h-12 transition-all duration-300 hover:border-[#f7c7d3]
                                     ${errors.registerPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b96a82]/60 hover:text-[#b96a82] transition-colors"
                          data-testid="toggle-register-password"
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
                      <p className="text-xs text-[#4b2e2b]/60 mt-1">
                        Must be at least 6 characters long
                      </p>
                    </div>

                    {errors.registerGeneral && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.registerGeneral}
                      </motion.div>
                    )}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#f7c7d3] to-[#b96a82] 
                                   hover:from-[#b96a82] hover:to-[#a05670] text-white rounded-full 
                                   py-6 text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 mt-2"
                        disabled={loading}
                        data-testid="register-submit-btn"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Creating account...
                          </span>
                        ) : (
                          "Create Your Account"
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
