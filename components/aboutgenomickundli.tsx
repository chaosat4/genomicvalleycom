import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Dna, Heart, Brain } from 'lucide-react'

export const genomicKundliData = {
  title: "Your Complete Genetic Profile for Wellbeing",
  image: {
    src: "/genomic-kundli-kit.jpg",
    alt: "Genomic Kundli Testing"
  },
  cards: [
    {
      icon: Dna,
      title: "Genetic Blueprint Decoding",
      description:
        "Advanced software meticulously analyzes your DNA to reveal the most impactful genetic insights for your health and wellbeing."
    },
    {
      icon: Shield,
      title: "Privacy-First Approach", 
      description:
        "We remove all personal identifiers, ensuring only essential, actionable genetic information reaches you while maintaining complete privacy."
    },
    {
      icon: Heart,
      title: "Comprehensive Wellbeing Profile",
      description:
        "Complete genetic testing for wellness at home, creating a personalized profile that guides your health journey."
    },
    {
      icon: Brain,
      title: "Precision Healthcare Insights",
      description:
        "Empowering healthcare professionals to make precise, informed decisions based on your unique genetic makeup and health predispositions."
    }
  ],  
  cta: {
    text: "Get Your Genomic Kundli",
    href: "/contact"
  }
}

export function AboutGenomicKundli() {
  return (
    <div className="bg-purple-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-purple-600 text-center mb-12">
          {genomicKundliData.title}
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Image Section with Button */}
          <div className="w-full md:w-5/12 space-y-6">
            <Image
              src={genomicKundliData.image.src}
              alt={genomicKundliData.image.alt}
              width={500}
              height={600}
              className="rounded-lg object-cover w-full h-[600px] shadow-lg"
              priority
            />
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              <Link href={genomicKundliData.cta.href}>
                {genomicKundliData.cta.text}
              </Link>
            </Button>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-6/12 space-y-8">
            <div className="prose text-gray-700 mb-8">
              <p className="text-lg">
                Your genomic kundli is more than just a test—it's a comprehensive window into your genetic wellbeing. 
                By removing all personal identifiers, we ensure that only the essential, actionable genetic information 
                reaches you, empowering healthcare professionals to make precise, informed decisions.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {genomicKundliData.cards.map((card, index) => (
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