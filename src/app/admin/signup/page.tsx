import { AdminSignupPage } from "@/src/components/admin/auth/SignUpPage";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  if (process.env.DATABASE_URL) {
    try {
      const adminCount = await prisma.admin.count();

      if (adminCount > 0) {
        redirect('/admin/login');
      }
    } catch (error) {
      console.warn('[Runtime] Database not accessible during signup check:', error);
    }
  }
  
  return <AdminSignupPage />;
}