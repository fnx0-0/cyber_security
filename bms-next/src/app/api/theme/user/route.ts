import { getBaseSoftwareId } from "@/ikon/utils/actions/software"
import { UserThemeProps } from "@/ikon/utils/actions/theme/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const baseSoftwareId = await getBaseSoftwareId();
        const apearenceInstance = await getMyInstancesV2<UserThemeProps>({
            processName: "Appearance",
            softwareId: baseSoftwareId,
            projections: ["Data.mode", "Data.font", "Data.radius"]
        });
        console.log("User Theme")
        return NextResponse.json(apearenceInstance?.[0]?.data)
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
