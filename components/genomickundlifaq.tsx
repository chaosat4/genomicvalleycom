"use client"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const GENOMIC_KUNDLI_FAQ_CONSTANTS = {
  title: "Frequently Asked Questions",
  subtitle: "Learn more about your personalized genomic kundli and genetic wellbeing profile",
  questions: [
    {
      category: "Genomic Kundli Basics",
      question: "What is a Genomic Kundli?",
      answer: `A Genomic Kundli is your personal health horoscope that reveals what your genes say about your health. Just like a traditional kundali guides life decisions, your genomic kundli helps you make informed health choices.

We analyze your DNA to provide insights about disease risks, nutrition needs, and wellness recommendations. This helps you take proactive steps for better health and guides your doctor in providing personalized treatment.`,
    },
    {
      category: "Privacy & Security",
      question: "How is my data protected and where is it stored?",
      answer: `Your genetic data is stored on our highly secured servers with bank-level encryption and multiple security layers. We remove all personal identifiers from your genetic information during analysis, ensuring complete privacy.

Your data is never shared with third parties and you maintain full control over your genomic kundli report. Our laboratory follows international privacy standards and strict confidentiality protocols.`,
    },
    {
      category: "Testing Process",
      question: "How do I collect my sample for the Genomic Kundli?",
      answer: `Sample collection is simple and done at home with no needles required. We send you a kit with detailed instructions and all necessary materials.

You simply collect a saliva sample or cheek swab following our step-by-step guide. Once collected, send the sample back to our laboratory using the provided secure shipping materials. The entire process takes just a few minutes.`,
    },
    {
      category: "Results & Reports",
      question: "What information will my Genomic Kundli report contain?",
      answer: `Your report includes health predisposition analysis, personalized diet and exercise recommendations, medication response indicators, and carrier status for inherited conditions.

The report is designed in simple language that both you and your healthcare professionals can easily understand. It provides actionable insights to help you make informed decisions about your health and wellness.`,
    },
    {
      category: "Healthcare Integration",
      question: "How can doctors use my Genomic Kundli?",
      answer: `Your Genomic Kundli helps doctors provide personalized medicine by understanding your genetic profile. They can develop targeted treatment plans, prescribe medications with optimal effectiveness, and recommend preventive measures.

The report enables healthcare professionals to create wellness strategies specific to your genetic makeup and make informed decisions about health monitoring and screening schedules.`,
    },
    {
      category: "Accuracy & Science",
      question: "How accurate is the Genomic Kundli analysis?",
      answer: `Our analysis uses cutting-edge genomic science and validated genetic markers. We employ state-of-the-art sequencing technology and follow strict quality control protocols with international standards.

The genetic variants we analyze are backed by peer-reviewed research and established genetic databases. However, like all genetic tests, results should be discussed with healthcare professionals for proper interpretation.`,
    },
    {
      category: "Getting Started",
      question: "How do I order my Genomic Kundli kit?",
      answer: `Ordering is simple through our secure online platform or by contacting our customer service team. We ship your kit with detailed instructions, sample collection materials, and secure return packaging.

The entire process from ordering to receiving your personalized genomic kundli report typically takes 3-4 weeks for thorough and accurate analysis of your genetic profile.`,
    },
    {
      category: "Follow-up Support",
      question: "What support do I receive after getting my report?",
      answer: `We provide comprehensive support including detailed explanation of your report findings, genetic counseling sessions, and guidance on sharing results with healthcare providers.

Our team of genetic experts is available to answer questions and help you understand your genomic insights. We also provide updates on new scientific discoveries relevant to your genetic profile.`,
    },
  ],
};

const ROTATION_INTERVAL = 5000 // 5 seconds per question

export function GenomicKundliFaq() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [progress, setProgress] = useState(0)

  const questions = GENOMIC_KUNDLI_FAQ_CONSTANTS.questions
  const currentQuestion = questions[currentQuestionIndex]

  const rotateQuestion = useCallback(() => {
    setProgress(0)
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex === questions.length - 1 ? 0 : prevIndex + 1
    )
  }, [questions.length])

  useEffect(() => {
    let animationFrame: number
    let lastTime: number

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime
      const deltaTime = currentTime - lastTime

      if (isAutoRotating) {
        setProgress(prev => {
          const newProgress = prev + (deltaTime / ROTATION_INTERVAL) * 100
          if (newProgress >= 100) {
            rotateQuestion()
            return 0
          }
          return newProgress
        })
      }

      lastTime = currentTime
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isAutoRotating, rotateQuestion])

  return (
    <section className="bg-purple-50 mb-16 my-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-2xl text-purple-600 font-bold mb-2">
            {GENOMIC_KUNDLI_FAQ_CONSTANTS.title}
          </h2>
          <p className="text-lg md:text-3xl text-gray-600">
            {GENOMIC_KUNDLI_FAQ_CONSTANTS.subtitle}
          </p>
        </div>

        {/* FAQ Content */}
        <div className="w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setIsAutoRotating(false)}
                onMouseLeave={() => setIsAutoRotating(true)}
                onTouchStart={() => setIsAutoRotating(false)}
                onTouchEnd={() => setIsAutoRotating(true)}
                className="bg-white rounded-xl p-5 md:p-8 lg:p-10 shadow-lg border border-gray-100"
              >
                {/* Progress Bar */}
                <motion.div
                  style={{ width: `${progress}%` }}
                  className="h-1 bg-purple-600 rounded-full mb-4 md:mb-6"
                />

                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6"
                >
                  {currentQuestion.question}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8 whitespace-pre-wrap"
                >
                  {currentQuestion.answer}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-1.5 md:gap-2 mt-6 md:mt-8">
            {questions.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setCurrentQuestionIndex(index)
                  setIsAutoRotating(false)
                  setProgress(0)
                }}
                className={cn(
                  "w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300",
                  currentQuestionIndex === index
                    ? "bg-purple-600 w-4 md:w-6"
                    : "bg-gray-300"
                )}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 