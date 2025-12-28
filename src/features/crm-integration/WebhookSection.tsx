'use client'

// components/WebhookSection.tsx
import React, { useState } from 'react';
import { WebhookIcon } from './WebhookIcon';
import { WebhookInput } from './WebhookInput';

export const WebhookSection: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');

  const handleWebhookChange = (value: string) => {
    setWebhookUrl(value);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setWebhookUrl(text);
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 h-full">
      <div className="flex flex-col items-center text-center">
        <WebhookIcon />
        
        <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">
          Paste Webhook URL
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Copy the generated Webhook URL from Make.com and paste it in field here.
        </p>

        <WebhookInput
          value={webhookUrl}
          onChange={handleWebhookChange}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
};