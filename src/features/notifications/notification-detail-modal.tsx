"use client"

import { X, Bell, Calendar, Tag, Loader2 } from 'lucide-react'
import { FC, useState } from 'react'
import { useAuthStore } from "@/store/auth-store"

interface NotificationDetailModalProps {
  notification: {
    _id: string
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
  }
  onClose: () => void
}

const NotificationDetailModal: FC<NotificationDetailModalProps> = ({
  notification,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteNotification, markNotificationAsRead } = useAuthStore()

  const formattedDate = new Date(notification.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const typeColorMap: { [key: string]: string } = {
    Message: 'bg-blue-100 text-blue-800',
    Account: 'bg-purple-100 text-purple-800',
    Profile: 'bg-green-100 text-green-800',
    System: 'bg-gray-100 text-gray-800',
  }

  const typeColor = typeColorMap[notification.type] || 'bg-gray-100 text-gray-800'

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteNotification(notification._id)
      onClose()
    } catch (error) {
      console.error("[v0] Error deleting notification:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMarkAsRead = async () => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id)
      } catch (error) {
        console.error("[v0] Error marking as read:", error)
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header with icon and type badge */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-[#E05E00]/5 border-[#E05E00] border-1 rounded-xl">
            <Bell size={24} className="text-[#E05E00]" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900">{notification.title}</h2>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
              {notification.type}
            </span>
          </div>
        </div>

        {/* Message content */}
        <div className="mb-8">
          <p className="text-gray-700 text-base leading-relaxed">{notification.message}</p>
        </div>

        {/* Metadata */}
        <div className="bg-[#E05E00]/5 border-[#E05E00] border-1 rounded-xl p-4 mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-[#E05E00]" />
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Date & Time</p>
              <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tag size={18} className="text-[#E05E00]" />
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Notification ID</p>
              <p className="text-sm font-mono text-gray-600">{notification._id}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onClose}
            className="flex-1 bg-[#E05E00] hover:bg-[#E05E00] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : null}
            Delete
          </button>
        </div>

        {/* Mark as read button if unread */}
        {!notification.isRead && (
          <button
            onClick={handleMarkAsRead}
            className="w-full bg-green-100 hover:bg-green-200 text-green-600 font-semibold py-3 rounded-lg transition-colors"
          >
            Mark as Read
          </button>
        )}
      </div>
    </div>
  )
}

export default NotificationDetailModal
