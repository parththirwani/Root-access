import { AdminSignupPage } from "@/src/components/admin/auth/SignUpPage";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return <AdminSignupPage />;
}