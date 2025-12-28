// import { AdoraCRMSteps } from "@/features/crm-integration/AdoraCRMSteps";
// import React from "react";

// export default function CRMIntegrationPage() {
//   return (
//     <div className="min-h-screen py-4 px-2">
//       <div className="max-w-4xl mx-auto">
//         <AdoraCRMSteps />
//       </div>
//     </div>
//   );
// }


import { Sparkles } from "lucide-react"

export default function CRMIntegrationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <svg className="w-25 h-25 text-[#E05E00] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#E05E00]" />
            <h2 className="text-sm font-semibold text-[#E05E00] uppercase tracking-wider">Coming Soon</h2>
            <Sparkles className="w-5 h-5 text-[#E05E00]" />
          </div>

          <h1 className="text-2xl sm:text-2xl font-bold text-gray-900">CRM Integration</h1>

          <p className="text-base text-gray-600">
            We&apos;re building an amazing CRM integration feature to help you manage your customer relationships
            seamlessly. Stay tuned!
          </p>

          {/* <div className="pt-4 space-y-2">
            <p className="text-sm text-gray-500">Features coming:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Sync customer data</li>
              <li>✓ Track interactions</li>
              <li>✓ Automated workflows</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}
