"use client";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { se } from "date-fns/locale";
// import form from "@/app/(protected)/examples/form/page";
import * as zod from "@hookform/resolvers/zod";
import { AddTicketFormSchema } from "./ticket-data-defination";
import { getProfileData, getTicket } from "@/ikon/utils/actions/auth";
import { startCustomerSupportTicketProcess } from "./start-ticket-instance/index";
import { usePathname } from "next/navigation";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTicketModalForm: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
}) => {
  const form = useForm({
    resolver: zod.zodResolver(AddTicketFormSchema),
    defaultValues: {
      subject: "",
      accountName: "",
      application: "",
      issueDate: "",
      type: "",
      priority: "",
      supportMessage: "",
      mobile: "",
    },
  });

  interface FormData {
    subject: string;
    accountName: string;
    application: string;
    ticketNo: number;
    issueDate: string;
    mobile: string;
    updatedCompanyName: string;
    priority: string;
    status: string;
    type: string;
    supportMessage: string;
    clientUploadedResources: string; //function
    timeZone: string;
    activityLogsData: string;
    serverName: string;
    requestedFrom: string;
    dateCreated: string;
    email: string;
    userName: string;
    creatorId: string;
    name: string;
  }

  interface OptionType {
    value: string;
    label: string;
  }
  const userNameRef = useRef("");
  const userIdRef = useRef("");
  const userLoginRef = useRef("");
  const userEmailRef = useRef("");

  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getProfileData();
      userNameRef.current = data.USER_NAME;
      userIdRef.current = data.USER_ID;
      userLoginRef.current = data.USER_LOGIN;
      userEmailRef.current = data.USER_EMAIL;
      console.log("hey bro -> data d" + data);
    };
    fetchProfileData();
  }, []);

  console.log("hey bro -> " + userIdRef.current);

  // const ticket = await getTicket();
  // const url =
  // `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
  // `&resourceId=${encodeURIComponent(data.resourceId)}` +
  // `&resourceName=${encodeURIComponent(data.resourceName)}` +
  // `&resourceType=${encodeURIComponent(data.resourceType)}`;

//window.open(encodeURI(url), "_blank");

  const handleSubmit = async (values: Record<string, any>) => {
    const newTicket = {
      ticketNo: new Date().getTime(),
      name: userNameRef.current,
      creatorId: userIdRef.current,
      userName: userLoginRef.current,
      txtEmail: "alisha.barik@keross.com",
      dateCreated: new Date(),
      requestedFrom: "ikoncloud-dev.keross.com",
      serverName: "Dev Server",
      subject: values.subject,
      accountId: values.accountId,
      accountName: "Keross",
      applicationId: values.applicationId,
      applicationName: "Customer Support",
      issueDate: values.issueDate,
      mobile: values.mobile,
      priority: values.priority,
      status: "New",
      type: values.type,
      supportMessage: values.supportMessage,
      updatedCompanyName: "",
      clientUploadedResources: "", //resource
      timeZone: "TMZ_" + new Date().toISOString(),
      activityLogsData: "",
    };

    try {
      await startCustomerSupportTicketProcess(newTicket);
      onClose();
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };

  const pathName = usePathname();
  const info = [
    { label: "Ticket No.", value: new Date().getTime() },
    { label: "Name", value: userNameRef.current },
    { label: "Requested From", value: pathName },
    { label: "User Name", value: userLoginRef.current },
    { label: "Server Name", value: "Admin" },
    { label: "Email Id", value: userEmailRef.current },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-3"
          >
            <div className="w-full">
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                {info.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <span className="font-medium">{item.label} :</span>
                    <span className="font-small">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the Subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Account Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="application"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Name*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Application name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        placeholder="Enter Issue Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter mobile number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bugs">Bugs</SelectItem>
                          <SelectItem value="Feature">Feature</SelectItem>
                          <SelectItem value="Incident">Incident</SelectItem>
                          <SelectItem value="Service Request">
                            Service Request
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="supportMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      id="supportMessage"
                      placeholder="Enter Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModalForm;
function moment(arg0: Date) {
  throw new Error("Function not implemented.");
}

