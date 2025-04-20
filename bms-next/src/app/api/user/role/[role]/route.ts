import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ role: string }> }
) {
    try {
        const role = (await params).role;
        const softwareId = await getCurrentSoftwareId();
        const userDetailsMap = await getUserDashboardPlatformUtilData({ softwareId, isRoleNameWiseUserDetailsMap: true, roleNames: [role] });
        return NextResponse.json(userDetailsMap && Object.values(userDetailsMap)?.[0])
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
