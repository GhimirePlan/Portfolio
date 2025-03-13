import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Plan Ghimire',
  description: 'Personal portfolio of Plan Ghimire with an offline-capable 3D game',
  themeColor: '#0f172a',
  manifest: '/manifest.json',
  icons: {
    icon: '/profile.png',
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
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 