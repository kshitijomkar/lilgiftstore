export default function SEOHead({ 
  title = "The Lil Gift Corner - Handcrafted Gifts & Hampers",
  description = "Your happy place for all things cute! Discover beautiful, handcrafted gifts.",
  keywords = "handcrafted gifts, wedding favors, gift hampers",
  image = "/logo.png",
  type = "website",
}: any) {
  return (
    <>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
