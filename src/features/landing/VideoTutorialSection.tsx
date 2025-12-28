"use client"

import { Play, Youtube } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const VideoTutorialSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-16 lg:py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Easy Account Setup in Minutes
          </h2>
          <p className="text-lg sm:text-xl text-orange-600 max-w-4xl mx-auto">
            We&apos;ll guide you through every click, so you&apos;re ready to go in no time.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-2xl aspect-video">
            {/* Video Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/20 to-transparent p-6 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-gray-700 font-medium text-lg">How to setup an account</span>
              </div>
            </div>

            {/* Video Content Area */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              {/* Play Button */}
              <motion.button className="group relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                {/* YouTube-style play button */}
                <motion.div
                  className="w-20 h-14 sm:w-24 sm:h-16 lg:w-28 lg:h-20 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center transition-all duration-200 shadow-2xl"
                  animate={{
                    boxShadow: [
                      "0 20px 60px rgba(220, 38, 38, 0.4)",
                      "0 20px 80px rgba(220, 38, 38, 0.6)",
                      "0 20px 60px rgba(220, 38, 38, 0.4)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Play size={32} className="text-white ml-1 fill-current" />
                </motion.div>
              </motion.button>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Watch on YouTube badge */}
                  <div className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer">
                    <Youtube size={16} />
                    <span>Watch on YouTube</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Tutorial Video</span>
                </div>
              </div>
            </div>

            {/* Video Progress Bar */}
            <div className="absolute bottom-16 left-4 right-4">
              <div className="w-full bg-gray-600 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full w-1/4 transition-all duration-300"></div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-8 w-4 h-4 bg-orange-300 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute top-1/3 right-12 w-3 h-3 bg-orange-400 rounded-full opacity-40 animate-pulse delay-500"></div>
            <div className="absolute bottom-1/4 left-16 w-2 h-2 bg-orange-500 rounded-full opacity-50 animate-pulse delay-1000"></div>
          </div>

          {/* Video Caption */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-600 text-sm sm:text-base">
              Watch our step-by-step guide to get your AI assistant up and running quickly
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default VideoTutorialSection
