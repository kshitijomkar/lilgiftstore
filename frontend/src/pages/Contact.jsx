import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4" data-testid="contact-title">Get In Touch</h1>
          <p className="text-lg text-[#4b2e2b]/70">Have questions? We'd love to hear from you!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Name</label>
                <Input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                  data-testid="contact-name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Email</label>
                <Input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                  data-testid="contact-email"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Message</label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b] resize-none"
                  data-testid="contact-message"
                  required
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                data-testid="send-message-btn"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#b96a82]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#4b2e2b] mb-2">Email Us</h3>
                  <p className="text-[#4b2e2b]/70">hello@thelilgiftcorner.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#b96a82]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#4b2e2b] mb-2">Call Us</h3>
                  <p className="text-[#4b2e2b]/70">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f7c7d3] to-[#fce6ec] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#b96a82]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#4b2e2b] mb-2">Visit Us</h3>
                  <p className="text-[#4b2e2b]/70">Hyderabad, Telangana 500001, India</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3] rounded-3xl p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-[#4b2e2b] mb-4">Follow Us</h3>
              <p className="text-lg text-[#4b2e2b]/80 mb-4">Stay connected for daily doses of cuteness!</p>
              <div className="flex justify-center gap-4">
                <a href="https://www.instagram.com/_thelilgiftcorner/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all transform hover:scale-110">
                  <span className="text-[#b96a82] text-xl">📷</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;