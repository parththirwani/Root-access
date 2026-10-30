import { AuthProvider } from '@/src/contexts/authContext';

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
