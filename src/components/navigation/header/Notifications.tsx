"use client";

import { Bell } from 'lucide-react';
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from 'react';

export function Notifications() {
  const { notifications, fetchNotifications, unreadCount } = useAuthStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <Link
      href="/dashboard/notifications"
      aria-label="Notifications"
      className="p-2 rounded-full hover:bg-gray-100 transition relative"
    >
      <Bell size={16} className="text-gray-700" />
      {unread > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-5">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
