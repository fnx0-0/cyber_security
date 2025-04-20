"use client"

import React, { createContext, useContext, useState } from "react"

interface AlarmsContextType {
  createAlert: boolean
  setCreateAlert: React.Dispatch<React.SetStateAction<boolean>>
  createQuery: boolean
  setCreateQuery: React.Dispatch<React.SetStateAction<boolean>>
  createCondition: boolean
  setCreateCondition: React.Dispatch<React.SetStateAction<boolean>>
}

const AlarmContext = createContext<AlarmsContextType | undefined>(undefined)

export const useAlarms = () => {
  const context = useContext(AlarmContext)
  if (!context) throw new Error("useHvac must be used within HvacProvider")
  return context
}

export const AlarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [createAlert, setCreateAlert] = useState(false)
  const [createQuery, setCreateQuery] = useState(false)
  const [createCondition, setCreateCondition] = useState(false)

  return (
    <AlarmContext.Provider
      value={{
        createAlert, 
        setCreateAlert,
        createQuery, 
        setCreateQuery,
        createCondition, 
        setCreateCondition
      }}
    >
      {children}
    </AlarmContext.Provider>
  )
}
