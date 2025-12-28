/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface PaymentHistory {
  _id: string
  businessId: string
  userId: string
  subscriptionId: string
  amount: number
  currency: string
  paymentProvider: string
  status: "completed" | "pending" | "failed"
  planName: string
  billingPeriod: string
  transactionId: string
  paymentMethod: string
  description: string
  createdAt: string
  updatedAt: string
}

interface PaymentStats {
  totalPaid: number
  transactionCount: number
  lastPaymentDate: string
}

interface PaymentStore {
  payments: PaymentHistory[]
  stats: PaymentStats | null
  loading: boolean
  error: string | null
  fetchPayments: (businessId: string, page?: number, limit?: number) => Promise<void>
  fetchStats: () => Promise<void>
  fetchPaymentById: (id: string) => Promise<PaymentHistory | null>
  verifyPayment: (
    reference: string,
  ) => Promise<{ success: boolean; status: string; subscription?: any; message?: string }>
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

const getHeaders = (token?: string) => {
  const headers: any = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  stats: null,
  loading: false,
  error: null,

  fetchPayments: async (businessId: string, page = 1, limit = 10) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        set({ error: "Not authenticated" })
        return
      }

      console.log("[v0] Fetching payments for businessId:", businessId, { page, limit, token: token.substring(0, 20) })

      const response = await fetch(`${BASE_URL}/api/payment/history/${businessId}?page=${page}&limit=${limit}`, {
        headers: getHeaders(token),
      })

      console.log("[v0] Fetch response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Response error:", errorText)
        throw new Error(`Failed to fetch payments: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Payment history response:", data)
      set({ payments: data.data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
      console.error("[v0] Payment fetch error:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        set({ error: "Not authenticated" })
        return
      }

      const response = await fetch(`${BASE_URL}/api/payment/stats`, {
        headers: getHeaders(token),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      set({ stats: data })
    } catch (error) {
      set({ error: (error as Error).message })
      console.error("[v0] Stats fetch error:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchPaymentById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        set({ error: "Not authenticated" })
        return null
      }

      const response = await fetch(`${BASE_URL}/api/payment/${id}`, {
        headers: getHeaders(token),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch payment")
      }

      const data = await response.json()
      return data
    } catch (error) {
      set({ error: (error as Error).message })
      console.error("[v0] Payment fetch error:", error)
      return null
    } finally {
      set({ loading: false })
    }
  },

  verifyPayment: async (reference: string) => {
    try {
      const token = useAuthStore.getState().user?.token
      if (!token) {
        return { success: false, status: "error", message: "Not authenticated" }
      }

      const response = await fetch(`${BASE_URL}/api/subscription/verify/${reference}`, {
        method: "GET",
        headers: getHeaders(token),
      })

      const data = await response.json()
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed"
      console.error("[v0] Payment verification error:", error)
      return { success: false, status: "error", message }
    }
  },
}))
