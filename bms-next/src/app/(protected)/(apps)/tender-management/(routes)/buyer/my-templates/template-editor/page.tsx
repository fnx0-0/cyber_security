import TemplateEditor from "@/components/TemplateEditor";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <TemplateEditor id={params.id} />;
}
