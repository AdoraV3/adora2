"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const SupportAreasSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const supportAreas = [
    {
      title: "Inquiries and FAQs",
      description:
        "Adora Responds to product, service, or policy-related questions like warranties, return policies, or how to use a product.",
    },
    {
      title: "Appointment Scheduling",
      description: "Books appointments during calls in real time, ensuring no opportunity is missed.",
    },
    {
      title: "Returns, Refunds, and Complaints",
      description:
        "Processes product returns, handles refund requests, and manages customer dissatisfaction like addressing complaints about defective products or delayed deliveries.",
    },
    {
      title: "Automated Ticket Handling",
      description:
        "Automatically create or update tickets in your CRM, route the case to the appropriate team (collections, service team, billing, or finance), Triggers automatic follow-up emails or texts after an interaction, Sends reminders to agents for unresolved tickets or pending customer inquiries.",
    },
    {
      title: "Customer Account Management",
      description:
        "Adora Manages customer accounts, including updating customer profile subscriptions, and service upgrades or downgrades.",
    },
    {
      title: "Technical Support",
      description:
        "Assists customers with troubleshooting products or service-related technical issues like resolving software malfunctions or configuration issues.",
    },
    {
      title: "Customer Retention and Loyalty",
      description:
        "Handles subscription cancellation calls and offering incentives or loyalty rewards and discounts to retain customers considering cancelling a service",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-gray-900 text-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            We specialize in these customer support areas
          </h2>
          <p className="text-lg sm:text-xl text-orange-500 max-w-3xl mx-auto">
            We provide expert support tailored to your customers
          </p>
        </motion.div>

        {/* Support Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {supportAreas.map((area, index) => (
            <motion.div
              key={index}
              className="space-y-4 group hover:transform hover:scale-[1.02] transition-all duration-200"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              {/* Icon and Title */}
              <div className="flex items-start gap-4">
                <motion.div
                  className="flex-shrink-0 mt-1"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">{area.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{area.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SupportAreasSection
