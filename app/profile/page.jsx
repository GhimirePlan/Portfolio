import nextDynamic from 'next/dynamic';

// Force dynamic rendering to prevent pre-rendering during build
export const dynamic = 'force-dynamic';

// Dynamically import the client component with SSR disabled
const ProfileClient = nextDynamic(() => import('./ProfileClient'), { ssr: false });

// Server component
export default function ProfilePage() {
  return <ProfileClient />;
} 