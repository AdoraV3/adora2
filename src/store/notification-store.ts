"use client"

import { create } from "zustand"
import { useAuthStore } from "./auth-store"

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

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  markNotificationAsRead: (notificationId: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAllNotifications: () => Promise<void>
  clearError: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark notification as read")
      }

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
    } catch (error) {
      console.error("[v0] Mark notification as read error:", error)
      throw error
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch("http://localhost:5000/api/notifications/all/read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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
    try {
      const { user } = useAuthStore.getState()
      if (!user?.token) {
        throw new Error("No authentication token")
      }

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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

  clearError: () => {
    set({ error: null })
  },
}))
