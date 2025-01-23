import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Calendar, Phone } from 'lucide-react'

export const counselorData = {
  title: "Meet Our Genetic Counselor",
  counselor: {
    name: "Dr. Uzma Shamim",
    role: "Geneticist/Consultant/Genetic Counselor",
    image: {
      src: "/placeholder.svg",
      alt: "Dr. Uzma Shamim"
    },
    description: "Over 8 years of experience in Clinical Genomics and Genetics, particularly in the realm of Rare Diseases. I have led comprehensive genetic screening and research programs, significantly contributing to the scientific understanding of complex genomic questions.",
  },
  cards: [
    {
      icon: Calendar,
      title: "Clinical Expertise",
      description: "With expertise in Genetic Analysis, Clinical Interpretation, and Genetic Reporting, I bring precision to the application of genomics in clinical practice."
    },
    {
      icon: Mail,
      title: "Personalized Guidance",
      description: "As a Genetic Counselor and Geneticist, I specialize in providing personalized genetic guidance and insights to individuals, families, and healthcare providers."
    },
    {
      icon: Phone,
      title: "Supportive Care",
      description: "Through compassionate counseling, I assist patients in navigating the psychosocial and medical implications of genetic conditions."
    },
    {
        icon: Phone,
        title: "Supportive Care",
        description: "Through compassionate counseling, I assist patients in navigating the psychosocial and medical implications of genetic conditions."
      }
  ],
  cta: {
    text: "Book Consultation",
    href: "/book"
  }
}




export default function CounselorProfile() {
  return (
    <section className="py-24 bg-purple-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5">
        <h1 className="text-purple-600 font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-16">
          {counselorData.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex lg:w-1/2 lg:h-[600px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden group">
              <Image 
                src={counselorData.counselor.image.src}
                alt={counselorData.counselor.image.alt}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>

          <div className="lg:w-1/2 space-y-8 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-purple-600 font-bold text-3xl mb-2">
                {counselorData.counselor.name}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {counselorData.counselor.role}
              </p>
              <p className="text-lg">
                {counselorData.counselor.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {counselorData.cards.map((card, index) => (
                <Card key={index} className="border-purple-200 dark:border-purple-800">
                  <CardContent className="p-6 space-y-4">
                    <span className="inline-block rounded-full bg-purple-600 text-white p-3">
                      <card.icon className="w-6 h-6" />
                    </span>
                    <h3 className="font-semibold text-xl text-purple-600 dark:text-purple-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
              <Link href={counselorData.cta.href}>
                {counselorData.cta.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

