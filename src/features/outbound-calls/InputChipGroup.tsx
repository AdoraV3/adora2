'use client'

import React, { useState } from "react";

interface InputChipGroupProps {
  label: string;
  options: string[];
  required?: boolean;
}

const InputChipGroup: React.FC<InputChipGroupProps> = ({ label, options, required }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={(e) => {
              e.preventDefault();
              setSelected(option);
            }}
            className={`px-3 py-1 rounded-md text-sm border transition ${
              selected === option
                ? "bg-orange-100 border-orange-400 text-orange-600"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputChipGroup;
