import React, { useEffect, useRef, useState } from 'react';
import { getData, getLiveData } from '../../../get-data/get-cassandra-data';
import AreaChart from '@/ikon/components/charts/area-chart';
import { Skeleton } from '@/shadcn/ui/skeleton';
import { useHvac } from "../../../control/contex/HvacContext"

const createParam = function (serviceName: string, startDate: any, endDate: any) {
    let param = {}
    var serviceIdList = [];
    if (serviceName == "RA  temperature setpoint") {
        // serviceIdList.push("RA Temp control( Valve Feedback)");
        serviceIdList.push("AHU-01 RA Temp");
        serviceIdList.push("RA  temperature setpoint")
    } else if (serviceName == "SA Pressure setpoint") {
        serviceIdList.push("SA Pressure setpoint");
        serviceIdList.push("SA pressure")
    } else if (serviceName == "ra CO2 setpoint") {
        serviceIdList.push("ra CO2 setpoint");
        serviceIdList.push("RA damper control")
        serviceIdList.push("RA CO2")
    }
    // Get current time for startDate
    startDate = new Date();

    // Set startDate as current time
    let startDateTimestamp = startDate.getTime();

    // Calculate endDate as 30 minutes before startDate
    let endDateTimestamp = new Date(startDate.getTime() - 30 * 60 * 1000).getTime(); // Subtract 30 minutes
    param = {
        "serviceNameList": serviceIdList,
        "startDate": endDateTimestamp,
        "endDate": startDateTimestamp,
    }
    return param;
}
export default function PressureChart() {
    const [data, setData] = useState<any[]>([]); // Stores all data
    const [liveData, setLiveData] = useState<any | null>(null); // Stores live data
    const { isChangesApplied } = useHvac()
    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            const param = createParam('SA Pressure setpoint', null, null);
            const fetchedData = await getData(param);
            fetchedData.sort(
                (a: any, b: any) => new Date(a.data_received_on.replace(' UTC', '')).getTime() - new Date(b.data_received_on.replace(' UTC', '')).getTime()
            );
            console.log("RA  temperature setpoin", fetchedData);
            setData(fetchedData);
            // setData([...fetchedData]);
        };

        fetchData();
    }, []);

    // Fetch live data
    useEffect(() => {
        const fetchLiveData = () => {
            function updateLiveData(event: any) {
                if (event?.data) {
                    debugger;
                    console.log("Live data received:", event.data);
                    setLiveData(event.data); // Update state with new live data
                }
            }
            getLiveData(updateLiveData);
        };

        fetchLiveData();

        // Cleanup: In case the live data fetching can be stopped
        return () => {
            // Add any cleanup code here if needed for live data subscription
        };
    }, []); // Empty dependency array to set up live data once when the component mounts

    // Merge live data with existing data
    useEffect(() => {
        // if (liveData.service_name === 'AHU-01 RA Temp' || liveData.service_name === 'RA Humid') {
        if (liveData && typeof liveData === 'object' && (liveData.service_name === 'AHU-01 RA Temp' || liveData.service_name === 'RA Humid')) {
            // Here, we add new live data to the existing data array
            setData(prevData => [...prevData, liveData]);
        }
    }, [liveData]);

    // Configuration Object
    const areaChartConfigurationObj: any = {
        version: 1,
        title: "SA Pressure setpoint",
        categoryKey: "data_received_on",
        showLegend: true,
        showCursor: true,
        showScrollx: false,
        showScrolly: false,
        zoomToIndex: true,
        zoomStartIndex: "0",
        zoomEndIndex: "100",
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
        seriesCreationArrayofObj: [
            {
                seriesType: 'line',
                seriesName: 'SA Pressure setpoint',
                stack: 'Total',
                emphasis: {
                    focus: 'series'
                },
                showSeriesTooltip: true,
            },
            {
                seriesType: 'line',
                seriesName: 'SA pressure',
                stack: 'Total',
                emphasis: {
                    focus: 'series'
                },
                showSeriesTooltip: true,
            }
        ],
        yAxisParams: [
            {
                type: 'value',
            },
        ],
    };
    return (
        <>
            {/* {data.length > 0 && <AreaChart chartData={data} chartConfiguration={areaChartConfigurationObj} />} */}
            {data.length > 0 ? (
                <AreaChart chartData={data} chartConfiguration={areaChartConfigurationObj} />
            ) : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <Skeleton className="w-full h-full rounded-md" />
                </div>
            )}
        </>
    );
}
