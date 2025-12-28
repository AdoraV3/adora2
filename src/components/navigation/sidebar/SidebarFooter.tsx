'use client';

import { useContext, useState } from "react";
import { LogOut, Loader2 } from 'lucide-react';
import { DashboardLayoutContext } from "@/app/dashboard/layout";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from 'next/navigation';

export default function SidebarFooter() {
  const context = useContext(DashboardLayoutContext);
  const { logout } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.error("[v0] Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border-t border-white/20">
      <button 
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
        <span className="text-xs font-medium">{isLoading ? "Logging out..." : "Logout"}</span>
      </button>
    </div>
  )
}
