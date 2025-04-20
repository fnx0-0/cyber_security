"use client"

import { Card, CardContent } from "@/shadcn/ui/card"
import TemperatureChart from "../../../components/charts/temperature-chart"
import PressureControl from "./pressure-control"
import ZoneControl from "./zone-control"
import PressureChart from "../../../components/charts/pressure-chart"
import { useState } from "react"

export default function PressureTab() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <PressureControl />
            <ZoneControl />

            <Card className="md:col-span-2">
                <PressureChart />
            </Card>
        </div>
    )
}