"use client"

export function KBGuidelines() {
  const guidelines = [
    {
      title: "GENERAL INFORMATION",
      description: "Overview of your company, mission, and policies.",
    },
    {
      title: "PRODUCTS & SERVICES",
      description: "Details about offerings, features, and usage.",
    },
    {
      title: "BILLING & PAYMENTS",
      description: "Pricing plans, invoices, and refund policies.",
    },
    {
      title: "FAQS",
      description: "Answers to related common questions.",
    },
    {
      title: "TROUBLESHOOTING",
      description: "Common issues and step-by-step solutions.",
    },
    {
      title: "CONTACT & SUPPORT",
      description: "Ways to reach your team for further help.",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-orange-900 mb-2">ADORA KNOWLEDGE BASE GUIDELINE</h2>
        <p className="text-sm text-orange-700">Knowledge base is accepted in PDF or MSword Format</p>
      </div>

      <div className="space-y-3">
        {guidelines.map((guideline, index) => (
          <div
            key={index}
            className="border-2 border-orange-400 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-orange-900 text-sm mb-1">{guideline.title}</h3>
            <p className="text-xs text-gray-700 leading-relaxed">{guideline.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
