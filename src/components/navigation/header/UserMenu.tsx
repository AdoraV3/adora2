"use client"

import { ChevronDown } from "lucide-react"
import type { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"

interface UserMenuProps {
  name: string
  email: string
  avatar: string | StaticImport
  vapiPhone?: string
  onClick?: () => void
}

export function UserMenu({ name, email, avatar, vapiPhone, onClick }: UserMenuProps) {
  return (
    <div onClick={onClick} className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
      {/* Avatar */}
      <div className="w-8 h-8 relative shrink-0">
        <Image src={avatar || "/placeholder.svg"} alt={`${name} avatar`} fill className="rounded-full object-cover" />
      </div>
      {/* User info – hidden on mobile */}
      <div className="hidden sm:flex flex-col min-w-0">
        <span className=" font-semibold text-gray-900 truncate">{name}</span>
        <span className="text-xs text-gray-400 truncate lowercase">{email}</span>
      </div>

      {/* Dropdown icon (always visible) */}
      <ChevronDown size={16} className="text-gray-600 shrink-0" />
    </div>
  )
}
