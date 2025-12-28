"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface AccountInfoState {
  loading: boolean
  error: string | null
  updateProfileInfo: (formData: FormData) => Promise<void>
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "69420",
  }
}

export const useAccountInfoStore = create<AccountInfoState>((set) => ({
  loading: false,
  error: null,

  updateProfileInfo: async (formData: FormData) => {
    set({ loading: true, error: null })
    try {
      const authState = useAuthStore.getState()
      const token = authState.user?.token

      if (!token) {
        throw new Error("Not authenticated. Please log in again.")
      }

      console.log("[v0] Updating profile with FormData, token exists:", !!token)

      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: getHeaders(token),
        body: formData,
      })

      const data = await response.json()
      console.log("[v0] Profile update response:", data)

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      set({ loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      console.error("[v0] Profile update error:", errorMessage)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },
}))
