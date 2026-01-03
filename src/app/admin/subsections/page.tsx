import { AdminLayout } from "@/src/components/admin/adminLayout";
import { SubsectionsManager } from "@/src/components/admin/subsections/SubSection";

export default function Page() {
  return (
    <AdminLayout>
      <SubsectionsManager/>
    </AdminLayout>
  );
}