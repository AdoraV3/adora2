'use client'

import TabHeader from '@/features/account-settings/layout/tab-header';
import { usePathname } from 'next/navigation';

/**
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render inside the layout.
 */
interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  const pathname = usePathname();

  // In a real application, you might use a more robust state management or context for the active tab.
  // For this example, we'll derive it from the pathname.
  const activePath = pathname || '/account/info';

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        <TabHeader activePath={activePath} />
        <main>{children}</main>
      </div>
    </div>
  );
}
