"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { AlertOctagon, AlertTriangle, Bell, Check, CircleHelp, Clock, Filter, Info, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { alarmData } from "../data/alarmData" // Adjust the import path as necessary
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getAlertNotificationData } from '../action'
import { Input } from "@/shadcn/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import { format } from "date-fns";
import { Tooltip } from "@/ikon/components/tooltip";
import { useAlarms } from "../context/alarmsContext"

interface AlarmNotification {
  data: any
}

const getTemplateForLastEvaluatedOn = function (lastEvaluatedOn: any) {
  if (lastEvaluatedOn) {
    return format(new Date(lastEvaluatedOn), "dd-MMM-yyyy HH:mm:ss");
  }
  else {
    return "N/A";
  }
}
export default function AciveAlarms() {

  const [alarmNotificationData, setAlarmNotificationData] = useState<AlarmNotification[]>([])
  const { setCreateAlert } = useAlarms()
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
      <Tooltip tooltipContent="Add Notification">
        <Button variant="outline" className="p-2 gap-1"
          onClick={() => {
            setCreateAlert(true);
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
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${row.original.data.state === "critical"
            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
            : row.original.data.state === "warning"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
              : "bg-green-100 text-blue-600 dark:bg-green-900 dark:text-green-200"
            }`}
        >
          {row.original.data.state === "critical" || row.original.data.state === "warning" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            // <AlertTriangle className="h-4 w-4" />
            <Info className="h-4 w-4" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "notification_name",
      header: 'Notification Name',
      cell: ({ row }) => (
        <span>{row.original.data.notification_name}</span>
      ),
    },
    {
      accessorKey: "status",
      header: 'Notification Status',
      cell: ({ row }) => (
        // <span>{row.original?.data?.state}</span>
        <span>Active</span>
      ),
    },
    // {
    //   accessorKey: "status",
    //   header: 'Status',
    //   cell: ({ row }) => (
    //     <span>Acitve</span>
    //   ),
    // },
    {
      accessorKey: "description",
      header: 'Description',
      cell: ({ row }) => (
        <span>{row.original.data.description}</span>
      ),
    },
    {
      accessorKey: "last_evaluated_on",
      header: 'Last Evaluated On',
      cell: ({ row }) => (
        <span>{format(new Date(row.original.data.lastEvaluatedOn), "yyyy-MM-dd HH:mm:ss")}</span>
      ),
    },
    {
      accessorKey: "last_state_change_on",
      header: 'Last State Change On',
      cell: ({ row }) => {
        const cellData = row.original.data.lastStateChangeTime;
        const data = cellData && cellData.length > 0 ? cellData[cellData.length - 1].transitionTime : null;
        return <span>{getTemplateForLastEvaluatedOn(data)}</span>;
      },
    },
  ];
useEffect(() => {
  const fetchAlarmsNotifications = async () => {
    const notificationData = await getAlertNotificationData();
    // console.log("Alarm Notification Data:", notificationData);
    setAlarmNotificationData(notificationData);
  }
  fetchAlarmsNotifications();
}, []);
return (
  <>
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Active Alarms</CardTitle>
        <CardDescription>
          View and manage current system alarms
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <TableComponent /> */}
        <DataTable data={alarmNotificationData} columns={columnSchema} extraParams={extraParams} />
      </CardContent>
    </Card>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Alarm Statistics</CardTitle>
          <CardDescription>
            Summary of current alarm status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Active Alarms</span>
              <span>{alarmNotificationData.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Critical Alarms</span>
              <span className="text-red-500">
                {alarmNotificationData.filter(a => a.data.state === "critical").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Warning Alarms</span>
              <span className="text-amber-500">
                {alarmNotificationData.filter(a => a.data.state === "warning").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Info Notifications</span>
              <span className="text-green-500">
                {alarmNotificationData.filter(a => a.data.state === "normal").length}
              </span>
            </div>
            {/* <div className="flex items-center justify-between">
                <span className="font-medium">Unacknowledged</span>
                <span>
                  {alarms.filter(a => !a.acknowledged).length}
                </span>
              </div> */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common alarm management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Check className="h-5 w-5" />
              <span>Acknowledge All</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Bell className="h-5 w-5" />
              <span>Silence Alarms</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <Filter className="h-5 w-5" />
              <span>Reset Filters</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-1">
              <AlertTriangle className="h-5 w-5" />
              <span>Run Diagnostics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
)
}

function TableComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [systemFilter, setSystemFilter] = useState("all")
  const [acknowledgedFilter, setAcknowledgedFilter] = useState("all")
  const [alarms, setAlarms] = useState(alarmData)

  // Filter alarms based on search and filters
  const filteredAlarms = alarms.filter(alarm => {
    // Search filter
    const matchesSearch = alarm.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.system.toLowerCase().includes(searchQuery.toLowerCase())

    // Severity filter
    const matchesSeverity = severityFilter === "all" || alarm.severity === severityFilter

    // System filter
    const matchesSystem = systemFilter === "all" || alarm.system === systemFilter

    // Acknowledged filter
    const matchesAcknowledged = acknowledgedFilter === "all" ||
      (acknowledgedFilter === "acknowledged" && alarm.acknowledged) ||
      (acknowledgedFilter === "unacknowledged" && !alarm.acknowledged)

    return matchesSearch && matchesSeverity && matchesSystem && matchesAcknowledged
  })

  // Get unique systems for filter dropdown
  const systems = [...new Set(alarms.map(alarm => alarm.system))]

  // Handle alarm acknowledgment
  const acknowledgeAlarm = (id: number) => {
    setAlarms(alarms.map(alarm =>
      alarm.id === id ? { ...alarm, acknowledged: true } : alarm
    ))
  }
  return (
    <div className="flex flex-col space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alarms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={systemFilter} onValueChange={setSystemFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="System" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              {systems.map(system => (
                <SelectItem key={system} value={system}>{system}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={acknowledgedFilter} onValueChange={setAcknowledgedFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alarms list */}
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
          <div className="col-span-1">Severity</div>
          <div className="col-span-4">Message</div>
          <div className="col-span-2">System</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-1">Action</div>
        </div>
        <div className="divide-y">
          {filteredAlarms.length > 0 ? (
            filteredAlarms.map((alarm) => (
              <div key={alarm.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                <div className="col-span-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${alarm.severity === "critical"
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                    : alarm.severity === "warning"
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                    }`}>
                    {alarm.severity === "critical" || alarm.severity === "warning" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="col-span-4 font-medium">{alarm.message}</div>
                <div className="col-span-2">{alarm.system}</div>
                <div className="col-span-2">{alarm.location}</div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {alarm.time} ({alarm.date})
                </div>
                <div className="col-span-1">
                  {alarm.acknowledged ? (
                    <div className="flex items-center text-green-900">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs">Ack</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlarm(alarm.id)}
                    >
                      Ack
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No alarms match your filters
            </div>
          )}
        </div>
      </div>
    </div>

  )
}