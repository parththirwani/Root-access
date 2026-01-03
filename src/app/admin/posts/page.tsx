import { AdminLayout } from "@/src/components/admin/adminLayout";
import { PostsManager } from "@/src/components/admin/post/PostsManager";

export default function Page() {
  return (
    <AdminLayout>
      <PostsManager />
    </AdminLayout>
  );
}