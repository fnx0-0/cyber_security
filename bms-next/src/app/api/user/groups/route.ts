import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const groupNames = await request.json()

        const softwareId = await getCurrentSoftwareId();
        const userDetailsMap = await getUserDashboardPlatformUtilData({ softwareId, isRoleNameWiseUserDetailsMap: true, groupNames });
        return NextResponse.json(userDetailsMap)
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
