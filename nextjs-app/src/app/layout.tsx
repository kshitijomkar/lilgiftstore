import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Suppress Sentry warnings in dev
process.env.SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING = '1';

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'sans-serif'],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['Georgia', 'serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b96a82',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:5000'),
  title: "The Lil Gift Corner - Handcrafted Gifts & Wedding Favors",
  description: "Your happy place for all things cute! Shop handcrafted gifts, wedding favors, and personalized hampers. Fast shipping & beautiful packaging.",
  keywords: "gifts, handcrafted, wedding favors, hampers, personalized gifts, cute gifts",
  authors: [{ name: "The Lil Gift Corner" }],
  robots: "index, follow",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:5000',
    siteName: 'The Lil Gift Corner',
    title: 'The Lil Gift Corner - Handcrafted Gifts & Wedding Favors',
    description: 'Your happy place for all things cute! Shop handcrafted gifts, wedding favors, and personalized hampers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Lil Gift Corner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Lil Gift Corner',
    description: 'Handcrafted gifts & personalized hampers',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Lil Gift Corner',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#b96a82" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Performance: Preconnect to critical domains */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Critical resources preload */}
        <link rel="preload" as="image" href="/logo.png" type="image/png" />
        <link rel="preload" as="image" href="/favicon.ico" type="image/x-icon" />
        
        {/* Canonical tag */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:5000'} />
      </head>
      <body className={poppins.className} suppressHydrationWarning style={{
        '--font-poppins': poppins.style.fontFamily,
        '--font-playfair': playfair.style.fontFamily,
      } as React.CSSProperties}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
