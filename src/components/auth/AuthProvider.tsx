"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, fetchUser, fetchBusinesses, isHydrated } = useAuthStore()

  useEffect(() => {
    if (isHydrated && user?.token) {
      console.log("[v0] AuthProvider: Fetching user data on mount")
      fetchUser().catch((err) => console.error("[v0] Failed to fetch user:", err))
      fetchBusinesses().catch((err) => console.error("[v0] Failed to fetch businesses:", err))
    }
  }, [isHydrated, user?.token, fetchUser, fetchBusinesses])

  return <>{children}</>
}
