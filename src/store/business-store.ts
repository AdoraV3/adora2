"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface Business {
  _id: string
  userId: string
  name: string
  agentName: string
  description: string
  logo: string
  country: string
  customerBase: string
  createdAt: string
  updatedAt: string
  phone?: string
  voiceId: string
  vapiPhoneNumber?: string
  vapiPhoneNumberId?: string
  vapiAssistantId?: string
  isProfileCompleted?: boolean
}

interface BusinessStore {
  businesses: Business[]
  business: Business | null
  loading: boolean
  error: string | null
  createBusiness: (data: Partial<Business>) => Promise<void>
  fetchBusiness: () => Promise<void>
  fetchBusinesses: () => Promise<void>
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>
  deleteBusiness: (id: string) => Promise<void>
  assignPhoneNumberToBusiness: (
    businessId: string,
    payload: {
      phoneNumber: string
      voiceId: string
      agentName: string
      categoryId: string
    },
  ) => Promise<void>
  clearError: () => void
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "ngrok-skip-browser-warning": "69420",
})

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  businesses: [],
  business: null,
  loading: false,
  error: null,

  createBusiness: async (businessData: Partial<Business>) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/business`, {
        method: "POST",
        headers: getHeaders(user.token),
        body: JSON.stringify(businessData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create business")
      }

      set({
        business: data.business,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create business",
        loading: false,
      })
      throw error
    }
  },

  fetchBusiness: async () => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      console.log("[v0] Fetching business with token:", user.token.substring(0, 20) + "...")

      const response = await fetch(`${BASE_URL}/api/business`, {
        method: "GET",
        headers: getHeaders(user.token),
      })

      const text = await response.text()
      console.log("[v0] Raw response text:", text.substring(0, 500))

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error("[v0] JSON parse failed. Response status:", response.status)
        throw new Error(
          `Backend returned invalid JSON. Status: ${response.status}. First 200 chars: ${text.substring(0, 200)}`,
        )
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch business")
      }

      set({
        business: data.business,
        businesses: [data.business],
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch business"
      console.error("[v0] Fetch business error:", errorMessage)
      set({
        error: errorMessage,
        loading: false,
      })
      throw error
    }
  },

  fetchBusinesses: async () => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/business`, {
        method: "GET",
        headers: getHeaders(user.token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch businesses")
      }

      set({
        businesses: data.businesses || [],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch businesses",
        loading: false,
      })
      throw error
    }
  },

  updateBusiness: async (id: string, businessData: Partial<Business>) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/business/${id}`, {
        method: "PUT",
        headers: getHeaders(user.token),
        body: JSON.stringify(businessData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update business")
      }

      set((state) => ({
        businesses: state.businesses.map((b) => (b._id === id ? data.business : b)),
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update business",
        loading: false,
      })
      throw error
    }
  },

  deleteBusiness: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/business/${id}`, {
        method: "DELETE",
        headers: getHeaders(user.token),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete business")
      }

      set((state) => ({
        businesses: state.businesses.filter((b) => b._id !== id),
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete business",
        loading: false,
      })
      throw error
    }
  },

  assignPhoneNumberToBusiness: async (
    businessId: string,
    payload: {
      phoneNumber: string
      voiceId: string
      agentName: string
      categoryId: string
    },
  ) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/business/${businessId}/assign-phone-number`, {
        method: "POST",
        headers: getHeaders(user.token),
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign phone number")
      }

      set({
        business: data.business,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to assign phone number",
        loading: false,
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
