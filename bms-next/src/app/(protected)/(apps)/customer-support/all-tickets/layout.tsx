import { Button } from "@/shadcn/ui/button";
import Link from "next/link";

export default function Examples({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={"/examples/charts"}>Charts</Link>
        </Button>
        <Button asChild>
          <Link href={"/examples/datatable"}>Datatable</Link>
        </Button>
      </div>
      {children}
    </>
  );
}
