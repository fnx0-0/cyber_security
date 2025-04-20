"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { BillingSchema } from "../billing-schema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";

interface BillingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAcc?: {} | any;
}
interface Server {
  name: string;
  config: string;
}

interface Resource {
  resourceId: string;
  resourceName: string;
  resourceSize: number;
  resourceType: string;
  fileContentDate: string;
  uploadDate: string;
  uploadType: string;
  isNewUpload: boolean;
  server: string;
  config: string;
}
interface BillingAccountProps {
  id: string;
  name: string;
  parentAccount: string;
  childAccounts: string[];
  servers: Server[];
  resources: Resource[];
  createdOn: string;
  updatedOn: string;
  isParent: boolean;
  isActive?: boolean;
  parentId?: string;
  production?: boolean;
  development?: boolean;
  uat?: boolean;
  preProduction?: boolean;
  [key: string]: any;
}

interface serverProps {
  [x: string]: string;
  serverName?: string | undefined;
}

const BillingModal: React.FC<BillingDetailsProps> = ({
  isOpen,
  onClose,
  selectedAcc = {},
}) => {
  const [server, setServer] = useState([]);
  const [configuration, setConfiguration] = useState<
    { value: string; label: string }[]
  >([]);
  const router = useRouter();

  const [selectedAccData, setSelectedAccData] =
    useState<BillingAccountProps | null>(null);
  const [isChildAcc, setIsChildAcc] = useState(false);
  const [hasSelectedAcc, setHasSelectedAcc] = useState(false);
  const [account, setAccount] = useState([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const [parentAccountSet, setParentAccount] = useState([]);
  const [accountAc, setAccountAc] = useState([]);

  const form = useForm<z.infer<typeof BillingSchema>>({
    resolver: zodResolver(BillingSchema),
    defaultValues: {
      name: selectedAcc?.name || "",
    },
  });

  useEffect(() => {
    setSelectedAccData(selectedAcc);
    form.reset({
      name: selectedAcc?.name || "",
    });

    if (selectedAcc && Object.keys(selectedAcc).length > 0) {
      setHasSelectedAcc(true);
      setIsChildAcc(false);
    } else {
      setHasSelectedAcc(false);
    }
  }, [selectedAcc, form]);

  const fetchLicenseData = async () => {
    try {
      const accountInsData = await getMyInstancesV2({
        processName: "Account",
        predefinedFilters: { taskName: "View State" },
        projections: ["Data"],
      });

      const accountData: any = accountInsData.map((e: any) => e.data);
      console.log("accountData", accountData);
      setAccount(accountData);
      const account = accountData.map(
        (item: { accountName: any; accountIdentifier: any }) => ({
          label: item.accountName,
          value: item.accountIdentifier,
        })
      );
      setAccountAc(account);

      const billingInsData = await getMyInstancesV2({
        processName: "Billing Account",
        predefinedFilters: { taskName: "View" },
        projections: ["Data"],
      });

      const billingData: any = billingInsData.map((e: any) => e.data);
      console.log("billingData", billingData);
      const parentAccount = billingData.map((item: { name: any; id: any }) => ({
        label: item.name,
        value: item.id,
      }));
      setParentAccount(parentAccount);
      setBillingAccount(billingData);

      var serverMap: any = [
        {
          server: "Development",
          configs: ["Billing Events", "User List", "Activity Logs"],
        },
        {
          server: "UAT",
          configs: ["Billing Events", "User List", "Activity Logs"],
        },
        {
          server: "Pre Production",
          configs: ["Billing Events", "User List", "Activity Logs"],
        },
        {
          server: "Production",
          configs: ["Billing Events", "User List", "Activity Logs"],
        },
      ];

      setServer(serverMap);

      var configurationMap = [
        { value: "Billing Events", label: "Billing Events" },
        { value: "User List", label: "User List" },
        { value: "Activity Logs", label: "Activity Logs" },
      ];

      setConfiguration(configurationMap);
    } catch (error) {
      console.error("Error fetching License:", error);
    }
  };

  useEffect(() => {
    fetchLicenseData();
  }, []);

  function handleChildAccountChange(checked: boolean) {
    setIsChildAcc(checked);
  }

  const columns: ColumnDef<serverProps>[] = [
    {
      accessorKey: "select",
      header: () => <div style={{ textAlign: "center" }}>Select</div>,
      cell: ({ row }) => <Checkbox />,
    },
    {
      accessorKey: "server",
      header: () => <div style={{ textAlign: "center" }}>Server</div>,
      cell: ({ row }) => <span>{row.original?.server || "n/a"}</span>,
    },
    {
      accessorKey: "configuration",
      header: () => <div style={{ textAlign: "center" }}>Configuration</div>,
      cell: ({ row }) => (
        <FormComboboxInput
          items={configuration}
          formControl={form.control}
          name={`configuration-${row.index}`}
          placeholder="Select a Configuration"
        />
      ),
    },
  ];

  async function handleOnSubmit(data: z.infer<typeof BillingSchema>) {
    console.log("Saving FX Rate Data:", data);
    // console.log("Fx rate data before update: ", fxRates);

    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Configure Billing Account Servers</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="grid gap-4"
          >
            {!hasSelectedAcc && (
              <div className="grid grid-cols-3 gap-4" id="deal_checkbox">
                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox
                      id="childAccount"
                      checked={isChildAcc}
                      onCheckedChange={handleChildAccountChange}
                    />
                    <label
                      htmlFor="childAccount"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Is Child Account ?
                    </label>
                  </div>
                </div>
              </div>
            )}

            {isChildAcc && (
              <div className="grid gap-1.5" id="copyFxRateId">
                <FormComboboxInput
                  items={parentAccountSet}
                  formControl={form.control}
                  name={"parentAccount"}
                  placeholder={"Select a Parent Account"}
                  label="Parent Account"
                />
              </div>
            )}

            {isChildAcc && (
              <div className="grid gap-1.5">
                <FormInput
                  formControl={form.control}
                  name={"accountName"}
                  label="Account Name *"
                  placeholder="Enter Account Name"
                />
              </div>
            )}
            {!isChildAcc && (
              <div className="grid gap-1.5" id="copyFxRateId">
                <FormComboboxInput
                  items={accountAc}
                  formControl={form.control}
                  name={"accountName"}
                  placeholder={"Select an Account"}
                  label="Account Name *"
                />
              </div>
            )}
            <DataTable columns={columns} data={server} />

            {/* Submit Button */}
            <DialogFooter className="flex justify-end mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BillingModal;
