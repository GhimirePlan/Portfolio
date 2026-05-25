import { GoogleTagManager } from "@next/third-parties/google";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import "./css/tailwind.css";
import "./css/globals.scss";
import "./css/navbar.css";
import "./css/card.scss";
import ScrollToTop from "./components/helper/scroll-to-top";
import Providers from "./providers";
import JsonLd from "./components/JsonLd";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Plan Ghimire",
  "url": "https://planghimire.com",
  "jobTitle": "Developer",
  "description": "Personal portfolio of Plan Ghimire",
  "sameAs": [
    "https://github.com/planghimire",
    "https://linkedin.com/in/planghimire",
    "https://twitter.com/planghimire"
  ]
};

export const metadata = {
  metadataBase: new URL('https://planghimire.com'),
  title: {
    default: "Plan Ghimire | Developer Portfolio",
    template: "%s | Plan Ghimire"
  },
  description: "Personal portfolio of Plan Ghimire",
  keywords: ["Developer", "React Developer", "Next.js", "Node.js", "Web Development", "Portfolio"],
  authors: [{ name: "Plan Ghimire" }],
  creator: "Plan Ghimire",
  publisher: "Plan Ghimire",
  icons: {
    icon: '/favicon.jpg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://planghimire.com",
    siteName: "Plan Ghimire Portfolio",
    title: "Plan Ghimire | Developer Portfolio",
    description: "Personal portfolio of Plan Ghimire",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Plan Ghimire Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan Ghimire | Developer Portfolio",
    description: "Personal portfolio of Plan Ghimire",
    images: ["/og-image.jpg"],
    creator: "@planghimire",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification", // Replace with your actual Google verification code when you have one
  },
  alternates: {
    canonical: "https://planghimire.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#141b2d",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  const ua = headers().get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling|googlebot/i.test(ua);
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.jpg" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Theme color is handled by the viewport export */}
        {/* Google verification is handled by the metadata object */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <JsonLd data={jsonLd} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {isBot ? (
          <>
            <Navbar />
            <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
              {children}
            </main>
            <Footer />
          </>
        ) : (
          <Providers>
            <Navbar />
            <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
              {children}
              <ScrollToTop />
            </main>
            <Footer />
            <ToastContainer />
          </Providers>
        )}
        {process.env.NEXT_PUBLIC_GTM ? <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} /> : null}
      </body>
    </html>
  );
}
