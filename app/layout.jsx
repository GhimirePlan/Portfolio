import './globals.css';
import './css/site.css';
import ClientLayout from './ClientLayout';
import Providers from './providers';

export const metadata = {
  title: { default: 'Plan Ghimire | Portfolio', template: '%s | Plan Ghimire' },
  description: 'Personal portfolio of Plan Ghimire, Electronics Communication & Information Engineering student from Nepal',
  manifest: '/manifest.json',
  icons: { icon: '/icons/site-icon-64-v2.png', apple: '/icons/site-icon-180-v2.png' },
  openGraph: { title: 'Plan Ghimire | Portfolio', description: 'Electronics Communication & Information Engineering student from Nepal' },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#041121', colorScheme: 'dark light' };

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><Providers><ClientLayout>{children}</ClientLayout></Providers></body></html>;
}
