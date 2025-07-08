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
        "Request your at-home genetic testing kit through our secure platform. We'll send you everything needed for safe and easy sample collection in the comfort of your home."
    },
    {
      step: "Step 2", 
      title: "Collect Your Sample",
      description:
        "Follow the simple instructions to collect your saliva or cheek swab sample. Our kit includes detailed guidance and all necessary materials for a hassle-free collection process."
    }
  ],
  analysisAndReport: [
    {
      step: "Step 3",
      title: "Advanced Genetic Analysis",
      description:
        "Our cutting-edge laboratory processes your sample using state-of-the-art genomic sequencing technology. We analyze your genetic markers while maintaining strict privacy protocols."
    },
    {
      step: "Step 4",
      title: "Personalized Genomic Kundli Report",
      description:
        "Receive your comprehensive genetic wellbeing profile with actionable insights. Our report includes health predispositions, wellness recommendations, and guidance for informed healthcare decisions."
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
        Your Genomic Kundli Journey
      </h2>

      {/* Sample Collection Process */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-purple-500 mb-4">
          Sample Collection & Submission
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
                        <CardDescription>{step.description}</CardDescription>
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
          Analysis & Genomic Kundli Report
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
                        <CardDescription>{step.description}</CardDescription>
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