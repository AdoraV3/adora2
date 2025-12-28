import { Check } from 'lucide-react'

const PricingCard = ({ 
  price, 
  period = "/month", 
  title, 
  description, 
  features, 
  isPopular = false,
  buttonText = "Choose plan",
  priceColor = "text-gray-800"
}: {
  price: string
  period?: string
  title: string
  description: string
  features: string[]
  isPopular?: boolean
  buttonText?: string
  priceColor?: string
}) => (
  <div className={`relative rounded-2xl p-6 ${isPopular ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white scale-105 shadow-2xl' : 'bg-white border border-gray-200 shadow-lg'}`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-orange-400 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
      </div>
    )}
    
    <div className="text-center mb-6">
      <div className="flex items-baseline justify-center mb-2">
        <span className={`text-4xl font-bold ${isPopular ? 'text-white' : priceColor}`}>{price}</span>
        <span className={`text-lg ml-1 ${isPopular ? 'text-orange-100' : 'text-gray-500'}`}>{period}</span>
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm ${isPopular ? 'text-orange-100' : 'text-gray-600'}`}>{description}</p>
    </div>
    
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3">
          <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPopular ? 'text-orange-200' : 'text-green-500'}`} />
          <span className={`text-sm ${isPopular ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
        </li>
      ))}
    </ul>
    
    <button className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
      isPopular 
        ? 'bg-orange-400 hover:bg-orange-300 text-white' 
        : 'bg-orange-500 hover:bg-orange-600 text-white'
    }`}>
      {buttonText}
    </button>
  </div>
)

export default function PricingPlansSection() {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium text-sm">MONTHLY</button>
            <button className="text-gray-600 px-6 py-2 rounded-full font-medium text-sm hover:text-gray-800">YEARLY</button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {/* Basic Plan */}
          <PricingCard
            price="$99"
            title="Basic Plan"
            description="For small businesses looking for AI voice support and basic functionality."
            features={[
              "1 AI Voice agent",
              "Handle up to 25 calls/month",
              "Access to 5 languages and accents",
              "Email Support",
              "Basic knowledge base integration",
              "Get dedicated phone number for your customer service"
            ]}
          />

          {/* Standard Plan */}
          <PricingCard
            price="$199"
            title="Standard Plan"
            description="Ideal for business looking for more flexibility and functionality."
            features={[
              "2 AI Voice agent",
              "Handle up to 50 calls/month",
              "Access to 20 languages and accents",
              "Customizable knowledge base",
              "Integration with up to 5 platforms",
              "Real-time call analytics",
              "24/7 customer support",
              "CRM integration (limited to 3 platforms)",
              "Get dedicated phone number for customer service"
            ]}
          />

          {/* Popular Plan */}
          <PricingCard
            price="$399"
            title="Standard Plan"
            description="Ideal for business looking for more flexibility & functionality."
            features={[
              "Unlimited AI agents",
              "Handle up to 1000 calls/month (Escalate to live agent when needed)",
              "Access to 20+ languages and accents",
              "Integration with 3000+ platforms",
              "Dedicated Account manager",
              "Advance function calling (e.g. bookings, escalations transfers)",
              "SLA-backed 24/7 premium support",
              "Get dedicated phone number for customer service"
            ]}
            isPopular={true}
            buttonText="Choose plan"
          />

          {/* Enterprise Plan */}
          <PricingCard
            price="Custom"
            period="/month"
            title="Enterprise Plan"
            description=""
            priceColor="text-orange-500"
            features={[
              "Unlimited AI agents",
              "Handle up to 10,000 calls/month (Escalate to live agent when needed)",
              "Access to 300+ languages and accents",
              "Integration with 3,000+ platforms",
              "Dedicated Account manager",
              "Advance function calling (e.g. bookings, escalations transfers)",
              "SLA-backed 24/7 premium support",
              "Get dedicated phone number for customer service"
            ]}
            buttonText="Choose plan"
          />
        </div>

        {/* Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Talk to Adora AI Assistant
          </div>
        </div>
      </div>
    </div>
  )
}