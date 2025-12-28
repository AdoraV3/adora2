'use client';

import { ChevronDown } from 'lucide-react';

/**
 * A simple reusable component for a select input field.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.value - The currently selected value.
 * @param {Array<string>} props.options - An array of options for the select dropdown.
 */
interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
}

export default function PreferenceSelectField({ label, value, options }: SelectFieldProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          className="w-full rounded-md border border-gray-300 p-3 pr-10 focus:border-[var(--accent)] focus:ring focus:ring-[var(--accent)] focus:ring-opacity-50 appearance-none"
          value={value}
          onChange={() => {}} // Add a real onChange handler in a full application
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
}