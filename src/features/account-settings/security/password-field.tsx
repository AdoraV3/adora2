/**
 * A simple reusable component for a password input field.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.placeholder - The placeholder text for the input field.
 */
interface PasswordFieldProps {
  label: string;
  placeholder: string;
}

export default function PasswordField({ label, placeholder }: PasswordFieldProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        type="password"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 p-3 focus:border-[var(--accent)] focus:ring focus:ring-[var(--accent)] focus:ring-opacity-50"
      />
    </div>
  );
}