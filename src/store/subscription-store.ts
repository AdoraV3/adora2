/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

interface SubscriptionPlan {
  _id: string
  plan: string
  amount: number
  period: "monthly" | "yearly"
  provider: "stripe" | "paystack"
  description: string
  features: string[]
  currency?: string
  priceId?: string
  paymentLink?: string
  callLimit?: number
  createdAt: string
  updatedAt: string
}

interface SubscriptionStatus {
  subscription: {
    plan: string
    amount: number
    period: "monthly" | "yearly"
    provider: "stripe" | "paystack"
  } | null
  isFreeTrial: boolean
  subscriptionStartDate?: string
  subscriptionEndDate?: string
  freeTrialEndDate?: string
}

interface SubscriptionStore {
  plans: SubscriptionPlan[]
  currentSubscription: SubscriptionStatus | null
  subscriptionStatus: any | null
  loading: boolean
  loadingPlanId: string | null
  error: string | null
  fetchSubscriptionPlans: () => Promise<void>
  fetchBusinessSubscription: (businessId: string) => Promise<void>
  fetchSubscriptionStatus: (businessId: string) => Promise<void>
  createCheckoutSession: (
    businessId: string,
    subscriptionId: string,
    email?: string,
  ) => Promise<{ url: string; authorizationUrl: string; sessionId: string; reference: string; provider: string }>
  cancelSubscription: (businessId: string) => Promise<void>
  clearError: () => void
  refreshSubscriptionStatus: (businessId: string) => Promise<void>
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "ngrok-skip-browser-warning": "true",
  "User-Agent": "Mozilla/5.0",
})

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  plans: [],
  currentSubscription: null,
  subscriptionStatus: null,
  loading: false,
  loadingPlanId: null,
  error: null,

  fetchSubscriptionPlans: async () => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      console.log("[v0] Fetching subscription plans...")
      const response = await fetch(`${BASE_URL}/api/subscription/plans`, {
        method: "GET",
        headers: getHeaders(user.token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscription plans")
      }

      console.log(
        "[v0] Plans fetched successfully:",
        data.plans.map((p: SubscriptionPlan) => ({
          id: p._id,
          plan: p.plan,
          amount: p.amount,
          currency: p.currency,
          period: p.period,
        })),
      )

      set({
        plans: data.plans || [],
        loading: false,
      })
    } catch (error) {
      console.log("[v0] Error fetching subscription plans:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch subscription plans",
        loading: false,
      })
      throw error
    }
  },

  fetchBusinessSubscription: async (businessId: string) => {
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/subscription/business/${businessId}`, {
        method: "GET",
        headers: getHeaders(user.token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscription status")
      }

      set({
        currentSubscription: data,
        loading: false,
      })
      console.log("[v0] Subscription data updated for business:", businessId, data)
    } catch (error) {
      console.error("[v0] Error fetching business subscription:", error)
      set({
        error: error instanceof Error ? error.message : "Failed to fetch subscription status",
        loading: false,
      })
    }
  },

  fetchSubscriptionStatus: async (businessId: string) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/subscription/status/${businessId}`, {
        method: "GET",
        headers: getHeaders(user.token),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscription status")
      }

      set({
        subscriptionStatus: data,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch subscription status",
        loading: false,
      })
    }
  },

  createCheckoutSession: async (businessId: string, subscriptionId: string, email?: string) => {
    console.log("[v0] CHECKOUT START - Plan ID:", subscriptionId, "Business ID:", businessId)

    const store = get()
    const selectedPlan = store.plans.find((p) => p._id === subscriptionId)
    console.log("[v0] CHECKOUT - Selected plan details:", {
      id: selectedPlan?._id,
      plan: selectedPlan?.plan,
      amount: selectedPlan?.amount,
      currency: selectedPlan?.currency,
      period: selectedPlan?.period,
    })

    set({ loadingPlanId: subscriptionId, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const userEmail = email || user?.email

      const { profile } = useAuthStore.getState()
      const paymentProvider = profile?.country?.toLowerCase() === "nigeria" ? "paystack" : "stripe"

      console.log("[v0] CHECKOUT - Sending request with:", {
        businessId,
        subscriptionId,
        paymentProvider,
        email: userEmail,
      })

      const response = await fetch(`${BASE_URL}/api/subscription/checkout`, {
        method: "POST",
        headers: getHeaders(user.token),
        body: JSON.stringify({
          businessId,
          subscriptionId,
          email: userEmail,
          paymentProvider,
        }),
      })

      console.log("[v0] CHECKOUT - Response status:", response.status)
      const data = await response.json()
      console.log("[v0] CHECKOUT - Response data:", data)

      if (!response.ok) {
        console.error("[v0] CHECKOUT FAILED - Error message:", data.message)
        throw new Error(data.message || "Failed to create checkout session")
      }

      console.log("[v0] CHECKOUT SUCCESS - Provider:", data.provider)

      if (data.provider === "paystack") {
        console.log("[v0] Redirecting to Paystack payment")
        window.location.href = data.authorizationUrl
      } else if (data.provider === "stripe" && data.url) {
        console.log("[v0] Redirecting to Stripe:", data.url)
        window.location.href = data.url
      }

      set({ loadingPlanId: null })

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session"
      console.error("[v0] CHECKOUT ERROR - Full error:", error)
      console.error("[v0] CHECKOUT ERROR - Message:", errorMessage)
      set({
        error: errorMessage,
        loadingPlanId: null,
      })
      throw error
    }
  },

  cancelSubscription: async (businessId: string) => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`${BASE_URL}/api/subscription/cancel`, {
        method: "POST",
        headers: getHeaders(user.token),
        body: JSON.stringify({ businessId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel subscription")
      }

      set({
        currentSubscription: null,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to cancel subscription",
        loading: false,
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },

  refreshSubscriptionStatus: async (businessId: string) => {
    try {
      console.log("[v0] Refreshing subscription status for business:", businessId)
      const store = get()
      await store.fetchBusinessSubscription(businessId)
      await store.fetchSubscriptionStatus(businessId)
      console.log("[v0] Subscription status refreshed")
    } catch (error) {
      console.error("[v0] Error refreshing subscription status:", error)
    }
  },
}))
