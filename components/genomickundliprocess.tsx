"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

const processSteps = {
  sampleCollection: [
    {
      step: "Step 1",
      title: "Order Your Genomic Kundli Kit",
      description:
        "Just like ordering your favorite product online! Get your personalized health discovery kit delivered to your doorstep. Perfect as a gift for your loved ones or as a proactive step towards better health for your family."
    },
    {
      step: "Step 2", 
      title: "Simple Sample Collection at Home",
      description:
        "No needles, no hospital visits! Simply collect your saliva in the comfort of your home - as easy as brushing your teeth. Our kit comes with everything you need and step-by-step instructions that anyone can follow."
    }
  ],
  analysisAndReport: [
    {
      step: "Step 3",
      title: "Your Health Story Gets Decoded",
      description:
        "Our experts analyze your genetic information to understand your unique health blueprint. Think of it as creating your personal health horoscope that reveals what your body needs to stay healthy and strong."
    },
    {
      step: "Step 4",
      title: "Your Personal Health Guide",
      description:
        "Receive your comprehensive health report with easy-to-understand insights about your body's needs, disease risks, and personalized recommendations for diet, exercise, and lifestyle - your complete roadmap to a healthier life."
    }
  ]
}

export default function GenomicKundliProcess() {
  const [expandedSampleCard, setExpandedSampleCard] = useState<number | null>(null)
  const [expandedAnalysisCard, setExpandedAnalysisCard] = useState<number | null>(null)

  const toggleSampleCard = (index: number) => {
    setExpandedSampleCard(expandedSampleCard === index ? null : index)
  }

  const toggleAnalysisCard = (index: number) => {
    setExpandedAnalysisCard(expandedAnalysisCard === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-8 text-center">
        Your Health Discovery Journey
      </h2>

      {/* Sample Collection Process */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-purple-500 mb-4">
          Easy Home Collection Process
        </h3>
        <div className="space-y-4">
          {processSteps.sampleCollection.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer flex flex-row items-center"
                  onClick={() => toggleSampleCard(index)}
                >
                  <div className="flex-1">
                    <CardTitle className="text-xl text-purple-700">
                      {step.step}: {step.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedSampleCard === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <AnimatePresence>
                  {expandedSampleCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent>
                        <p className="text-lg text-gray-700 leading-relaxed font-medium">{step.description}</p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analysis and Reporting Process */}
      <div>
        <h3 className="text-2xl font-semibold text-purple-500 mb-4">
          Your Personal Health Report Creation
        </h3>
        <div className="space-y-4">
          {processSteps.analysisAndReport.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer flex flex-row items-center"
                  onClick={() => toggleAnalysisCard(index)}
                >
                  <div className="flex-1">
                    <CardTitle className="text-xl text-purple-700">
                      {step.step}: {step.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedAnalysisCard === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <AnimatePresence>
                  {expandedAnalysisCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent>
                        <p className="text-lg text-gray-700 leading-relaxed font-medium">{step.description}</p>
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
  )
} 