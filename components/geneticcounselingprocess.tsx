"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

// Separate out Pre-test vs. Post-test
const serviceDetails = {
  preTestProcess: [
    {
      step: "Step 1",
      title: "Initial Consultation",
      description:
        "We ensure informed consent, comfort, and thorough family histories (including both partners). This helps define goals and assess risk before testing."
    },
    {
      step: "Step 2",
      title: "Genetic Testing",
      description:
        "Provide a sample for lab analysis. Tests are tailored to your medical history, including a pedigree chart for comprehensive insights."
    }
  ],
  postTestProcess: [
    {
      step: "Step 3",
      title: "Genetic Counseling",
      description:
        "Review results, discuss implications, and plan next steps. We keep sessions manageable (5–6 per day) to give each individual focused attention."
    },
    {
      step: "Step 4",
      title: "Genetic Report",
      description:
        "Receive a clear, detailed report with risks and recommendations. Our counselor addresses all questions to ensure you feel supported moving forward."
    }
  ]
}

export default function GeneticCounselingProcess() {
  // You can keep a single state for currently expanded card if you’d like,
  // but for clarity, we’ll use separate states for pre- and post-test cards.
  const [expandedPreCard, setExpandedPreCard] = useState<number | null>(null)
  const [expandedPostCard, setExpandedPostCard] = useState<number | null>(null)

  const togglePreCard = (index: number) => {
    setExpandedPreCard(expandedPreCard === index ? null : index)
  }

  const togglePostCard = (index: number) => {
    setExpandedPostCard(expandedPostCard === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-8 text-center">
        Our Genetic Counseling Process
      </h2>

      {/* Pre-test Genetic Counseling */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-purple-500 mb-4">
          Pre-test Genetic Counseling
        </h3>
        <div className="space-y-4">
          {serviceDetails.preTestProcess.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer flex flex-row items-center"
                  onClick={() => togglePreCard(index)}
                >
                  <div className="flex-1">
                    <CardTitle className="text-xl text-purple-700">
                      {step.step}: {step.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedPreCard === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <AnimatePresence>
                  {expandedPreCard === index && (
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

      {/* Post-test Genetic Counseling */}
      <div>
        <h3 className="text-2xl font-semibold text-purple-500 mb-4">
          Post-test Genetic Counseling
        </h3>
        <div className="space-y-4">
          {serviceDetails.postTestProcess.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer flex flex-row items-center"
                  onClick={() => togglePostCard(index)}
                >
                  <div className="flex-1">
                    <CardTitle className="text-xl text-purple-700">
                      {step.step}: {step.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedPostCard === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <AnimatePresence>
                  {expandedPostCard === index && (
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
