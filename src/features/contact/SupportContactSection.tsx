'use client'
 
 import { Zap, User, Phone, MessageCircle } from 'lucide-react'

export default function SupportContactSection() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-35">
        <div className="grid grid-cols-12 sm:grid-cols-16 md:grid-cols-20 lg:grid-cols-24 xl:grid-cols-28 gap-px h-full">
          {Array.from({ length: 504 }).map((_, i) => (
            <div
              key={i}
              className={`border border-gray-200 ${
                // Random peach/orange squares to match the pattern
                [23, 45, 67, 89, 134, 156, 178, 234, 267, 298, 312, 356, 389, 412, 445, 467, 489].includes(i)
                  ? 'bg-orange-200'
                  : 'bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <p className="text-lg sm:text-xl text-orange-500 font-medium mb-4">
                  Get in Touch with Adora3 Support Team
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
                  Here To Give You The Supports You Need
                </h1>
              </div>
            </div>

            {/* Right Side - Support Hub Visualization */}
            <div className="relative flex justify-center items-center">
              {/* Central Support Hub */}
              <div className="relative">
                {/* Main Circle */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                  <MessageCircle className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                </div>

                {/* Outer Ring */}
                <div className="absolute inset-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-2 border-orange-300 rounded-full opacity-30 scale-125"></div>
                <div className="absolute inset-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border border-orange-200 rounded-full opacity-20 scale-150"></div>

                {/* Floating Support Icons */}
                {/* Lightning Icon - Top Right */}
                <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* User Icon - Top Right Corner */}
                <div className="absolute -top-8 right-12 sm:right-16 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                {/* Phone Icon - Left */}
                <div className="absolute top-1/2 -left-8 sm:-left-12 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Support Message Bubble */}
                <div className="absolute -bottom-4 -right-8 sm:-right-12 bg-orange-100 px-4 py-2 rounded-2xl shadow-lg animate-float">
                  <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    We're Here to help
                  </p>
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-orange-100 transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}