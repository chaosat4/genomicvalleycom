"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const timelineData = [
  {
    year: 2011,
    image: "/placeholder.svg",
    title: "The Beginning",
    description:
      "Founded in a small office at the University of Waterloo, our journey began with a vision to revolutionize video platforms for businesses.",
  },
  {
    year: 2013,
    image: "/placeholder.svg",
    title: "Y Combinator Graduate",
    description:
      "Successfully graduated from Y Combinator, securing initial funding and valuable mentorship that would shape our future growth.",
  },
  {
    year: 2015,
    image: "/placeholder.svg",
    title: "Global Expansion",
    description:
      "Expanded operations globally, opening new offices and building partnerships with industry leaders worldwide.",
  },
  {
    year: 2018,
    image: "/placeholder.svg",
    title: "Platform Evolution",
    description:
      "Launched revolutionary new features and integrations, establishing ourselves as a leading video business platform.",
  },
  {
    year: 2021,
    image: "/placeholder.svg",
    title: "Industry Leadership",
    description:
      "Recognized as an industry leader, serving thousands of businesses and processing millions of videos daily.",
  },
]

export default function Timeline() {
  // Instead of storing the 'year', we store the 'index' of the active item
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Grab the currently active timeline item
  const activeTimelineItem = timelineData[activeIndex]

  // Auto-rotation effect: go to the next timeline item every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger animation
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)

      setActiveIndex((prevIndex) => (prevIndex + 1) % timelineData.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle manual clicks (which also trigger the fade/slide animation)
  const handleYearClick = (index: number) => {
    if (index !== activeIndex) {
      setIsAnimating(true)
      setActiveIndex(index)

      // Re-trigger fade/slide animation
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center text-purple-700 mb-16">
          Our Journey
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Timeline Buttons */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
            {timelineData.map((item, i) => (
              <Button
                key={item.year}
                variant="outline"
                className={cn(
                  "min-w-[100px] border-2 transition-transform duration-300 ease-in-out hover:scale-105",
                  activeIndex === i
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "hover:border-purple-300 hover:bg-purple-50"
                )}
                onClick={() => handleYearClick(i)}
              >
                {item.year}
              </Button>
            ))}
          </div>

          {/* Content Display */}
          {activeTimelineItem && (
            <Card
              className={cn(
                "flex-1 border-none shadow-xl transform transition-all duration-300",
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              )}
            >
              <CardContent className="p-0">
                <div className="relative w-full h-[300px] sm:h-[400px] rounded-t-lg overflow-hidden">
                  <Image
                    src={activeTimelineItem.image}
                    alt={activeTimelineItem.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                  />
                </div>
                <div className="p-6 bg-white rounded-b-lg">
                  <h3 className="text-2xl font-semibold text-purple-700 mb-4">
                    {activeTimelineItem.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {activeTimelineItem.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
