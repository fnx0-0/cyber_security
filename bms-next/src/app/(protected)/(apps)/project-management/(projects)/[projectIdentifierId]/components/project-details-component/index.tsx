import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

export default async function ProjectDetailsComponent({ projectIdentifier }: { projectIdentifier: string }): Promise<ReactNode> {
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const projectData = await getMyInstancesV2<any>({
        processName: "Project",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
    });

    const projectIdWiseProductData  = projectData[0]?.data;

    return (
        <Card className="h-1/2 flex flex-col">
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 4,
                    title: projectIdWiseProductData?.projectName || "n/a",
                    href: `/projects/${projectIdentifier}`,
                }}
            />
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Project Details</CardTitle>

                 {/* <DropdownMenuWithEditDeal dealIdentifier={dealIdentifier} />  */}
            </CardHeader>
            <CardContent className="grid gap-2 p-0 overflow-hidden">
                <div className="flex flex-col flex-grow overflow-auto">
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Project Manager :{" "}
                        {projectIdWiseProductData.projectManager ? userIdWiseUserDetailsMap[projectIdWiseProductData.projectManager].userName : "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Product Type : {projectIdWiseProductData?.productType || "n/a"}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Product Description :{" "}
                        {projectIdWiseProductData?.productDescription || "n/a"}
                    </span>
                     <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Updated on : {projectIdWiseProductData?.updatedOn || "n/a"}
                    </span> 
                </div>
            </CardContent>
        </Card>
    )
}