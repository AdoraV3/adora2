/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  userId: string
  email: string
  name?: string
  token: string
}

interface Profile {
  _id: string
  userId: string
  name: string
  avatar?: string
  bio?: string
  phone?: string
  country?: string
  businessName?: string
  businessDescription?: string
  agentName?: string
  agentGender?: string
  createdAt: string
  updatedAt: string
  isProfileComplete?: boolean
}

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
  freeTrialEndDate?: string
  subscriptionEndDate?: string
  isFreeTrial?: boolean
  subscriptionStartDate?: string
  freeTrialStartDate?: string
  vapiEnabledUntil?: string
}

interface Agent {
  _id: string
  businessId: string
  name: string
  language: string
  voiceId: string
  phoneNumberId: string
  categoryId: string
  provider: string
  assistantId: string
  agentName?: string
  agentGender?: string
  vapiAssistantId?: string
  vapiPhoneNumber?: string
  systemPrompt?: string
  createdAt: string
  updatedAt: string
}

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

interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  business: Business | null
  businesses: Business[]
  agents: Agent[]
  callLogs: CallLog[]
  loading: boolean
  error: string | null
  isHydrated: boolean
  isFirstTimeUser: boolean
  voices: Voice[]
  availablePhoneNumbers: PhoneNumber[]
  notifications: Notification[]
  unreadCount: number
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  logout: () => void
  clearError: () => void
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  createBusiness: (data: Partial<Business>) => Promise<void>
  fetchBusiness: () => Promise<void>
  isProfileComplete: () => boolean
  setHydrated: () => void
  fetchUser: () => Promise<void>
  fetchBusinesses: () => Promise<void>
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>
  deleteBusiness: (id: string) => Promise<void>
  createAgent: (data: Partial<Agent>) => Promise<void>
  fetchAgents: (businessId: string) => Promise<void>
  updateAgent: (id: string, agentData: Partial<Agent>) => Promise<void>
  createCallLog: (data: Partial<CallLog>) => Promise<void>
  fetchCallLogs: (businessId: string) => Promise<void>
  uploadAvatar: (file: File) => Promise<void> // add uploadAvatar method to interface
  fetchVoicesByGender: (gender: "male" | "female") => Promise<void>
  fetchAvailablePhoneNumbers: () => Promise<void>
  assignPhoneNumberToBusiness: (
    businessId: string,
    payload: {
      vapiPhoneNumberId: string
      vapiPhoneNumber: string
      voiceId: string
      agentName: string
      categoryId: string
    },
  ) => Promise<void>
  fetchNotifications: () => Promise<void>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAllNotifications: () => Promise<void>
  fetchVapiCallLogs: (businessId: string, limit?: number) => Promise<void>
  refreshToken: () => Promise<string | null>
  profileCompleted?: boolean
  knowledgeBase: any[]
  fetchKnowledgeBase: (businessId: string) => Promise<void>
}

