import { AdminLayout } from "@/src/components/admin/adminLayout";
import { AdminDashboard } from "@/src/components/admin/dashboard/adminDashboard";


export default function Page() {
  console.log("Login successful")
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}