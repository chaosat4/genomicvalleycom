"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Dna, Heart, Brain, Users, Baby, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const genomicKundliData = {
  title: "Your Personal Health Horoscope for Life",
  subtitle: "Discover Your Body's Unique Needs & Protect Your Family's Health",
  image: {
    src: "/genomic-kundli-kit.jpg",
    alt: "Genomic Kundli - Your Personal Health Guide"
  },
  cards: [
    {
      icon: Heart,
      title: "Proactive Health Checkup",
      description:
        "Know your health risks before they become problems. Just like getting regular checkups, but this one reveals what your body needs for lifelong wellness."
    },
    {
      icon: Users,
      title: "Perfect for Kundli Milan",
      description:
        "Before marriage, check genetic compatibility and understand potential health considerations for your future family. A modern approach to traditional kundli matching."
    },
    {
      icon: Baby,
      title: "Newborn Health Blueprint",
      description:
        "Give your newborn the best start in life. Understand their genetic predispositions and create a personalized health plan from day one."
    },
    {
      icon: Shield,
      title: "Family Health Protection",
      description:
        "Protect your entire family with personalized health insights. The perfect gift for parents, siblings, and loved ones who care about their health."
    }
  ],
  benefits: [
    "Perfect gift for health-conscious family members",
    "Essential for couples planning marriage and family",
    "Ideal for new parents and expecting couples",
    "Better than regular health checkups - reveals hidden risks",
    "Complete privacy - do it from home comfort",
    "Helps doctors give you better treatment",
    "Data stored in our on-site servers with end-to-end encryption"
  ],
  cta: {
    text: "Get Your Health Horoscope Now",
    href: "https://rzp.io/rzp/genomic-kundli"
  }
}

export function AboutGenomicKundli() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  return (
    <div className="bg-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">
            {genomicKundliData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {genomicKundliData.subtitle}
          </p>
        </div>
        
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
              className="bg-purple-600 hover:bg-purple-700 text-white w-full text-lg py-6"
            >
              <Link href={genomicKundliData.cta.href}>
                {genomicKundliData.cta.text}
              </Link>
            </Button>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-6/12 space-y-6">
            <div className="prose text-gray-700 mb-6">
              <p className="text-lg leading-relaxed">
                Your Genomic Kundli is like a personal health horoscope that reveals your body's unique story. 
                Just as traditional kundli guides life decisions, your genetic kundli guides your health journey - 
                helping you prevent diseases, choose the right diet, and live your healthiest life.
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
                <h3 className="text-xl font-bold text-purple-600 mb-4">Perfect For:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {genomicKundliData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-base text-gray-700">• {benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Collapsible Cards - Single Column */}
            <div className="space-y-4">
              {genomicKundliData.cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-purple-200 hover:shadow-lg transition-shadow duration-300">
                    <div
                      className="cursor-pointer flex items-center justify-between p-4"
                      onClick={() => toggleCard(index)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="inline-block rounded-full bg-purple-600 text-white p-2">
                          <card.icon className="w-5 h-5" />
                        </span>
                        <h3 className="font-semibold text-lg text-purple-600">
                          {card.title}
                        </h3>
                      </div>
                      <Button variant="ghost" size="sm">
                        {expandedCard === index ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {expandedCard === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0 pb-4 px-4">
                            <p className="text-gray-600 leading-relaxed ml-12">
                              {card.description}
                            </p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 