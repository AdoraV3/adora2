/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import NotificationItem from "@/features/notifications/notification-item"
import NotificationDetailModal from "@/features/notifications/notification-detail-modal"
import { formatDistanceToNow } from "date-fns"
import { Bell, Inbox, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: "success" | "info" | "warning" | "error"
  isRead: boolean
  createdAt: string
  updatedAt: string
}

const isValidNotificationType = (type: unknown): type is "success" | "info" | "warning" | "error" => {
  return type === "success" || type === "info" || type === "warning" || type === "error"
}

export default function NotificationsContent() {
  const { notifications, loading, fetchNotifications, markAllNotificationsAsRead } = useAuthStore()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const typedNotifications = (notifications as Array<any>).map((n) => ({
    ...n,
    type: isValidNotificationType(n.type) ? n.type : "info",
  })) as Notification[]

  const unreadNotifications = typedNotifications.filter((n) => !n.isRead)
  const readNotifications = typedNotifications.filter((n) => n.isRead)

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
    } catch (error) {
      console.error("[v0] Error marking all as read:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mr-2" size={24} />
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell size={28} className="text-[#E05E00]" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <p className="text-gray-600 text-sm">
          {unreadNotifications.length} new {unreadNotifications.length === 1 ? "notification" : "notifications"}
        </p>
      </div>

      {unreadNotifications.length > 0 ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Unread</h2>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-[#E05E00] hover:text-[#E05E00] transition-colors"
            >
              Mark all as read
            </button>
          </div>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                title={notification.title}
                message={notification.message}
                source={notification.type}
                type={notification.type}
                date={formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                isNew={!notification.isRead}
                notificationId={notification._id}
                onOpenDetail={() => setSelectedNotification(notification)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Earlier</h2>
        {readNotifications.length > 0 ? (
          <div className="space-y-3">
            {readNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                title={notification.title}
                message={notification.message}
                source={notification.type}
                type={notification.type}
                date={formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                isNew={false}
                notificationId={notification._id}
                onOpenDetail={() => setSelectedNotification(notification)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Inbox size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-1">You&apos;re all caught up!</p>
          </div>
        )}
      </div>

      {selectedNotification && (
        <NotificationDetailModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
      )}
    </div>
  )
}
