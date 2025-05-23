"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import TabContainer from "@/components/ikon-components/tabs";
// import { TabArray } from "@/components/ikon-components/tabs/type";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import Select2 from "@/components/ikon-components/form-components/Select2WithLabel/SelectTwoFormField";
// import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { startProjectData } from "../invoke_create_project";
import { useRouter } from "next/navigation";
import { Assignment } from "../../../../components/type";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TabArray } from "@/ikon/components/tabs/type";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import Tabs from "@/ikon/components/tabs";
import { Button } from "@/shadcn/ui/button";
// import { getMyInstancesV2 } from "@/lib/api/processRuntimeService";
// import { Assignment } from "../../../../components/type";
// import { getProfileData } from "@/lib/actions/auth";
// import { MultiValue } from "react-select";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  projectId: string;
  projectName: string;
  assignmentId: string;
  projectDescription: string;
  assignmentDetails: {
    assignmentId: string;
    assignmentName: string;
    assignmentDescription: string;
    goalsArray: {
      goalId: string;
      goalName: string;
      goalDescription: string;
    }[];
    datasetArray: {
      tableName: string;
      datasetName: string;
    }[];
    createdOn: string;
    createdBy: string;
    status: string;
    pastStateList: string[];
    activityLogsData: {
      action: string;
      actionString: string;
      dateOfAction: string;
      userId: string;
      userName: string;
      assignedToId?: string; // Optional, as not all logs have it
    }[];
    assignedBy: string;
    assigneeName: string;
    assigneeId: string;
    assigneeTime: string;
    assignHistory: {
      assigneeId: string;
      assigneeName: string;
      assigneeTime: string;
      assignedBy: string;
    }[];
  };
}

interface UserDetails {
  userActive: boolean;
  userName: string;
}

interface AssignmentOptions {
  value: string;
  label: string;
}

interface OptionType {
  value: string;
  label: string;
  __isNew__?: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const [assignments, setAssignments] = useState<Assignment[] | undefined>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedAssignment, setSelectedAssignment] = useState<
    any | OptionType | null
  >(null);
  const projectNameRef = useRef(null);
  const projectDescriptionRef = useRef(null);

  console.log("selected assignment: ", selectedAssignment);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const fetchAssignmentsDetails = async () => {
    const userId: string = (await getProfileData()).USER_ID;

    const assignmentDetails = await getMyInstancesV2<Assignment>({
      processName: "Assignments",
      predefinedFilters: { taskName: "Assignment View Activity" },
      mongoWhereClause: `this.Data.assigneeId == "${userId}"`,
    });
    console.log(assignmentDetails);
    setAssignments(assignmentDetails.map((e: any) => e.data));
  };

  useEffect(() => {
    fetchAssignmentsDetails();
  }, []);

  const handleOnSubmit = async (data: any) => {
    console.log("-------------", data);

    // Generate projectIdentifier if not already provided
    if (!data.projectId) {
      data.projectId = generateUUID();
    }

    // Combine everything into the final formData structure
    const formData = {
      projectId: data.projectId,
      projectName: data.projectName,
      assignmentId: data.assignmentId,
      projectDescription: data.projectDescription,
      assignmentDetails: {},
    };

    console.log("Final form data:", formData);
    // await startProjectData(formData);

    // onClose();
    // startTransition(() => {
    //   router.refresh();
    // });
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  };

  const handleOnError = (errors: any) => {
    if (errors.organizationName) {
      alert(errors.organizationName.message);
    }
  };

  const assignmentOptions: AssignmentOptions[] =
    assignments?.map((item) => ({
      value: item.assignmentId,
      label: item.assignmentName,
    })) || [];

  const tabArray: TabArray[] = [
    {
      tabName: "Assignment Details",
      tabId: "tab-assignment",
      default: true,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="col-span-2">
            <Select
              label="Select Assignment"
              options={assignmentOptions}
              isMulti={false}
              placeholder="Select an option"
              allowCreate
              menuPlacement="bottom"
              validation={true}
              {...register("assignmentId")}
              onChange={(selectedOption) =>
                setSelectedAssignment(selectedOption)
              }
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Project Details",
      tabId: "tab-project",
      default: false,
      tabContent: (
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-1.5 col-span-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              type="text"
              id="projectName"
              placeholder="Enter project name"
              {...register("projectName")}
              ref={projectNameRef}
            />
          </div>
          <div className="grid gap-1.5 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Enter description"
              {...register("projectDescription")}
              ref={projectDescriptionRef}
            />
          </div>
        </div>
      ),
    },
    {
      tabName: "Dataset Details",
      tabId: "tab-dataset",
      default: false,
      tabContent: (
        <>
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto"></div>
        </>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="">
          <form>
            <Tabs
              tabArray={tabArray}
              tabListClass="py-6 px-3"
              tabListButtonClass="text-md"
              tabListInnerClass="justify-between items-center"
            />
          </form>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit(handleOnSubmit, handleOnError)}
            variant="default"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
