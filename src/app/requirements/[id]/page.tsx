import RequirementWorkspace from "@/components/RequirementWorkspace";

type PageProps = { params: Promise<{ id: string }> };

export default async function RequirementDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <RequirementWorkspace page="detail" requirementId={id} />;
}
