"use client"

import { Card } from "@/shadcn/ui/card"
import TemperatureChart from "../../../components/charts/temperature-chart"
import TempControl from "./temp-control"
import ZoneControl from "./zone-control"

export default function TemperatureTab() {

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <TempControl />
            <ZoneControl />
            <Card className="md:col-span-2">
                <TemperatureChart />
            </Card>
        </div>
    )
}