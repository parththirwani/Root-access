import { AdminSignupPage } from "@/src/components/admin/auth/SignUpPage";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  const adminCount = await prisma.admin.count();

  if (adminCount > 0) {
    redirect('/admin/login');
  }
  
  return <AdminSignupPage />;
}