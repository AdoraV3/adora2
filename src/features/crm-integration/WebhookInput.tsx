// components/WebhookInput.tsx
import React from 'react';
import { Clipboard, Check } from 'lucide-react';

interface WebhookInputProps {
  value: string;
  onChange: (value: string) => void;
  onPaste: () => void;
}

export const WebhookInput: React.FC<WebhookInputProps> = ({
  value,
  onChange,
  onPaste
}) => {
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handlePaste = async () => {
    await onPaste();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="w-full ">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your webhook URL here..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none h-24"
          rows={3}
        />
        <button
          onClick={handlePaste}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Paste from clipboard"
        >
          {showSuccess ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Clipboard className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <button
        onClick={handlePaste}
        className="mt-3 w-fit bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Paste URL
      </button>

      {value && (
        <button
          className="mt-2 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Connect to CRM
        </button>
      )}
    </div>
  );
};