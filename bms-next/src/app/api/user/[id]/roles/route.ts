import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const softwareId = await getCurrentSoftwareId();
        const userDetailsMap = await getUserDashboardPlatformUtilData({ softwareId, isUserRoles: true, userId: id });
        return NextResponse.json(userDetailsMap.roles)
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
