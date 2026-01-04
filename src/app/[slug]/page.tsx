import { SubsectionPage } from "@/src/components/public/SubSectionPage";

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  return <SubsectionPage slug={slug} />;
}