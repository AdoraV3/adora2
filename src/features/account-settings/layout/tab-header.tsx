import {
  User,
  Mail,
  Shield,
  Settings,
  CreditCard,
} from 'lucide-react';
import Tab from './tab';



/**
 * The main component for the tab header.
 * @param {object} props - The component props.
 * @param {string} props.activePath - The currently active path.
 */
interface TabHeaderProps {
  activePath: string;
}

export default function TabHeader({ activePath }: TabHeaderProps) {
  const tabs = [
    { href: '/dashboard/account-settings', label: 'Account info', icon: <User size={16} /> },
    { href: '/dashboard/account-settings/email', label: 'Email', icon: <Mail size={16} /> },
    { href: '/dashboard/account-settings/security', label: 'Security', icon: <Shield size={16} /> },
    { href: '/dashboard/account-settings/account-preference', label: 'Preference', icon: <Settings size={16} /> },
    { href: '/dashboard/account-settings/subscription', label: 'Subscription', icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="flex w-full overflow-x-auto border-b border-gray-200">
      {tabs.map((tab) => (
        <Tab
          key={tab.href}
          href={tab.href}
          label={tab.label}
          icon={tab.icon}
          isActive={activePath === tab.href}
        />
      ))}
    </div>
  );
}