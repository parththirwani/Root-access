import { PostPage } from "@/src/components/public/PostPage";


export default function Page({ 
  params 
}: { 
  params: { slug: string; postSlug: string } 
}) {
  return <PostPage slug={params.slug} postSlug={params.postSlug} />;
}