const BASE_URL = "https://rhys-unerasable-unsedimentally.ngrok-free.dev"

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      business: null,
      businesses: [],
      agents: [],
      callLogs: [],
      loading: false,
      error: null,
      isHydrated: false,
      isFirstTimeUser: false,
      voices: [],
      availablePhoneNumbers: [],
      notifications: [],
      unreadCount: 0,
      knowledgeBase: [],
      profileCompleted: false,

      signup: async (email: string, password: string, name: string) => {
        set({ loading: true, error: null })
        try {
          if (!email || !password || !name) {
            throw new Error("All fields are required")
          }

          console.log("[v0] Signup request body:", { email, password: "***", name })

          const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, password, name }),
          })

          console.log("[v0] Signup response status:", response.status)

          const data = await response.json()

          console.log("[v0] Signup response data:", data)

          if (!response.ok) {
            throw new Error(data.message || "Signup failed")
          }

          set({
            user: {
              userId: data.userId,
              email,
              name,
              token: data.token,
            },
            profile: null,
            isFirstTimeUser: data.isFirstTimeUser !== false,
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Signup failed"
          console.error("[v0] Signup error details:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
          throw error
        }
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Login failed")
          }

          set({
            user: {
              userId: data.userId,
              email,
              token: data.token,
            },
            isFirstTimeUser: data.isFirstTimeUser || false,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            loading: false,
          })
          throw error
        }
      },

      fetchProfile: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/profile`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch profile")
          }

          set({
            profile: data.profile,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch profile",
            loading: false,
          })
          throw error
        }
      },

      updateProfile: async (profileData: Partial<Profile>) => {
        set({ loading: true, error: null })
        try {
          const state = get()
          const { user } = state

          if (!user?.token) {
            console.log("[v0] No token found, attempting to refresh from storage")
            throw new Error("Not authenticated. Please log in again.")
          }

          console.log("[v0] Updating profile with token:", user.token.substring(0, 20) + "...")

          const response = await fetch(`${BASE_URL}/api/profile`, {
            method: "PUT",
            headers: getHeaders(user.token),
            body: JSON.stringify(profileData),
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("[v0] Profile update failed:", data)
            throw new Error(data.error || data.message || "Failed to update profile")
          }

          set({
            profile: data.profile,
            isFirstTimeUser: false,
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
          console.error("[v0] Profile update error:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
          throw error
        }
      },

      createBusiness: async (businessData: Partial<Business>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
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
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/business`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch business")
          }

          set({
            business: data.business,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch business",
            loading: false,
          })
          throw error
        }
      },

      isProfileComplete: () => {
        const { business, profileCompleted } = get()
        return business?.isProfileCompleted ?? profileCompleted ?? false
      },

      setHydrated: () => {
        set({ isHydrated: true })
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          business: null,
          error: null,
          isFirstTimeUser: false,
          notifications: [],
          unreadCount: 0,
          knowledgeBase: [],
          profileCompleted: false,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      fetchUser: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/auth/me`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user")
          }

          set({
            profile: {
              ...(data.profile || data.user?.profile || {}),
              isProfileComplete: data.profileCompleted || data.business?.isProfileCompleted || false,
            },
            user: {
              ...user,
              email: data.email || data.user?.email,
              name: data.profile?.name || data.user?.profile?.name,
            },
            business: data.business || null,
            agents: data.agent ? [data.agent] : [],
            isFirstTimeUser: data.isFirstTimeUser || false,
            profileCompleted: data.profileCompleted || data.business?.isProfileCompleted || false,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch user",
            loading: false,
          })
          throw error
        }
      },

      fetchBusinesses: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
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
          const { user } = get()
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
          const { user } = get()
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

      createAgent: async (agentData: Partial<Agent>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/agent`, {
            method: "POST",
            headers: getHeaders(user.token),
            body: JSON.stringify(agentData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to create agent")
          }

          set((state) => ({
            agents: [...state.agents, data.agent],
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create agent",
            loading: false,
          })
          throw error
        }
      },

      fetchAgents: async (businessId: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/agent/business/${businessId}`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch agents")
          }

          set({
            agents: data.agents || [],
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch agents",
            loading: false,
          })
          throw error
        }
      },

      updateAgent: async (id: string, agentData: Partial<Agent>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/agent/${id}`, {
            method: "PUT",
            headers: getHeaders(user.token),
            body: JSON.stringify(agentData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to update agent")
          }

          set((state) => ({
            agents: state.agents.map((a) => (a._id === id ? data.agent : a)),
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update agent",
            loading: false,
          })
          throw error
        }
      },

      createCallLog: async (callLogData: Partial<CallLog>) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/call-logs`, {
            method: "POST",
            headers: getHeaders(user.token),
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
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/call-logs/vapi/business/${businessId}`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          console.log("[v0] Fetch Call Logs Response:", data)

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch call logs")
          }

          set({
            callLogs: data.callLogs || [],
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch call logs"
          console.error("[v0] Fetch Call Logs Error:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
        }
      },

      uploadAvatar: async (file: File) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const formData = new FormData()
          formData.append("avatar", file)

          const response = await fetch(`${BASE_URL}/api/profile/upload-avatar`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "ngrok-skip-browser-warning": "69420",
            },
            body: formData,
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to upload avatar")
          }

          set({
            profile: data.profile,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to upload avatar",
            loading: false,
          })
          throw error
        }
      },

      fetchVoicesByGender: async (gender: "male" | "female") => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/voice/available?gender=${gender}`, {
            method: "GET",
            headers: getHeaders(user.token),
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
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/vapi/phone-numbers/available`, {
            method: "GET",
            headers: getHeaders(user.token),
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

      assignPhoneNumberToBusiness: async (
        businessId: string,
        payload: {
          vapiPhoneNumberId: string
          vapiPhoneNumber: string
          voiceId: string
          agentName: string
          categoryId: string
        },
      ) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
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

      verifyEmail: async (token: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`${BASE_URL}/api/auth/verify-email`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ token }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to verify email")
          }

          set({ loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to verify email",
            loading: false,
          })
          throw error
        }
      },

      resendVerification: async (email: string) => {
        set({ loading: true, error: null })
        try {
          const response = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to resend verification email")
          }

          set({ loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to resend verification email",
            loading: false,
          })
          throw error
        }
      },

      fetchNotifications: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/notifications`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch notifications")
          }

          set({
            notifications: data.notifications || [],
            unreadCount: data.unreadCount || 0,
            loading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch notifications",
            loading: false,
          })
          throw error
        }
      },

      markNotificationAsRead: async (notificationId: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
            method: "PUT",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to mark notification as read")
          }

          set((state) => ({
            notifications: state.notifications.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n)),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }))
        } catch (error) {
          console.error("[v0] Mark notification as read error:", error)
          throw error
        }
      },

      markAllNotificationsAsRead: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/notifications/all/read`, {
            method: "PUT",
            headers: getHeaders(user.token),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to mark all notifications as read")
          }

          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          }))
        } catch (error) {
          console.error("[v0] Mark all notifications as read error:", error)
          throw error
        }
      },

      deleteNotification: async (notificationId: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}`, {
            method: "DELETE",
            headers: getHeaders(user.token),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to delete notification")
          }

          set((state) => ({
            notifications: state.notifications.filter((n) => n._id !== notificationId),
          }))
        } catch (error) {
          console.error("[v0] Delete notification error:", error)
          throw error
        }
      },

      clearAllNotifications: async () => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/notifications`, {
            method: "DELETE",
            headers: getHeaders(user.token),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "Failed to clear notifications")
          }

          set({
            notifications: [],
            unreadCount: 0,
          })
        } catch (error) {
          console.error("[v0] Clear all notifications error:", error)
          throw error
        }
      },

      fetchVapiCallLogs: async (businessId: string, limit?: number) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const queryParams = limit ? `?limit=${limit}` : ""
          const response = await fetch(`${BASE_URL}/api/call-logs/vapi/business/${businessId}${queryParams}`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          console.log("[v0] VAPI Call Logs Response:", data)

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch VAPI call logs")
          }

          set({
            callLogs: data.callLogs || [],
            loading: false,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch VAPI call logs"
          console.error("[v0] VAPI Call Logs Error:", errorMessage)
          set({
            error: errorMessage,
            loading: false,
          })
          throw error
        }
      },

      refreshToken: async () => {
        try {
          console.log("[v0] Attempting to refresh token...")
          const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: getHeaders(),
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("[v0] Token refresh failed:", data.message)
            set({ user: null })
            return null
          }

          if (data.token) {
            set((state) => ({
              user: state.user ? { ...state.user, token: data.token } : null,
            }))
            console.log("[v0] Token refreshed successfully")
            return data.token
          }

          return null
        } catch (error) {
          console.error("[v0] Error refreshing token:", error)
          set({ user: null })
          return null
        }
      },

      fetchKnowledgeBase: async (businessId: string) => {
        set({ loading: true, error: null })
        try {
          const { user } = get()
          if (!user?.token) {
            throw new Error("No authentication token")
          }

          const response = await fetch(`${BASE_URL}/api/knowledge-base/business/${businessId}`, {
            method: "GET",
            headers: getHeaders(user.token),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch knowledge base")
          }

          set({ knowledgeBase: data.knowledgeBase || [] })
        } catch (error) {
          console.error("[v0] Error fetching knowledge base:", error)
          set({ error: error instanceof Error ? error.message : "Failed to fetch knowledge base" })
        }
      },
    }),
    {
      name: "auth-store",
    },
  ),
)
