import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Calendar, Phone, Book } from 'lucide-react'

export const counselorData = {
  title: "Genetic Counseling",
  image: {
    src: "/genetic-counselling.jpg",
    alt: "Genetic Counseling"
  },
  cards: [
    {
      icon: Calendar,
      title: "Clinical Expertise",
      description:
        "Experience in Clinical Genomics & Genetics, specializing in screening, analysis, and reporting."
    },
    {
      icon: Mail,
      title: "Personalized Guidance",
      description:
        "Tailored genetic counseling for individuals, families, and healthcare providers—enabling informed decisions."
    },
    {
      icon: Phone,
      title: "Supportive Care",
      description:
        "Compassionate counseling to help navigate psychosocial and medical aspects of genetic conditions."
    },
    {
      icon: Book, 
      title: "Holistic Approach",
      description:
        "Integrating cutting-edge research into actionable strategies for both rare and common hereditary diseases."
    }
  ],  
  cta: {
    text: "Book Consultation",
    href: "https://pages.razorpay.com/genetic-counseling"
  }
}

export function MeetGeneticCounselor() {
  return (
    <div className="bg-purple-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">
          {counselorData.title}
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Image Section with Button */}
          <div className="w-full md:w-5/12 space-y-6">
            <Image
              src={counselorData.image.src}
              alt={counselorData.image.alt}
              width={500}
              height={600}
              className="rounded-lg object-cover w-full h-[600px] shadow-lg"
              priority
            />
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              <Link href={counselorData.cta.href}>
                {counselorData.cta.text}
              </Link>
            </Button>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-6/12 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {counselorData.cards.map((card, index) => (
                <Card key={index} className="border-purple-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 space-y-4">
                    <span className="inline-block rounded-full bg-purple-600 text-white p-3">
                      <card.icon className="w-6 h-6" />
                    </span>
                    <h3 className="font-semibold text-xl text-purple-600">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

