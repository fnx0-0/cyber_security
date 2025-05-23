import WidgetData from "./widget-data";

export default function LicenseDetails({ params }: { params: { id: string } }) {
  return (
    <div className="w-full h-full">
      <WidgetData id={params.id} />
    </div>
  );
}
