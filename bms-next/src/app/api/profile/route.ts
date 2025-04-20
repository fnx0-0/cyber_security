import { getLoggedInUserProfile, getLoggedInUserProfileDetails } from "@/ikon/utils/api/loginService";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const data1 = await getLoggedInUserProfile();
        const data2 = await getLoggedInUserProfileDetails();
        return NextResponse.json({ ...data1, ...data2 })
    } catch (error) {
        console.error(error);
        return NextResponse.error()
    }
}
