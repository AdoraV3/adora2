import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, type = "text", required, placeholder }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 outline-none"
      />
    </div>
  );
};

export default InputField;
