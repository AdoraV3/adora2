'use client'

import React, { useState } from 'react'
import Header from "@/components/navigation/header/Header"
import Sidebar from "@/components/navigation/sidebar/Sidebar"
import LogoutConfirmationModal from "@/components/toasts/logout-confirmation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export const DashboardLayoutContext = React.createContext<{
  showLogoutModal: boolean
  setShowLogoutModal: (show: boolean) => void
} | null>(null)

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    // <ProtectedRoute>
      <DashboardLayoutContext.Provider value={{ showLogoutModal, setShowLogoutModal }}>
      <div className="flex h-screen">
        {/* Sidebar - desktop only */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header - desktop only */}
          <Header />

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto p-2">{children}</main>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutConfirmationModal
          onConfirm={() => setShowLogoutModal(false)}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </DashboardLayoutContext.Provider>
    // </ProtectedRoute>
  )
}
