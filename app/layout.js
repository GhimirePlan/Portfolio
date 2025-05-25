import { GoogleTagManager } from "@next/third-parties/google";
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

const inter = Inter({ subsets: ["latin"] });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Plan Ghimire",
  "url": "https://planghimire.com",
  "jobTitle": "Full Stack Developer",
  "description": "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies",
  "sameAs": [
    "https://github.com/yourusername",
    "https://linkedin.com/in/yourusername",
    "https://twitter.com/yourusername"
  ]
};

export const metadata = {
  metadataBase: new URL('https://planghimire.com'),
  title: {
    default: "Plan Ghimire | Full Stack Developer Portfolio",
    template: "%s | Plan Ghimire"
  },
  description: "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. View my portfolio, projects, and blog.",
  keywords: ["Full Stack Developer", "React Developer", "Next.js", "Node.js", "Web Development", "Portfolio"],
  authors: [{ name: "Plan Ghimire" }],
  creator: "Plan Ghimire",
  publisher: "Plan Ghimire",
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
    title: "Plan Ghimire | Full Stack Developer Portfolio",
    description: "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
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
    title: "Plan Ghimire | Full Stack Developer Portfolio",
    description: "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
    images: ["/og-image.jpg"],
    creator: "@yourtwitterhandle",
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
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://planghimire.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141b2d",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#141b2d" />
        <meta name="google-site-verification" content="your-google-site-verification" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <JsonLd data={jsonLd} />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Force dark mode and add debug indicator
            document.documentElement.classList.add('dark');
            console.log('DEBUG: Dark mode enforced in layout.js');
          `
        }} />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
            {children}
            <ScrollToTop />
          </main>
          <Footer />
          <ToastContainer />
        </Providers>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
      </body>
    </html>
  );
}
