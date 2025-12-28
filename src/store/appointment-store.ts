"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface IAppointment {
  _id: string
  businessId: string
  callerName: string
  callerEmail: string
  date: Date | string
  time: string
  timezone: string
  status: "pending" | "confirmed" | "cancelled"
  scenarioId?: number
  webhookUrl?: string
  createdAt: string
  updatedAt: string
}

interface CreateAppointmentPayload {
  businessId: string
  callerName: string
  callerEmail: string
  date: string
  time: string
  timezone: string
  scenarioId?: number
  webhookUrl?: string
}

interface UpdateAppointmentPayload {
  callerName?: string
  callerEmail?: string
  date?: string
  time?: string
  timezone?: string
  status?: "pending" | "confirmed" | "cancelled"
  scenarioId?: number
  webhookUrl?: string
}

interface AppointmentFilters {
  status?: "pending" | "confirmed" | "cancelled"
  startDate?: string
  endDate?: string
}

interface AppointmentStore {
  appointments: IAppointment[]
  currentAppointment: IAppointment | null
  loading: boolean
  error: string | null
  
  // CRUD Operations
  createAppointment: (payload: CreateAppointmentPayload) => Promise<void>
  fetchAppointmentsByBusiness: (businessId: string, filters?: AppointmentFilters) => Promise<void>
  fetchAppointmentById: (appointmentId: string) => Promise<void>
  updateAppointment: (appointmentId: string, payload: UpdateAppointmentPayload) => Promise<void>
  deleteAppointment: (appointmentId: string) => Promise<void>
  
  // Utility
  clearError: () => void
  clearCurrentAppointment: () => void
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,

  createAppointment: async (payload: CreateAppointmentPayload) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        throw new Error("Not authenticated")
      }

      console.log("[v0] Creating appointment:", payload)

      const response = await fetch(`${BASE_URL}/api/appointments`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment")
      }

      console.log("[v0] Appointment created successfully:", data.appointment)

      set((state) => ({
        appointments: [...state.appointments, data.appointment],
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create appointment"
      console.error("[v0] Create appointment error:", errorMessage)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  fetchAppointmentsByBusiness: async (businessId: string, filters?: AppointmentFilters) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters?.status) queryParams.append("status", filters.status)
      if (filters?.startDate) queryParams.append("startDate", filters.startDate)
      if (filters?.endDate) queryParams.append("endDate", filters.endDate)

      const queryString = queryParams.toString()
      const url = `${BASE_URL}/api/appointments/business/${businessId}${queryString ? `?${queryString}` : ""}`

      console.log("[v0] Fetching appointments for businessId:", businessId, "with filters:", filters)

      const response = await fetch(url, {
        headers: getHeaders(token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch appointments")
      }

      console.log("[v0] Fetched appointments:", data.appointments?.length || 0, "appointments")

      set({
        appointments: data.appointments || [],
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch appointments"
      console.error("[v0] Fetch appointments error:", errorMessage)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  fetchAppointmentById: async (appointmentId: string) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        throw new Error("Not authenticated")
      }

      console.log("[v0] Fetching appointment by ID:", appointmentId)

      const response = await fetch(`${BASE_URL}/api/appointments/${appointmentId}`, {
        headers: getHeaders(token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch appointment")
      }

      console.log("[v0] Fetched appointment:", data.appointment)

      set({
        currentAppointment: data.appointment,
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch appointment"
      console.error("[v0] Fetch appointment error:", errorMessage)
      set({ error: errorMessage, loading: false, currentAppointment: null })
      throw error
    }
  },

  updateAppointment: async (appointmentId: string, payload: UpdateAppointmentPayload) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        throw new Error("Not authenticated")
      }

      console.log("[v0] Updating appointment:", appointmentId, payload)

      const response = await fetch(`${BASE_URL}/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update appointment")
      }

      console.log("[v0] Appointment updated successfully:", data.appointment)

      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt._id === appointmentId ? data.appointment : apt
        ),
        currentAppointment: state.currentAppointment?._id === appointmentId 
          ? data.appointment 
          : state.currentAppointment,
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update appointment"
      console.error("[v0] Update appointment error:", errorMessage)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  deleteAppointment: async (appointmentId: string) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        throw new Error("Not authenticated")
      }

      console.log("[v0] Deleting appointment:", appointmentId)

      const response = await fetch(`${BASE_URL}/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: getHeaders(token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete appointment")
      }

      console.log("[v0] Appointment deleted successfully")

      set((state) => ({
        appointments: state.appointments.filter((apt) => apt._id !== appointmentId),
        currentAppointment: state.currentAppointment?._id === appointmentId 
          ? null 
          : state.currentAppointment,
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete appointment"
      console.error("[v0] Delete appointment error:", errorMessage)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },

  clearCurrentAppointment: () => {
    set({ currentAppointment: null })
  },
}))
