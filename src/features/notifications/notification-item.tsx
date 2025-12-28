"use client"

import { useState } from "react"
import { CheckCircle2, Trash2, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { NotificationIcon } from "./notification-icon"

interface NotificationItemProps {
  title: string
  source: string
  date: string
  isNew: boolean
  notificationId?: string
  message?: string
  type?: "success" | "info" | "warning" | "error"
  onOpenDetail?: () => void
}

export default function NotificationItem({
  title,
  source,
  date,
  isNew,
  notificationId,
  message,
  type = "info",
  onOpenDetail,
}: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMarking, setIsMarking] = useState(false)
  const { markNotificationAsRead, deleteNotification } = useAuthStore()

  const handleMarkAsRead = async () => {
    if (!notificationId) return
    setIsMarking(true)
    try {
      await markNotificationAsRead(notificationId)
    } catch (error) {
      console.error("[v0] Error marking notification as read:", error)
    } finally {
      setIsMarking(false)
    }
  }

  const handleDelete = async () => {
    if (!notificationId) return
    setIsDeleting(true)
    try {
      await deleteNotification(notificationId)
    } catch (error) {
      console.error("[v0] Error deleting notification:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        onClick={onOpenDetail}
        className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer group ${
          isNew
            ? "bg-[#E05E00]/2 border-[#E05E00] hover:border-[#E05E00] hover:shadow-md"
            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
        }`}
      >
        <NotificationIcon type={type} size={24} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#E05E00] transition-colors">
                {title}
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {source} • {date}
              </p>
              {message && <p className="text-gray-700 text-sm mt-2 line-clamp-2">{message}</p>}
            </div>
            {isNew && <div className="w-2 h-2 rounded-full bg-[#E05E00] flex-shrink-0 mt-1"></div>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isNew && notificationId && (
            <button
              onClick={handleMarkAsRead}
              disabled={isMarking}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
              title="Mark as read"
            >
              {isMarking ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            </button>
          )}
          {notificationId && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Delete notification"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
