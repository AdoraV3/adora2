// components/StepItem.tsx
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  linkText?: string;
  isLink?: boolean;
}

export const StepItem: React.FC<StepItemProps> = ({
  number,
  title,
  description,
  linkText,
  isLink
}) => {
  const renderContent = () => {
    if (isLink && linkText) {
      const parts = description.split(linkText);
      return (
        <span>
          {parts[0]}
          <a 
            href="https://make.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
          >
            {linkText}
            <ExternalLink className="h-3 w-3" />
          </a>
          {parts[1]}
        </span>
      );
    }
    return description;
  };

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white font-medium">
          {number}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {renderContent()}
        </p>
      </div>
    </div>
  );
};