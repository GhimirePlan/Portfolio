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

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Plan Ghimire | Portfolio",
  description: "Plan Ghimire's portfolio website",
};

export const viewport = {
  themeColor: "#141b2d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
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
