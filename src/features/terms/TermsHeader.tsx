'use client'

const TermsOfServiceHeader = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      {/* Decorative Background Squares */}
      <div className="absolute inset-0 opacity-10">
        {/* Top left squares */}
        <div className="absolute top-8 left-16 w-12 h-12 bg-orange-300 rounded"></div>
        <div className="absolute top-20 left-32 w-16 h-8 bg-orange-200 rounded"></div>
        
        {/* Top right squares */}
        <div className="absolute top-12 right-20 w-20 h-12 bg-orange-300 rounded"></div>
        <div className="absolute top-32 right-32 w-24 h-16 bg-orange-200 rounded"></div>
        
        {/* Middle left squares */}
        <div className="absolute top-1/2 left-8 w-14 h-20 bg-orange-200 rounded transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-24 w-8 h-8 bg-orange-300 rounded transform -translate-y-1/2"></div>
        
        {/* Middle right squares */}
        <div className="absolute top-1/2 right-12 w-18 h-14 bg-orange-300 rounded transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-40 w-12 h-24 bg-orange-200 rounded transform -translate-y-1/2"></div>
        
        {/* Bottom squares */}
        <div className="absolute bottom-16 left-20 w-16 h-12 bg-orange-200 rounded"></div>
        <div className="absolute bottom-8 left-40 w-10 h-16 bg-orange-300 rounded"></div>
        <div className="absolute bottom-20 right-16 w-14 h-10 bg-orange-300 rounded"></div>
        <div className="absolute bottom-32 right-48 w-20 h-14 bg-orange-200 rounded"></div>
        
        {/* Additional scattered squares */}
        <div className="absolute top-1/4 left-1/3 w-6 h-12 bg-orange-200 rounded"></div>
        <div className="absolute top-3/4 right-1/3 w-12 h-8 bg-orange-300 rounded"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-14 bg-orange-200 rounded"></div>
        <div className="absolute bottom-1/3 left-1/4 w-10 h-6 bg-orange-300 rounded"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Terms Of Service
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-orange-600 leading-relaxed max-w-3xl mx-auto">
            These Terms of Use govern your access and use of our Services. By using 
            Adora, you agree to comply with these Terms.
          </p>
        </div>
      </div>

      {/* Mobile-specific decorative elements */}
      <div className="absolute inset-0 opacity-5 md:hidden">
        <div className="absolute top-8 left-4 w-8 h-8 bg-orange-300 rounded"></div>
        <div className="absolute top-16 right-6 w-10 h-6 bg-orange-200 rounded"></div>
        <div className="absolute bottom-12 left-8 w-6 h-10 bg-orange-300 rounded"></div>
        <div className="absolute bottom-20 right-4 w-8 h-8 bg-orange-200 rounded"></div>
      </div>
    </section>
  )
}

export default TermsOfServiceHeader