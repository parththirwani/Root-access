import { PostPage } from "@/src/components/public/PostPage";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string; postSlug: string }> 
}) {
  const { slug, postSlug } = await params;
  return <PostPage slug={slug} postSlug={postSlug} />;
}