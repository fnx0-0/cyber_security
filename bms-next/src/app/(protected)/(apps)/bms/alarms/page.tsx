"use client"

import { Bell } from "lucide-react"
import { Button } from "@/shadcn/ui/button"
import AciveAlarms from "./components/active-alarm"
import { CreateNotificationModal } from "./components/modal-form/createNotificatonModal"
import { CreateExpressionModal } from "./components/modal-form/createExpressionModal"
import { useAlarms } from "./context/alarmsContext"

export default function AlarmsPage() {
  const { createAlert, setCreateAlert, createQuery, setCreateQuery } = useAlarms()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alarms & Events</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          <span>Test Alarm</span>
        </Button>
      </div>
      <AciveAlarms />
      <CreateNotificationModal open={createAlert} onClose={() => setCreateAlert(false)} />
      <CreateExpressionModal open={createQuery} onClose={() => setCreateQuery(false)} />
    </div>
  )
}