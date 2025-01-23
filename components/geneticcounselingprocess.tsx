'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

const serviceDetails = {
  process: [
    { 
      step: "Step 1", 
      title: "Initial Consultation",
      description: "Meet with our genetic counselor to discuss your medical history, family history, and the goals of genetic testing. We'll assess the risk factors and explain the potential outcomes of testing."
    },
    { 
      step: "Step 2", 
      title: "Genetic Testing",
      description: "Provide a sample (blood, saliva, or other) for laboratory analysis. This step includes selecting the appropriate genetic tests tailored to your personal and family health history." 
    },
    { 
      step: "Step 3", 
      title: "Genetic Counseling",
      description: "Once the test results are available, our counselor will guide you through the findings, explain the implications, and discuss potential next steps. This includes understanding inheritance patterns and preventive measures." 
    },
    { 
      step: "Step 4", 
      title: "Genetic Report",
      description: "Receive a detailed and easy-to-understand genetic report that summarizes the test results, risks, and recommended actions. Our counselor will ensure all your questions are answered." 
    }
  ]
};

export default function GeneticCounselingProcess() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-5xl font-semibold text-purple-600 mb-8 text-center">Our Genetic Counseling Process</h2>
      <div className="space-y-4">
        {serviceDetails.process.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader 
                className="cursor-pointer flex flex-row items-center"
                onClick={() => toggleCard(index)}
              >
                <div className="flex-1">
                  <CardTitle className="text-xl text-purple-700">
                    {step.step}: {step.title}
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  {expandedCard === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <AnimatePresence>
                {expandedCard === index && (
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
  )
}

