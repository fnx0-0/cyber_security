import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";

export default function Details({ draftDetails }: { draftDetails: any }) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <div className="flex flex-col gap-4">
              <div>
                <span>Draft Name :</span>
                <span>&nbsp;{draftDetails.title}</span>
              </div>
              <div>
                <span>Industry :</span>
                <span>&nbsp;{draftDetails.industry}</span>
              </div>
              <div>
                <span>Budget :</span>
                {/* <span>&nbsp;{draftDetails.budget}</span> */}
              </div>
              <div>
                <span>Timeline :</span>
                {/* <span>&nbsp;{draftDetails.timeline}</span> */}
              </div>
              <div>
                <span>Additional Info :</span>
                {/* <span>&nbsp;{draftDetails.additionalInfo}</span> */}
              </div>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
}
