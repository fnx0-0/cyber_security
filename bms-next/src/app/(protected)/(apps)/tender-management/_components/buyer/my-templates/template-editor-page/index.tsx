"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shadcn/ui/sheet";
import { ChatSection } from "../template-form/ChatSection";
import KendoEditor from "../../../text-editor-component";
import { v4 as uuidv4 } from "uuid";
import { editTemplateData, getTemplateData, startTemplate } from "../../../../_utils/buyer/my-templates/template-functions";
import { toast } from "sonner";
import { RfpTemplate } from "../../../../_utils/common/types";
//import { ChatSection } from "@/components/ChatSection"; // Import Chat Section

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
  id: string;
}

export default function TemplateEditor({ id }: TemplateEditorProps) {
  console.log('id received', id);
  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [sector, setSector] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const editorRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState([])

  const isEditing = id !== "new"; // If id is "new", it's create mode

  const getContent = () => {
    return editorRef.current?.getHtml();
  };

  const setContentHandler = (html) => {
    editorRef.current?.setHtml(html);
  };

  async function getRfpData() {
      try {
        if (id) {
          const formData: any = await getTemplateData(id);
          // Object.entries(formData).forEach(([key, value]) =>
          //   form.setValue(key as keyof TemplateFormValues, value)
          // );
          setTemplateName(formData.templateName);
          setSector(formData.templateCategory);
          setContentHandler(formData.templateText);
        }
      } catch (error) {
        console.error("Error fetching RFP data:", error);
        //setRfpData([]);
      } finally {
        //setLoading(false);
      }
    }

  useEffect(() => {
    if (isEditing) {
      // Fetch existing record
      getRfpData();
    }
  }, [id, isEditing]);

  const handleGenerateUUID = () => {
      const newUUID = uuidv4();
      console.log("Generated UUID:", newUUID);
      return newUUID;
    };

  const handleSave = async () => {
    console.log("submit clicked");

    try {
      if (isEditing) {
        console.log("updating template");
        const payload = {
          templateName,
          templateCategory: sector,
          templateId: id,
          templateText: getContent(),
        };
        const res = await editTemplateData(id, payload);
        console.log("edited");
      } else {
        console.log("creating template");
        //console.log("Form Data:", data);
        const uuid = handleGenerateUUID();
        const payload = {
          templateName,
          templateCategory: sector,
          templateId: uuid,
          templateText: getContent(),
        };
        const response = await startTemplate(payload);
        console.log("started");
      }
      toast.success("Template saved successfully");
    } catch (error) {
      console.log("error",error);
      toast.error("Failed to perform action");
    }
    // startTransition(() => {
    //   router.refresh();
    // });
  };

  return (
    <div className="max-w-full mx-auto p-3 space-y-2">
      <h2 className="text-lg font-bold">
        {isEditing ? "Edit Template" : "Create New Template"}
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Template Name</Label>
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
        <div>
          <Label>Sector</Label>
          <Input value={sector} onChange={(e) => setSector(e.target.value)} />
        </div>
      </div>

      {/* Kendo Editor for rich text editing */}
      <div>
        <Label>Template Content</Label>
        <KendoEditor
          initialContent=""
          onChange={() => {}}
          height={550}
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
                Chat with AI to get suggestions for your template
              </SheetDescription>
            </SheetHeader>
            <ChatSection messages={messages} setMessages={setMessages} onCopy={(text) => setContentHandler(text)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
