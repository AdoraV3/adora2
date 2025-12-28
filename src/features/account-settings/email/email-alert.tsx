/**
 * A reusable alert component for warnings or information.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.icon - The icon for the alert.
 * @param {string} props.title - The title of the alert.
 * @param {string} props.message - The main message of the alert.
 */
interface AlertProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

export default function EmailAlert({ icon, title, message }: AlertProps) {
  return (
    <div className="flex p-4 rounded-lg bg-orange-100 border border-orange-200">
      <div className="flex-shrink-0 text-[var(--accent)]">
        {icon}
      </div>
      <div className="ml-3">
        <h4 className=" font-semibold text-[var(--accent)]">{title}</h4>
        <p className="mt-1  text-[var(--accent)]">{message}</p>
      </div>
    </div>
  );
}