// components/StepsSection.tsx
import React from 'react';
import { StepItem } from './StepItem';
import { VideoNote } from './VideoNote';

export const StepsSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Go to Make.com',
      description: 'Sign up or log in if you already',
      linkText: 'Make.com',
      isLink: true
    },
    {
      number: 2,
      title: 'Create a Scenario:',
      description: 'Add your CRM (e.g., Salesforce, HubSpot, or Zoho CRM) to the scenario. Example: If using Salesforce, you might set actions like "Create a new lead" or "Update a contact" when triggered by certain events.'
    },
    {
      number: 3,
      title: 'Choose Data Feeds:',
      description: 'Select the data feeds you want to collect via the webhook. Example: You may choose to collect "new lead details," "updated customer information," or "sales opportunities" from your CRM.'
    },
    {
      number: 4,
      title: 'Create a Custom Webhook:',
      description: 'In the scenario, create a custom webhook, and a unique URL will be generated.'
    },
    {
      number: 5,
      title: 'Return to Adora:',
      description: 'Copy the webhook URL, come back to the Adora website, and paste the URL where required.'
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      <h2 className="font-semibold text-gray-900 mb-6">
        Steps to Connect Adora to your CRM
      </h2>
      
      <div className="space-y-6">
        {steps.map((step) => (
          <StepItem key={step.number} {...step} />
        ))}
      </div>

      <VideoNote />
    </div>
  );
};