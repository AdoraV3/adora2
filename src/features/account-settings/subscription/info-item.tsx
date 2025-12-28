/**
 * A reusable component for displaying a key-value pair.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the field.
 * @param {string} props.value - The value of the field.
 * @param {boolean} [props.isBoldValue=false] - Optional prop to make the value bold.
 */
interface InfoItemProps {
  label: string;
  value: string;
  isBoldValue?: boolean;
}

export default function InfoItem({ label, value, isBoldValue = false }: InfoItemProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className={`text-gray-800 ${isBoldValue ? 'font-semibold' : ''}`}>{label}</span>
      <span className="font-medium text-gray-500">{value}</span>
    </div>
  );
}