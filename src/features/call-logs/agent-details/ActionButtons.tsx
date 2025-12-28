import React from "react";
import { FileDown, Printer } from "lucide-react";

const ActionButtons: React.FC = () => {
  return (
    <div className="flex gap-2 mt-2 sm:mt-0">
      <button className="flex items-center gap-1 px-3 py-1 border rounded-md text-[var(--accent)] border-orange-300 hover:bg-orange-50">
        <FileDown size={16} /> Export
      </button>
      <button className="flex items-center gap-1 px-3 py-1 border rounded-md bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent-dark)]">
        <Printer size={16} /> Print
      </button>
    </div>
  );
};

export default ActionButtons;
