"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

interface Voice {
  _id: string
  voiceId: string
  name: string
  gender: "male" | "female"
  language: string
  provider: string
  createdAt: string
  updatedAt: string
}

interface PhoneNumber {
  id: string
  number: string
  name?: string
  country?: string
  available: boolean
}

interface VoiceStore {
  voices: Voice[]
  availablePhoneNumbers: PhoneNumber[]
  loading: boolean
  error: string | null
  fetchVoicesByGender: (gender: "male" | "female") => Promise<void>
  fetchAvailablePhoneNumbers: () => Promise<void>
  clearError: () => void
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  voices: [],
  availablePhoneNumbers: [],
  loading: false,
  error: null,

  fetchVoicesByGender: async (gender: "male" | "female") => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/voice/available?gender=${gender}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch voices")
      }

      set({
        voices: data.voices || [],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch voices",
        loading: false,
      })
      throw error
    }
  },

  fetchAvailablePhoneNumbers: async () => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/vapi/phone-numbers/available`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch phone numbers")
      }

      set({
        availablePhoneNumbers: data.availableNumbers || [],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch phone numbers",
        loading: false,
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
