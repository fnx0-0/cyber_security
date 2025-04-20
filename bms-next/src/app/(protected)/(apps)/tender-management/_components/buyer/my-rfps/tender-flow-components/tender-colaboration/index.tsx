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
import { MessageCircle } from "lucide-react";

export default function TenderColaborationSection() {
  return (
    <>
      <>
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
              Collaboration
              <Sheet>
                <SheetTrigger>
                  <MessageCircle />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <CardDescription>
              <div className="">
                <h5>Draft Details will shown here</h5>
                
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      </>
    </>
  );
}
