"use client"

import { Button } from "@/shadcn/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import { Tooltip } from "@/ikon/components/tooltip";
import { useAlarms } from "../../../context/alarmsContext"

interface AlarmNotification {
    data: any
}
export default function ExpressionDataTable() {

    const [alarmNotificationData, setAlarmNotificationData] = useState<AlarmNotification[]>([])
    const { setCreateQuery } = useAlarms()
    const extraParams: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "View Details",
                    onClick: (row) => {
                        console.log(row)
                    }
                },
                {
                    label: "View Details",
                    onClick: (row) => {
                        console.log(row)
                    }
                },
                {
                    label: "View Details",
                    onClick: (row) => {
                        console.log(row)
                    }
                }
            ]
        },
        extraTools: [
            <Tooltip tooltipContent="Add Qury" key="add-query">
                <Button variant="outline" className="p-2 gap-1"
                    onClick={() => {
                        setCreateQuery(true);
                    }}>
                    <Plus />
                </Button>
            </Tooltip>
        ],
        grouping: true,
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25, 50, 100],
    };
    const columnSchema: DTColumnsProps<any>[] = [
        {
            accessorKey: "expressionName",
            header: "Expression Name",
            cell: ({ row }) => (
                <span>{row.original.data.expressionName}</span>
            ),
        },
        {
            accessorKey: "condition",
            header: 'Condition',
            cell: ({ row }) => (
                <span>{row.original.data.notification_name}</span>
            ),
        },
        {
            accessorKey: "asset",
            header: 'Asset',
            cell: ({ row }) => (
                <span>{row.original?.data?.state}</span>
            ),
        },
        {
            accessorKey: "service",
            header: 'Service',
            cell: ({ row }) => (
                <span>{row.original.data.description}</span>
            ),
        },
        {
            accessorKey: "subService",
            header: 'Sub Service',
            cell: ({ row }) => (
                <span>{format(new Date(row.original.data.lastEvaluatedOn), "yyyy-MM-dd HH:mm:ss")}</span>
            ),
        },
    ];
    useEffect(() => {
        const fetchAlarmsNotifications = async () => {
            // const notificationData = await getAlertNotificationData();
            // console.log("Alarm Notification Data:", notificationData);
            // setAlarmNotificationData(notificationData);
        }
        fetchAlarmsNotifications();
    }, []);
    return (
        <>
            <DataTable data={alarmNotificationData} columns={columnSchema} extraParams={extraParams} />
        </>
    )
}