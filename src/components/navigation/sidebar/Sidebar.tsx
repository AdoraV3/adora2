// app/components/sidebar/Sidebar.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const closeSidebar = () => setOpen(false);

  return (
    <>
      {/* Mobile hamburger */}
      {
        !open &&
        <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={16} className="text-[var(--accent)]" />
      </button>
      }

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-[var(--accent)] text-white w-48
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-48
        `}
      >
        {/* Close button (mobile only) */}
        <div className="flex bg-blue-500 justify-end md:hidden relative">
          <button
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="p-2 rounded-lg hover:bg-white/10 absolute"
          >
            <X size={16} className="text-[var(--accent)]" />
          </button>
        </div>

        <SidebarHeader />
        <SidebarMenu closeSidebar={closeSidebar} />
        <SidebarFooter />
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-55 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
