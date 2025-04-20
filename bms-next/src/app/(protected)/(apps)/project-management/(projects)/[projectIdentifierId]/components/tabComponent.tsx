'use client'

import { TabArray } from "@/ikon/components/tabs/type";
import TabContainer from "@/ikon/components/tabs";
import { useRouter } from "next/navigation";
import ProjectActivityLog from "./project-activity-log";

export default function TabComponentProjectDetails({
  children,
  projectIdentifier,
  dealIdentifier
}: {
  children?: React.ReactNode
  projectIdentifier: string;
  dealIdentifier?: string;
}) {

  const tabArray: TabArray[] = [
    {
      tabName: "Schedule",
      tabId: "schedule",
      default: true,
    },
    {
      tabName: "Resources",
      tabId: "resource",
      default: false,
    },
    {
      tabName: "Expenses",
      tabId: "expense",
      default: false,
    },
    {
      tabName: "Pricing",
      tabId: "pricing",
      default: false,
    }
  ];
  const router = useRouter();
  function onTabChange(tabId: string) {
    router.push(`./${tabId}`)
  }
  return (
    <>
      <TabContainer
        tabArray={tabArray}
        tabListClass=""
        tabListButtonClass="text-md"
        headerEndComponent={<ProjectActivityLog projectIdentifier={projectIdentifier} />}
        onTabChange={onTabChange}
        isSeperatePage={true}
      >
        {children}
      </TabContainer>
    </>
  );
}
