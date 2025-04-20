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
export default function ConditionGeneratorDataTable() {

    const [alarmNotificationData, setAlarmNotificationData] = useState<AlarmNotification[]>([])
    const { setCreateCondition } = useAlarms()
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
                        setCreateCondition(true);
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
            accessorKey: "condition",
            header: "Condition",
            cell: ({ row }) => (
                <span>{row.original.data.expressionName}</span>
            ),
        },
        {
            accessorKey: "expression1",
            header: 'Expression 1',
            cell: ({ row }) => (
                <span>{row.original.data.notification_name}</span>
            ),
        },
        {
            accessorKey: "Operator",
            header: 'Operator',
            cell: ({ row }) => (
                <span>{row.original?.data?.state}</span>
            ),
        },
        {
            accessorKey: "expression2",
            header: 'Expression 2',
            cell: ({ row }) => (
                <span>{row.original.data.description}</span>
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