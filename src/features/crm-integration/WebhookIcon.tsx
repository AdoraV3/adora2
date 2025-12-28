// components/WebhookIcon.tsx
import React from 'react';

export const WebhookIcon: React.FC = () => {
  return (
    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-orange-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    </div>
  );
};