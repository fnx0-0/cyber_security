import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ group: string }> }
) {
    try {
        const group = (await params).group;
        const softwareId = await getCurrentSoftwareId();
        const userDetailsMap = await getUserDashboardPlatformUtilData({ softwareId, isGroupNameWiseUserDetailsMap: true, groupNames: [group] });
        return NextResponse.json(userDetailsMap && Object.values(userDetailsMap)?.[0])
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
