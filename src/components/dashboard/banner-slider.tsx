/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { ArrowRight, Phone, Zap, Users, BarChart3 } from 'lucide-react'

export function BannerSlider() {
  const banners = [
    {
      id: 1,
      title: "AI-Powered Calling Automation",
      subtitle: "Transform your business communication with intelligent voice agents",
      description: "Automate customer calls, lead qualification, and support with cutting-edge AI technology",
      icon: Phone,
      gradient: "from-blue-600 to-cyan-500",
      image: "/ai1.jpg",
    },
    {
      id: 2,
      title: "Boost Efficiency & Scale Fast",
      subtitle: "Handle thousands of calls simultaneously",
      description: "Reduce response time and increase productivity with our scalable AI platform",
      icon: Zap,
      gradient: "from-[#CC5500] to-[#993F00]",
      image: "/ai2.jpg",
    },
    {
      id: 3,
      title: "Smart Agent Management",
      subtitle: "Create and manage AI agents effortlessly",
      description: "Configure custom agents with your business logic and let them work 24/7",
      icon: Users,
      gradient: "from-blue-600 to-cyan-500",
      image: "/ai3.jpg",
    },
    // {
    //   id: 4,
    //   title: "Real-Time Analytics & Insights",
    //   subtitle: "Monitor performance with detailed metrics",
    //   description: "Track call outcomes, agent performance, and ROI with comprehensive analytics",
    //   icon: BarChart3,
    //   gradient: "from-[#CC5500] to-[#993F00]",
    //   image: "/ai4.jpg",
    // },
  ]

  const [current, setCurrent] = useState(0)
  const [api, setApi] = useState<any>()   // ⬅ added

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Sync current slide with carousel API
  useEffect(() => {
    if (api) {
      api.scrollTo(current)
    }
  }, [current, api])

  return (
    <div className="w-full mb-6">
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>   {/* ⬅ added setApi */}
        <CarouselContent>
          {banners.map((banner) => {
            const Icon = banner.icon
            return (
              <CarouselItem key={banner.id}>
                <div className={`bg-gradient-to-r ${banner.gradient} rounded-xl overflow-hidden shadow-lg`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-[240px] items-center">

                    {/* Left content */}
                    <div className="flex flex-col justify-center gap-3 text-white z-10">
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6" strokeWidth={2.5} />
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Featured</span>
                      </div>

                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
                        <p className="text-sm md:text-base opacity-95 mb-2">{banner.subtitle}</p>
                        <p className="text-xs md:text-sm opacity-85 hidden md:block">{banner.description}</p>
                      </div>
                    </div>

                    {/* Right image */}
                    <div className="hidden md:flex justify-end items-center">
                      <img
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title}
                        className="w-full h-[100%] rounded-lg shadow-lg object-cover max-h-[300px]"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute left-2 md:left-4" />
        <CarouselNext className="absolute right-2 md:right-4" /> */}
      </Carousel>

      {/* Indicator dots */}
      {/* <div className="flex justify-center gap-2 mt-4">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              idx === current ? "bg-gray-600" : "bg-gray-300"
            } cursor-pointer`}
          />
        ))}
      </div> */}
    </div>
  )
}
