'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: { 
  question: string
  answer?: string
  isOpen: boolean
  onToggle: () => void 
}) => (
  <div className="border-b border-gray-200 py-6">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left group"
    >
      <h3 className="text-lg sm:text-xl font-medium text-orange-500 pr-4 group-hover:text-orange-600 transition-colors">
        {question}
      </h3>
      <div className="flex-shrink-0">
        {isOpen ? (
          <Minus className="w-6 h-6 text-gray-600" />
        ) : (
          <Plus className="w-6 h-6 text-gray-600" />
        )}
      </div>
    </button>
    
    {isOpen && answer && (
      <div className="mt-4 pr-8">
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          {answer}
        </p>
      </div>
    )}
  </div>
)

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]) // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqItems = [
    {
      question: "Can I cancel my subscription at any time?",
      answer: "We offer flexible subscription options, allowing you to adjust or cancel your plan as per your business requirements, with transparent and simple cancellation policies."
    },
    {
      question: "Can this solution be customized to suit my business's specific needs?",
      answer: ""
    },
    {
      question: "Is it possible for Adora call to manage multiple branches?",
      answer: ""
    },
    {
      question: "Is there any setup fee involved?",
      answer: ""
    },
    {
      question: "Can I change my plan anytime",
      answer: ""
    }
  ]

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side - Header */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-orange-500 leading-relaxed">
                We&apos;re here to help with any questions you have about plans, pricing, and supported features
              </p>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="lg:col-span-7">
            <div className="space-y-2">
              {/* General Section Header */}
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                  General
                </h3>
              </div>

              {/* FAQ Items */}
              <div className="space-y-0">
                {faqItems.map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItems.includes(index)}
                    onToggle={() => toggleItem(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}