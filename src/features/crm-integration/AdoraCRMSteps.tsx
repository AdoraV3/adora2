// components/AdoraCRMSteps.tsx
import React from 'react';
import { StepsSection } from './StepsSection';
import { WebhookSection } from './WebhookSection';

export const AdoraCRMSteps: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StepsSection />
        </div>
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200">
          <WebhookSection />
        </div>
      </div>
    </div>
  );
};