import { getBaseSoftwareId } from "@/ikon/utils/actions/software"
import { AccountThemeProps } from "@/ikon/utils/actions/theme/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const baseSoftwareId = await getBaseSoftwareId();
        const accountApearenceInstance = await getMyInstancesV2<AccountThemeProps>({
            processName: "Account Appearance",
            softwareId: baseSoftwareId,
            predefinedFilters: { taskName: "View" },
            projections: ["Data.light.primary", "Data.light.secondary", "Data.light.tertiary", "Data.dark.primary", "Data.dark.secondary", "Data.dark.tertiary"]
        });
        console.log("Account Theme")
        return NextResponse.json(accountApearenceInstance?.[0]?.data)
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
