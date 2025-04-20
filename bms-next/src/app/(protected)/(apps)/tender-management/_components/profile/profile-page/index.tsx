"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyProfileData } from "../../../_utils/profile/get-profile-data";
import { TextButton } from "@/ikon/components/buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import BuyerProfile from "./BuyerProfile";
import SupplierProfile from "./SupplierProfile";
import SupplierRegistrationModal from "./supplier-register-modal";
import BuyerRegistrationModal from "./buyer-register-modal";

const TenderProfilePage = ({ currAccountId }: { currAccountId: string }) => {
  const [accountId, setaccountId] = useState(currAccountId);
  const [profileData, setProfileData] = useState<any>(null);
  const [buyerModal, setbuyerModal] = useState(false);
  const [supplierModal, setsupplierModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getMyProfileData(accountId);
        setProfileData(data);
      } catch (error) {
        toast.error("Error in fetching data");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="buyer-details">
          <AccordionTrigger className="flex justify-between items-center w-full">
            <span>Buyer Details</span>
            <TextButton onClick={() => setbuyerModal((prev) => !prev)}>
              {profileData?.buyerDetails ? "Edit" : "Create"}
            </TextButton>
          </AccordionTrigger>
          <AccordionContent>
            <BuyerProfile
              buyerDetails={
                profileData && profileData.buyerDetails
                  ? profileData.buyerDetails
                  : null
              }
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="supplier-details">
          <AccordionTrigger>
            Supplier Details
            <TextButton onClick={() => setsupplierModal((prev) => !prev)}>
              {profileData?.supplierDetails ? "Edit" : "Create"}
            </TextButton>
          </AccordionTrigger>
          <AccordionContent>
            <SupplierProfile
              supplierDetails={
                profileData && profileData.supplierDetails
                  ? profileData.supplierDetails
                  : null
              }
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {supplierModal && (
        <SupplierRegistrationModal
          isOpen={supplierModal}
          onClose={() => setsupplierModal(false)}
          accountId={accountId}
        />
      )}

      {buyerModal && (
        <BuyerRegistrationModal
          isOpen={buyerModal}
          onClose={() => setbuyerModal(false)}
          accountId={accountId}
        />
      )}
    </>
  );
};

export default TenderProfilePage;
