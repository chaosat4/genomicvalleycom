import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Microscope, UserSquare2, Binary, Briefcase, ChevronRight } from 'lucide-react'
import Link from "next/link"

export function ServiceCarousel() {
  const services = [
    {
      icon: <Microscope className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Disease Identification/Screening",
      description: "Comprehensive screening of genetic diseases using advanced diagnostic techniques."
    },
    {
      icon: <UserSquare2 className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Genetic Consultation",
      description: "Expert guidance and consultation for understanding genetic test results and implications."
    },
    {
      icon: <Binary className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Next Gen Sequencing Services",
      description: "State-of-the-art DNA sequencing using latest next-generation technologies."
    },
    {
      icon: <Briefcase className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Extramural R&D Support",
      description: "Comprehensive research and development support for external projects and collaborations."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Our Services</h2>
      <p className="text-gray-600 text-xl md:text-3xl lg:text-4xl px-4 md:px-12 lg:px-20 text-center mb-6 md:mb-10">
        We offer a comprehensive coverage of more than 80+ medical tests with reliable results
      </p>
      
      <div className="flex justify-center mb-8">
        <Link href="/services">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
            Explore Services
            <ChevronRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="h-full">
            <Card className="border-none shadow-md hover:bg-accent h-full flex flex-col">
              <CardContent className="flex flex-col h-full p-4 md:p-6 border-t-4 border-purple-500">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg md:text-xl font-medium mb-2 flex-none text-center">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 flex-grow text-center">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}