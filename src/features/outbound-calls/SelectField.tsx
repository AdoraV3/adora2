import React from "react";

interface SelectFieldProps {
  label: string;
  options: string[];
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, required }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 outline-none">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
