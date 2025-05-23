"use client";
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
import CollaborationSection from "../collaboration/collaboration-section";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { getTicket } from "@/ikon/utils/actions/auth";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
//import { DOWNLOAD_URL } from "../../../../../../../../config/urls";

export default function DraftView({ draftDetails }: { draftDetails: any }) {
  const [file, setfile] = draftDetails.draftResource
    ? useState(draftDetails.draftResource)
    : useState(null);
  const [draftContent, setDraftContent] = draftDetails.draftContent
    ? useState(draftDetails.draftContent)
    : useState("");

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

  function formatText(text: any) {
    return text
      .replace(/\n/g, "<br />") // Replace newlines with HTML line breaks
      .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"); // Replace tabs with spaces
  }

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
                    <CollaborationSection draftId={draftDetails.id} />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <CardDescription>
            <div className="">
              <h5>Draft Details will shown here</h5>
              {file ? (
                <>
                  <p>{file.resourceName}</p>{" "}
                  <p onClick={() => viewFile(file)}>Download</p>
                </>
              ) : (
                <>
                  <ScrollArea className="h-[700px]">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: draftContent,
                      }}
                    >
                      {/* {draftContent} */}
                    </div>
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
