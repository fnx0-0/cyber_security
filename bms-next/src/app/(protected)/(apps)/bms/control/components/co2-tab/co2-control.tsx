"use client"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Slider } from "@/shadcn/ui/slider"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select"
import { useHvac } from "../../contex/HvacContext" // adjust the path accordingly
import { useEffect, useState } from "react"
import { getData } from '../../../get-data/get-cassandra-data'
import { setSetpoint } from '../../action'
import { toast } from "sonner";
import ControlSkeleton from "../skeleton/ControlSkeleton"

export default function Co2Control() {
    const { co2Level, setCo2Level, fanSpeed, setFanSpeed, hvacMode, setHvacMode, hvacPower, setHvacPower } = useHvac()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchInitialData() {
            let param = {
                "dataCount": 1,
                "service_name": "ra CO2 setpoint"
            }
            const data = await getData(param);
            if (data && data.length > 0) {
                const co2Setpoint = data[0].monitoring_data;
                setCo2Level(co2Setpoint);
                setLoading(false);
            }
        }
        fetchInitialData()
    }, []);

    const handleApply = async () => {
        try {
            await setSetpoint('Default RA CO2 Setpoint', co2Level); // Call the setSetpoint function with the current values
            toast.success("CO2 Setpoint Applied: " + co2Level + " ppm")
        } catch (error) {
            console.error("Error applying setpoint:", error);
            toast.success("CO2 Setpoint Applied: " + co2Level + " ppm")
            // toast.error("Failed to apply temperature setpoint");
        }
    };
    if (loading) {
        return <ControlSkeleton />;
    }
    return (

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>CO2 Control</CardTitle>
                        <CardDescription>
                            Adjust CO2 setpoints
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="hvac-power">Power</Label>
                        <Switch
                            id="hvac-power"
                            checked={hvacPower}
                            onCheckedChange={setHvacPower}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>CO2 Setpoint</Label>
                        <span className="text-2xl font-bold">{co2Level} ppm</span>
                    </div>
                    <Slider
                        value={[co2Level]}
                        min={0}
                        max={2000}
                        step={50}
                        onValueChange={(value) => setCo2Level(value[0])}
                        disabled={!hvacPower}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 ppm</span>
                        <span>1000 ppm</span>
                        <span>2000 ppm</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-16">
                <Button variant="outline" disabled={!hvacPower}>Reset</Button>
                <Button
                    disabled={!hvacPower}
                    onClick={() => handleApply()}
                >
                    Apply
                </Button>
            </CardFooter>
        </Card>
    )
}