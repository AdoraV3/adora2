"use client"

import { RecentCallLogs } from "@/features/call-logs/RecentCallLogs"
import SearchBar from "@/features/call-logs/SearchBar"
import Tabs from "@/features/call-logs/Tabs"
import CallLogsTableSkeleton from "@/components/dashboard/call-logs-table-skeleton"
import { useAuthStore } from "@/store/auth-store"
import { useEffect, useState } from "react"

export default function CallLogsPage() {
  const { business, businesses } = useAuthStore()
  const businessId = business?._id || businesses?.[0]?._id || ""
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const businessIdAvailable = !!businessId

  if (isLoading || !businessIdAvailable) {
    return <CallLogsTableSkeleton />
  }

  return (
    <div className="m-6 text-xs">
      <div className="w-full max-w-4xl flex flex-col gap-4">
        <Tabs />
        <SearchBar placeholder="Search by date or agents..." />
      </div>
      <div>
        <RecentCallLogs businessId={businessId} />
      </div>
    </div>
  )
}
