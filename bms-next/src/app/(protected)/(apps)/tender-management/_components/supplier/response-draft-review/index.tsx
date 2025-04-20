"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/shadcn/ui/sheet";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { getProjectDetailsData } from "@/app/(protected)/(apps)/tender-management/_utils/common/get-particular-project-details-data";
import getParticularBidData from "../get-particular-bid-data";
import KendoEditor from "../../text-editor-component";
import { ChatSection } from "../../buyer/my-templates/template-form/ChatSection";
import { saveDraftFinalizeData } from "../../../_utils/supplier/bid-workflow-functions";

const {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Undo,
  Redo,
} = EditorTools;

// Mock API function to fetch existing data
const fetchTemplateById = async (id: string) => {
  return {
    templateName: "Sample Template",
    sector: "IT",
    content: "<p>Sample content in Kendo Editor</p>",
  };
};

interface TemplateEditorProps {
  draftId : string;
  accountId : string;
}

export default function ResponseDraftReview({ draftId, accountId }: TemplateEditorProps) {
  console.log("id received", draftId);
  const router = useRouter();
  const [editorValue, setEditorValue] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const editorRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState([]);

  const isEditing = draftId !== "new"; // If id is "new", it's create mode

  const getContent = () => {
    return editorRef.current?.getHtml();
  };

  const setContentHandler = (html) => {
    editorRef.current?.setHtml(html);
  };

  useEffect(() => {
    const fetchDraftData = async () => {
      try {
        const bidData: any = await getParticularBidData(draftId, accountId);
        if (bidData[0].selectedResponseTemplate) {
          setContentHandler(bidData[0].responseDraftContent);
        }
       
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
      }
    };

    fetchDraftData();
  }, [draftId, isEditing]);

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  const handleSave = async () => {
    console.log("Textarea Value:", editorValue);
    //console.log("File:", file);
    //   if (!editorValue) {
    //     toast.error("Please enter text");
    //     return;
    //   }
    try {
      const html = getContent();
     await saveDraftFinalizeData(html, draftId, accountId, null);
      toast.success("Draft Saved");
      console.log("success");
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard!");
    }
  };

  return (
    <div className="max-w-full mx-auto p-3 space-y-2">
      <h2 className="text-lg font-bold">Review Draft</h2>

      {/* Kendo Editor for rich text editing */}
      <div>
        <KendoEditor
          initialContent=""
          onChange={() => {}}
          height={640}
          ref={editorRef}
        />
      </div>

      <div className="flex justify-between">
        <Button onClick={handleSave}>{isEditing ? "Save" : "Create"}</Button>
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Chat with AI</Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-4"
            style={{ maxWidth: "30vw" }}
          >
            <SheetHeader>
              <SheetTitle>Chat with AI</SheetTitle>
              <SheetDescription>
                Chat with AI to get suggestions for your draft
              </SheetDescription>
            </SheetHeader>
            <ChatSection
              messages={messages}
              setMessages={setMessages}
              onCopy={(text) => handleCopy(text)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
