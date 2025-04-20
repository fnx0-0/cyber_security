"use client";
import { getTicket } from "@/ikon/utils/actions/auth";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import CollaborationSection from "../collaboration-section";

export default function BidDetails({ bidDetails }: { bidDetails: any }) {
  console.log("Bid Details", bidDetails);
  const [file, setfile] =
    bidDetails && bidDetails[0] && bidDetails[0].responseDraftResource
      ? useState(bidDetails[0].responseDraftResource)
      : useState(null);
  const [draftContent, setDraftContent] =
    bidDetails && bidDetails[0] && bidDetails[0].responseDraftContent
      ? useState(bidDetails[0].responseDraftContent)
      : useState(null);

  const viewFile = async (data: File) => {
    console.log("View File", data);
    const ticket = await getTicket();

    /* const url =
           `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
           `&resourceId=${encodeURIComponent(data.resourceId)}` +
           `&resourceName=${encodeURIComponent(data.resourceName)}` +
           `&resourceType=${encodeURIComponent(data.resourceType)}`;*/

    //window.open(encodeURI(url), "_blank");
    let link = "";
    if (
      data.resourceType == "image/jpeg" ||
      data.resourceType == "image/png" ||
      data.resourceType == "text/plain" ||
      data.resourceType == "application/pdf" ||
      data.resourceType == "video/mp4" ||
      data.resourceType == "image/gif"
    ) {
      var pdf_newTab = window.open();
      link =
        `${DOWNLOAD_URL}?ticket=${ticket}` +
        `&resourceId=${data.resourceId}` +
        `&resourceType=${data.resourceType}`;
      pdf_newTab.document.write(
        `<iframe id='viewdocId' width='100%' height='100%' src=''></iframe><script>var iframe = document.getElementById('viewdocId'); iframe.src = '${link}'</script>`
      );
    } else {
      link =
        `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
        `&resourceId=${encodeURIComponent(data.resourceId)}` +
        `&resourceName=${encodeURIComponent(data.resourceName)}` +
        `&resourceType=${encodeURIComponent(data.resourceType)}`;
      window.open(encodeURI(link), "_blank");
    }
  };

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Details
            <Sheet>
              <SheetTrigger>
                <MessageCircle />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Comments</SheetTitle>
                  <SheetDescription>
                    <CollaborationSection
                      draftId={bidDetails.id}
                      supplierId={bidDetails.supplierId}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <CardDescription>
            <div className="">
              {file ? (
                <>
                  <p>{file.resourceName}</p>{" "}
                  <p onClick={() => viewFile(file)}>Download</p>
                </>
              ) : (
                <>
                  <ScrollArea>
                    {/* <p>{draftContent}</p> */}
                    <div dangerouslySetInnerHTML={{__html : draftContent}}></div>
                  </ScrollArea>
                </>
              )}
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
}
