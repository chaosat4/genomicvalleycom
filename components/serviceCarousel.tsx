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
    <div className="container mx-auto"> 
        <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-4xl px-20 text-center mb-10">We offer a comprehensive coverage of more than 80+ medical tests with reliable results</p>
    </div>
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto pt-12 pb-32"
    >
      <CarouselContent>
        {services.map((service, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <div className="p-1">
              <Card className="border-none shadow-md">
                <CardContent className="p-6 border-t-4 border-purple-500">
                  {service.icon}
                  <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="border-purple-600 text-purple-600 hover:bg-purple-300" />
      <CarouselNext className="border-purple-600 text-purple-600 hover:bg-purple-300" />
    </Carousel>
    </>
  )
}