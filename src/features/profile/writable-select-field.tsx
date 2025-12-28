import { ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * A reusable component for a writable select field.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the select field.
 * @param {string} props.initialValue - The initial selected value.
 * @param {string[]} props.options - The array of available options.
 */
interface WritableSelectFieldProps {
  label: string;
  initialValue: string;
  options: string[];
}

export default function WritableSelectField({ label, initialValue, options }: WritableSelectFieldProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          className="w-full rounded-md bg-gray-100 p-3 pr-10 text-gray-800 appearance-none focus:border-[var(--accent)] focus:ring focus:ring-[var(--accent)] focus:ring-opacity-50"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}