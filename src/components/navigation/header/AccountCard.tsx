/* eslint-disable @next/next/no-img-element */
"use client"

import { Upload, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayoutContext } from "@/app/dashboard/layout"
import { useAuthStore } from "@/store/auth-store"
import { useSubscriptionStore } from "@/store/subscription-store"

interface AccountCardProps {
  onLinkClick: () => void
  username?: string
  email?: string
  avatar?: string
}

export const AccountCard = ({ onLinkClick, username, email, avatar }: AccountCardProps) => {
  const router = useRouter()
  const context = useContext(DashboardLayoutContext)
  const { business, logout } = useAuthStore()
  const { currentSubscription, fetchBusinessSubscription, fetchSubscriptionStatus } = useSubscriptionStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (business?._id && !currentSubscription) {
        try {
          await fetchBusinessSubscription(business._id)
          await fetchSubscriptionStatus(business._id)
        } catch (error) {
          console.error("[v0] Error loading subscription in AccountCard:", error)
        }
      }
    }

    loadSubscriptionData()
  }, [business?._id, currentSubscription, fetchBusinessSubscription, fetchSubscriptionStatus])

  const getPlanName = () => {
    if (currentSubscription?.subscription?.plan) {
      const planName = currentSubscription.subscription.plan
      const period = currentSubscription.subscription.period || "monthly"
      return `${planName.charAt(0).toUpperCase() + planName.slice(1)} (${period})`
    }
    return "Free Plan"
  }

  const planName = getPlanName()
  const displayName = username || "User"
  const displayEmail = email || "user@example.com"
  const displayAvatar = avatar
  const vapiPhone = business?.vapiPhoneNumber || "Not assigned"

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      if (context) {
        context.setShowLogoutModal(false)
      }
      logout()
      onLinkClick()
      router.push("/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="w-fit bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-4">Account</h2>

        <div className="flex items-center mb-4">
          <img
            src={displayAvatar || "https://placehold.co/48x48/E2E8F0/4A5568?text=A"}
            alt={displayName}
            className="w-10 h-10 rounded-full mr-4 object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/48x48/E2E8F0/4A5568?text=A"
            }}
          />
          <div className="flex-grow flex gap-2">
            <div>
              <p className="font-semibold text-gray-800">{displayName}</p>
              <p className="text-gray-500 text-sm">{displayEmail}</p>
            </div>
            <span className="bg-[#E05E00] text-white h-fit text-xs px-2 py-1 rounded-md whitespace-nowrap">
              {planName}
            </span>
          </div>
        </div>

        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium">VAPI Phone</p>
          <p className="text-sm font-semibold text-gray-800">{vapiPhone}</p>
        </div>

        <a
          href="/dashboard/account-settings/subscription"
          onClick={onLinkClick}
          className="flex items-center justify-between text-orange-500 font-semibold py-3 hover:text-orange-600 transition-colors duration-200"
        >
          <span>Upgrade plan</span>
          <Upload size={16} />
        </a>

        <hr className="my-2 border-gray-200" />

        <nav className="space-y-1">
          <Link
            href="/dashboard/profile"
            onClick={onLinkClick}
            className="block text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-3 py-3 transition-colors duration-200"
          >
            <span>Profile</span>
          </Link>
          <Link
            href="/dashboard/account-settings"
            onClick={onLinkClick}
            className="block text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-3 py-3 transition-colors duration-200"
          >
            <span>Account Settings</span>
          </Link>
          <a
            href="#"
            className="block text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-3 py-3 transition-colors duration-200"
          >
            <span>Help</span>
          </a>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full text-left flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md px-3 py-3 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </nav>
      </div>
    </>
  )
}
