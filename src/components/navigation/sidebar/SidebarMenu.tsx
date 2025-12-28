'use client'

import {
  LayoutDashboard,
  Phone,
  BookOpen,
  Calendar,
  CreditCard,
  Share2,
  Settings,
  PhoneOutgoing,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarMenuProps {
  closeSidebar: () => void;
}

export default function SidebarMenu({ closeSidebar }: SidebarMenuProps) {

  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      <Link
      href='/dashboard'
      onClick={closeSidebar}
      className={`flex items-center gap-2 px-3 py-3 rounded-lg transition 
         ${
          pathname === 'dashboard' || pathname === '/dashboard' || pathname.includes('profile') || pathname.includes('notifications') ? "bg-[var(--primary)] text-[var(--accent)]" : "text-[var(--primary)] hover:bg-[var(--accent-dark)]"
        }`}
    >
      <LayoutDashboard size={16} />
      <span className="text-xs">Dashboard</span>
    </Link>
      <SidebarItem href="/dashboard/call-logs" icon={Phone} label="Call Logs" closeSidebar={closeSidebar} />
      <SidebarItem href="/dashboard/knowledge-base" icon={BookOpen} label="Knowledge Base" closeSidebar={closeSidebar} />
      <SidebarItem href="/dashboard/outbound-calls" icon={PhoneOutgoing} label="Outbound Calls" closeSidebar={closeSidebar} />
      <SidebarItem href="/dashboard/appointments" icon={Calendar} label="Appointments" closeSidebar={closeSidebar} />
      <SidebarItem href="/dashboard/payment" icon={CreditCard} label="Payment" closeSidebar={closeSidebar} />
      <SidebarItem href="/dashboard/crm-integration" icon={Share2} label="CRM Integration" closeSidebar={closeSidebar} />
      <SidebarItem href="/dashboard/account-settings" icon={Settings} label="Settings" closeSidebar={closeSidebar} />
    </nav>
  );
}
