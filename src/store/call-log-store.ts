"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface CallLog {
  _id: string
  agentId: string
  businessId: string
  duration: number
  transcript: string
  recordingUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

interface CallLogStore {
  callLogs: CallLog[]
  loading: boolean
  error: string | null
  currentCallLog: CallLog | null
  createCallLog: (data: Partial<CallLog>) => Promise<void>
  fetchCallLogs: (businessId: string) => Promise<void>
  fetchVapiCallLogs: (businessId: string, limit?: number) => Promise<void>
  fetchCallLogById: (callLogId: string) => Promise<CallLog | null>
  clearError: () => void
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

export const useCallLogStore = create<CallLogStore>((set) => ({
  callLogs: [],
  loading: false,
  error: null,
  currentCallLog: null,

  createCallLog: async (callLogData: Partial<CallLog>) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/call-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(callLogData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create call log")
      }

      set((state) => ({
        callLogs: [...state.callLogs, data.callLog],
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create call log",
        loading: false,
      })
      throw error
    }
  },

  fetchCallLogs: async (businessId: string) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/call-logs/vapi/business/${businessId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch call logs")
      }

      set({
        callLogs: data.callLogs || [],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch call logs",
        loading: false,
      })
      throw error
    }
  },

  fetchVapiCallLogs: async (businessId: string, limit?: number) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const queryParams = limit ? `?limit=${limit}` : ""
      const response = await fetch(`${BASE_URL}/api/call-logs/vapi/business/${businessId}${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch VAPI call logs")
      }

      set({
        callLogs: data.callLogs || [],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch VAPI call logs",
        loading: false,
      })
      throw error
    }
  },

  fetchCallLogById: async (callLogId: string) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/call-logs/vapi/${callLogId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch call log")
      }

      // API returns data.call as the call log object
      const callLog = data.call
      set({
        currentCallLog: callLog,
        loading: false,
      })
      return callLog
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch call log"
      set({
        error: errorMessage,
        loading: false,
        currentCallLog: null,
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
