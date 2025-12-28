/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { RecentCallLogs } from "@/features/call-logs/RecentCallLogs"
import { useEffect, useState } from "react"
import { BannerSlider } from "@/components/dashboard/banner-slider"
import { BannerSkeleton } from "@/components/dashboard/banner-skeleton"
import { CallLogsSkeleton } from "@/components/dashboard/call-logs-skeleton"
import { useBusinessStore } from "@/store/business-store"

export default function HomePage() {
  const { business, fetchBusiness } = useBusinessStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        await fetchBusiness()
      } catch (error) {
        console.error("Failed to fetch business:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBusiness()
  }, [])

  const businessId = business?._id

  if (isLoading) {
    return (
      <div className="m-4">
        <BannerSkeleton />
        <CallLogsSkeleton />
      </div>
    )
  }

  if (!businessId) {
    return <div>Business not found</div>
  }

  return (
    <div className="m-4">
      <BannerSlider />
      <RecentCallLogs businessId={businessId} />
    </div>
  )
}
