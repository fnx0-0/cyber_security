import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const softwareId = await getCurrentSoftwareId();
        const userDetailsMap = await getUserDashboardPlatformUtilData({ softwareId });
        return NextResponse.json(userDetailsMap)
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
