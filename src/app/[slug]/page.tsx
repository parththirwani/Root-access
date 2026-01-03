import { SubsectionPage } from "@/src/components/public/SubSectionPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <SubsectionPage slug={params.slug} />;
}