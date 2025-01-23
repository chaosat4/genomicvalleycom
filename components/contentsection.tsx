import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Eye } from "lucide-react"

const contentSectionData = {
    title: "We help drive your business forward faster",
    description: "Our innovative solutions and expert team work tirelessly to accelerate your business growth. We combine cutting-edge technology with strategic insights to propel your company to new heights.",
    image: {
      src: "/c4.png",
      alt: "working on housing"
    },
    cards: [
      {
        icon: Sparkles,
        title: "Our mission",
        description: "To empower businesses with innovative solutions that drive growth and success in the digital age."
      },
      {
        icon: Eye,
        title: "Our vision",
        description: "To be the catalyst for transformative change in businesses worldwide, setting new standards for innovation and excellence."
      }
    ],
    cta: {
      text: "Learn More",
      href: "/about"
    }
  }

const ContentSection = () => {
  return (
    <section className="py-24 bg-purple-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-5 flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex lg:w-1/2 lg:h-[600px]">
          <div className="relative w-full h-full rounded-2xl overflow-hidden group">
            <Image 
              src={contentSectionData.image.src}
              alt={contentSectionData.image.alt}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        </div>
        <div className="lg:w-1/2 space-y-8 text-gray-700 dark:text-gray-300">
          <h1 className="text-purple-700 font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
            {contentSectionData.title}
          </h1>
          <p className="text-lg">
            {contentSectionData.description}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {contentSectionData.cards.map((card, index) => (
              <Card key={index} className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-6 space-y-4">
                  <span className="inline-block rounded-full bg-purple-600 text-white p-3">
                    <card.icon className="w-6 h-6" />
                  </span>
                  <h2 className="font-semibold text-xl text-purple-700 dark:text-purple-300">{card.title}</h2>
                  <p>{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href={contentSectionData.cta.href}>{contentSectionData.cta.text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ContentSection

