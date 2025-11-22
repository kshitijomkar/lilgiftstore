'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CustomGifts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    description: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.occasion || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/custom-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Request submitted! We'll get back to you soon.");
        setFormData({ name: '', email: '', phone: '', occasion: '', description: '', budget: '' });
      } else {
        toast.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Custom Gifts - Design Your Perfect Gift"
        description="Create a personalized, custom gift just the way you want it."
        type="website"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4b2e2b] mb-4">
            Custom Gift Requests
          </h1>
          <p className="text-lg text-muted">
            Have something special in mind? Let us create a personalized gift just for you!
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                />
              </div>

              <div>
                <label className="block text-[#4b2e2b] font-medium mb-2">Occasion *</label>
                <Input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  placeholder="e.g., Wedding, Birthday"
                  className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4b2e2b] font-medium mb-2">Budget (Optional)</label>
              <Input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., $50-$100"
                className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b]"
              />
            </div>

            <div>
              <label className="block text-[#4b2e2b] font-medium mb-2">Description *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your gift idea, preferences, and any special requirements"
                rows={6}
                className="bg-white/80 border-[#f7c7d3] text-[#4b2e2b] resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg bg-[#b96a82] hover:bg-[#a05670] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-br from-[#fce6ec] to-[#f7c7d3] rounded-3xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-[#4b2e2b] mb-4">What Happens Next?</h3>
          <p className="text-lg text-[#4b2e2b]/80 leading-relaxed">
            Our team will review your request and get back to you within 24-48 hours with a
            personalized proposal. We'll work with you to create the perfect gift that matches your
            vision and budget!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
