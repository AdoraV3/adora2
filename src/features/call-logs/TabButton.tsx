import React from "react";

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors
        ${active ? "bg-orange-100 text-[var(--accent)]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
      `}
    >
      {label}
    </button>
  );
};

export default TabButton;
