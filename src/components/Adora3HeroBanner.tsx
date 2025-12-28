import Link from "next/link";

export default function Adora3HeroBanner() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-tight">
              Let Adora3 Take the Calls,
              <br className="hidden sm:block" />
              <span className="block mt-1 sm:mt-2">While You Take the Lead.</span>
            </h1>
          </div>
          {/* CTA Button */}
          <Link href={'/signup'} className="flex-shrink-0">
            <button className="bg-orange-700 hover:bg-orange-800 text-white font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg lg:text-xl transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 whitespace-nowrap">
              Get Started For Free Now!
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}