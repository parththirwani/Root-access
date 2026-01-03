import { AdminLayout } from "@/src/components/admin/adminLayout";
import { SectionsManager } from "@/src/components/admin/section/sectionManager";


export default function Page() {
  return (
    <AdminLayout>
      <SectionsManager />
    </AdminLayout>
  );
}