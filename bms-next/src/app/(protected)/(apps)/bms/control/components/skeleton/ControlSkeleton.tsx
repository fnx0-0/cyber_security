import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn/ui/card";
import { Skeleton } from "@/shadcn/ui/skeleton";

export default function ControlSkeleton() {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="space-y-2 w-full">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-full rounded" />
          <div className="flex justify-between text-xs">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div> */}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}
