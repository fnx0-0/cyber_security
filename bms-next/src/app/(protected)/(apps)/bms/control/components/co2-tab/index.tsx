"use client"

import { Card, CardContent } from "@/shadcn/ui/card"
import CO2Chart from "../../../components/charts/co2-chart"
import Co2Control from "./co2-control"
import ZoneControl from "./zone-control"


export default function Co2Tab() {

    return (

        <div className="grid gap-4 md:grid-cols-2">
            <Co2Control />
            <ZoneControl />
            <Card className="md:col-span-2">
                <CO2Chart />
            </Card>
        </div>
    )
}