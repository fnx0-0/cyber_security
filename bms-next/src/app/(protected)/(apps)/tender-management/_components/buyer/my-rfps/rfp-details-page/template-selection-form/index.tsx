"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  getAllTemplates,
  saveTemplateSelectionData,
} from "../../../../../_utils/buyer/my-rfps/rfp-details-page/template-selection-functions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getProjectDetailsData } from "@/app/(protected)/(apps)/tender-management/_utils/common/get-particular-project-details-data";
import { ScrollArea } from "@/shadcn/ui/scroll-area";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string;
}

const SelectCardModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  draftId,
}) => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Fetch Cards from API
  useEffect(() => {
    if (!isOpen) return;

    const fetchCards = async () => {
      setLoading(true);
      setError("");
      try {
        const data: any[] = await getAllTemplates();
        console.log("Fetched Cards:", data);
        setCards(data);
        const draftData: any = await getProjectDetailsData(
          draftId ? draftId : ""
        );
        if (draftData.selectedTemplate) {
          setSelectedCard(draftData.selectedTemplate);
        }
      } catch (err) {
        setError("Failed to fetch cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [isOpen, draftId]);

  useEffect(() => {
    if (selectedCard && cards.length > 0) {
      const selectedTemplate = cards.find(
        (card) => card.templateId === selectedCard
      );
      if (selectedTemplate) {
        setTextareaValue(selectedTemplate.templateText);
      }
    }
  }, [cards, selectedCard]);

  // Handle Card Selection
  const handleSelect = (card: any) => {
    setSelectedCard(card.templateId);
    setTextareaValue(card.templateText); // Fill textarea with templateText
  };

  // Handle Submit
  const handleSubmit = async () => {
    console.log("Selected Card:", selectedCard);
    console.log("Textarea Value:", textareaValue);
    try {
      await saveTemplateSelectionData(selectedCard, textareaValue, draftId);
      toast.success("Template Saved");
      console.log("success");
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80dvw] h-[90dvh] p-6">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-center">Loading cards...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left Section - Cards Grid */}
          <div className="grid grid-cols-3 gap-2">
            {!loading &&
              !error &&
              cards.map((card) => (
                <Card
                  key={card.templateId}
                  onClick={() => handleSelect(card)}
                  className={`cursor-pointer p-4 border h-[10dvh] ${
                    selectedCard === card.templateId
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent>
                    <h3 className="font-semibold">{card.templateName}</h3>
                    <p className="text-sm text-gray-500">
                      {card.templateCategory}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Right Section - Textarea */}
          <div className="flex flex-col">
            {/* <Textarea
              className="h-[50dvh] resize-none"
              placeholder="Enter details here..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            /> */}
            <ScrollArea className="h-[70dvh] border rounded-lg p-4">
              <div dangerouslySetInnerHTML={{ __html: textareaValue }}></div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer - Confirm Button */}
        <DialogFooter>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmit} disabled={!selectedCard}>
              Confirm Selection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCardModal;
