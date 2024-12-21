import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Dna, FlaskConical, Database, Network } from 'lucide-react' // Import relevant icons

export function ServiceCarousel() {
  const services = [
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "DNA Sequencing",
      description: "Next-generation sequencing solutions with high throughput and accuracy."
    },
    {
      icon: <FlaskConical className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Lab Services",
      description: "Comprehensive laboratory services for genomic research and analysis."
    },
    {
      icon: <Database className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Data Storage",
      description: "Secure cloud-based storage solutions for your genomic data."
    },
    {
      icon: <Network className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Network Analysis",
      description: "Advanced tools for analyzing genetic networks and pathways."
    }
  ]

  return (
    <>
    <div className="container mx-auto mt-8 md:mt-16 px-4 md:px-6"> 
        <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-xl md:text-3xl lg:text-4xl px-4 md:px-12 lg:px-20 text-center mb-6 md:mb-10">
          We offer a comprehensive coverage of more than 80+ medical tests with reliable results
        </p>
    </div>
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-32"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {services.map((service, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
            <div className="p-1">
              <Card className="border-none shadow-md hover:bg-accent h-full">
                <CardContent className="p-4 md:p-6 border-t-4 border-purple-500">
                  {service.icon}
                  <h3 className="text-lg md:text-xl font-medium mb-2">{service.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex border-purple-600 text-purple-600 hover:bg-purple-300" />
      <CarouselNext className="hidden md:flex border-purple-600 text-purple-600 hover:bg-purple-300" />
    </Carousel>
    </>
  )
}