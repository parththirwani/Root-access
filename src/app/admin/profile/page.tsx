import { AdminLayout } from "@/src/components/admin/adminLayout";
import { ProfileManager } from "@/src/components/admin/profile/profileManager";

export default function Page() {
  return (
    <AdminLayout>
      <ProfileManager />
    </AdminLayout>
  );
}