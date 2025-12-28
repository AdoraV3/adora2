import Link from "next/link";

/**
 * Renders a single tab for the navigation.
 * @param {object} props - The component props.
 * @param {string} props.href - The URL to navigate to.
 * @param {string} props.label - The text label for the tab.
 * @param {React.ReactNode} props.icon - The icon component for the tab.
 * @param {boolean} props.isActive - Whether the tab is currently active.
 */
interface TabProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

export default function Tab({ href, label, icon, isActive }: TabProps) {
  const activeClasses = isActive
    ? 'border-b-2 border-orange-500 text-orange-500 font-medium'
    : 'text-gray-600 hover:text-orange-500 hover:border-b-2 hover:border-orange-500/50';

  return (
    <Link
      href={href}
      className={`flex-1 flex items-center justify-center py-4 px-2 sm:px-4 transition-all duration-200 whitespace-nowrap ${activeClasses}`}
    >
      <div className="sm:hidden">{icon}</div>
      <span className="hidden sm:block">{label}</span>
    </Link>
  );
}