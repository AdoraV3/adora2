/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { LoadingOverlay } from "@/components/LoadingOverlay"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, business, loading, fetchUser, isHydrated, profileCompleted } = useAuthStore()
  const { fetchBusinessSubscription, fetchSubscriptionStatus } = useSubscriptionStore()
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const fetchUserCalledRef = useRef(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (!isHydrated) {
        return
      }

      // Not logged in - redirect to login
      if (!user) {
        router.push("/login")
        setIsLoading(false)
        setAuthChecked(true)
        return
      }

      try {
        // Allow profile page to always load
        if (pathname === "/dashboard/profile") {
          setIsLoading(false)
          setAuthChecked(true)
          return
        }

        if (!loading && !fetchUserCalledRef.current) {
          fetchUserCalledRef.current = true
          await fetchUser()
        }

        const isProfileComplete = profileCompleted ?? business?.isProfileCompleted ?? false

        if (!isProfileComplete) {
          router.push("/dashboard/profile")
          return
        }

        if (business?._id && !loading) {
          try {
            await fetchBusinessSubscription(business._id)
            await fetchSubscriptionStatus(business._id)
          } catch (error) {
            console.error("[v0] Error loading subscription data:", error)
            // Don't block navigation if subscription fetch fails
          }
        }

        // If profile complete and on other dashboard pages, allow access
        setIsLoading(false)
        setAuthChecked(true)
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [isHydrated, user, pathname, router, business?._id, loading, fetchBusinessSubscription, fetchSubscriptionStatus])

  if (isLoading) {
    return <LoadingOverlay isVisible={isLoading} message="Loading..." />
  }

  return <>{children}</>
}
