export default function PricingHeroSection() {
  return (
    <div className="relative min-h-[400px] bg-white overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="grid grid-cols-12 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 gap-px h-full">
          {Array.from({ length: 336 }).map((_, i) => (
            <div
              key={i}
              className={`border border-gray-200 ${
                // Random peach/orange squares
                [23, 45, 67, 89, 134, 156, 178, 234, 267, 298, 312].includes(i)
                  ? 'bg-orange-200'
                  : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-tight mb-4 sm:mb-6">
            Choose The Perfect
            <br className="hidden sm:block" />
            <span className="block mt-2 sm:mt-0">Plan For Your Business</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-orange-500 font-medium">
            Simple, Transparent Pricing for Smarter Customer Support
          </p>
        </div>
      </div>
    </div>
  )
}