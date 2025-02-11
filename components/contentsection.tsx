import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Eye } from "lucide-react"

const contentSectionData = {
  title: "Revolutionizing Healthcare through AI-Driven Genomics",
  description:
    "At Genomic Valley Biotech Limited, we integrate cutting-edge AI, Next-Generation Sequencing (NGS), and years of expertise to advance oncology research and diagnostics. Join us on our journey to deliver confident, precise, and transformative healthcare solutions worldwide.",
  image: {
    src: "/c12.png",
    alt: "Researchers analyzing genomic data"
  },
  cards: [
    {
      icon: Sparkles,
      title: "Our Mission",
      description:
        "To pioneer rapid, precise genomic solutions for global healthcare, ensuring confident diagnostics and better outcomes through continuous innovation."
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To build India’s global genomics hub, advancing AI-driven healthcare and transforming diagnostics, research, and treatment for all."
    }
  ],
  cta: {
    text: "Learn More",
    href: "/services"
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

