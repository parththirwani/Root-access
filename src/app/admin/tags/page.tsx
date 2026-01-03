import { AdminLayout } from "@/src/components/admin/adminLayout";
import { TagsManager } from "@/src/components/admin/tags/tagsManager";


export default function Page() {
  return (
    <AdminLayout>
      <TagsManager />
    </AdminLayout>
  );
}