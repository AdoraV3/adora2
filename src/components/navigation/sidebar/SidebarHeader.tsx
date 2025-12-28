// app/components/sidebar/SidebarHeader.tsx
import Image from "next/image";
import logo from "../../../../public/adora3-logo.png"

export default function SidebarHeader() {
  return (
    <div className="p-3 flex bg-[var(--primary)] items-center justify-center">
      <Image
        src={logo} // replace with your logo path
        alt="Adora3 Logo"
        width={120}
        height={35}
        priority
      />
    </div>
  );
}
