import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface PasswordState {
  loading: boolean
  error: string | null
  success: boolean
  changePassword: (oldPassword: string, password: string, confirmPassword: string) => Promise<void>
  resetSuccess: () => void
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

export const usePasswordStore = create<PasswordState>((set) => ({
  loading: false,
  error: null,
  success: false,

  changePassword: async (oldPassword: string, password: string, confirmPassword: string) => {
    set({ loading: true, error: null, success: false })

    try {
      const token = useAuthStore.getState().user?.token

      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`${BASE_URL}/api/password/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          password,
          confirmPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to change password")
      }

      set({ success: true, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password"
      set({ error: errorMessage, success: false })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  resetSuccess: () => {
    set({ success: false })
  },
}))
