import { Helmet } from "react-helmet-async";

const SEOHead = ({ 
  title = "The Lil Gift Corner - Handcrafted Gifts & Hampers",
  description = "Your happy place for all things cute! Discover beautiful, handcrafted gifts, wedding favors, personalized hampers, and adorable gift wrapping in India.",
  keywords = "handcrafted gifts, wedding favors, gift hampers, personalized gifts, gift wrapping, cute gifts, boutique gifts, India",
  image = "/logo.png",
  url = "https://lilgiftstore.vercel.app",
  type = "website"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="The Lil Gift Corner" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="The Lil Gift Corner" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "The Lil Gift Corner",
          "description": description,
          "url": url,
          "logo": image,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-98765-43210",
            "contactType": "Customer Service"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;