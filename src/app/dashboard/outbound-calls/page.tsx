// 'use client'

// import AddCallButton from "@/features/outbound-calls/AddCallButton";
// import CallTable from "@/features/outbound-calls/CallTable";
// import SearchBar from "@/features/outbound-calls/SearchBar";

// export default function OutboundCallsPage () {
//     return (
//         <div className="w-screen md:w-[80%]">
//         <div className="flex flex-col m-6 gap-6">
        
//             {/* Header Section */}
//             <div className="flex flex-col sm:flex-row justify-between gap-3">
//             <SearchBar />
//             <AddCallButton onClick={() => null} />
//             </div>

//             {/* Table */}
//             <CallTable />
//         </div>
//         </div>
//     )
// }



import { Sparkles } from "lucide-react"

export default function OutboundCallsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <svg className="w-25 h-25 text-orange-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Coming Soon</h2>
            <Sparkles className="w-5 h-5 text-orange-500" />
          </div>

          <h1 className="text-2xl sm:text-2xl font-bold text-gray-900">Outbound Calls</h1>

          <p className="text-base text-gray-600">
            We&apos;re building powerful outbound calling capabilities to help you reach your customers. Check back
            soon!
          </p>

          {/* <div className="pt-4 space-y-2">
            <p className="text-sm text-gray-500">Features coming:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Schedule bulk calls</li>
              <li>✓ Call campaigns</li>
              <li>✓ Real-time analytics</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>
  )
}
