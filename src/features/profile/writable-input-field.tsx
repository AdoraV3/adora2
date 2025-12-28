'use client'

import { useState } from "react";

/**
 * A reusable component for a writable input field.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the input.
 * @param {string} props.initialValue - The initial value of the input field.
 */
interface WritableInputFieldProps {
  label: string;
  initialValue: string;
}

export default function WritableInputField({ label, initialValue }: WritableInputFieldProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md bg-gray-100 p-3 text-gray-800 focus:border-[var(--accent)] focus:ring focus:ring-[var(--accent)] focus:ring-opacity-50"
      />
    </div>
  );
}