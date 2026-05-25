import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Plan Ghimire',
  description: 'Personal portfolio of Plan Ghimire, Electronics Communication & Information Engineering student from Nepal',
  themeColor: '#0f172a',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.jpg',
  },
  openGraph: {
    description: 'Personal portfolio of Plan Ghimire, Electronics Communication & Information Engineering student from Nepal',
  },
  twitter: {
    description: 'Personal portfolio of Plan Ghimire, Electronics Communication & Information Engineering student from Nepal',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.jpg" />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 