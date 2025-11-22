'use client';

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Newsletter signup coming soon!');
  };

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-6 py-3 rounded-full text-[#4b2e2b] focus:outline-none focus:ring-2 focus:ring-white"
        required
      />
      <button 
        type="submit"
        className="px-8 py-3 bg-white text-[#b96a82] hover:bg-gray-100 rounded-full font-semibold whitespace-nowrap transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
