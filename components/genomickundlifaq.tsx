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
      answer: `A Genomic Kundli is your personalized genetic wellbeing profile that unlocks the secrets hidden in your DNA. Much like a traditional kundali reveals astrological insights, your genomic kundli reveals the genetic wisdom embedded in your genes.

Our cutting-edge software meticulously decodes your genetic blueprint, revealing only the most impactful insights while preserving your privacy. This comprehensive analysis helps you understand your genetic predispositions, health risks, and personalized wellness recommendations.`,
    },
    {
      category: "Privacy & Security",
      question: "How is my privacy protected during the genomic analysis?",
      answer: `At Genomic Valley, privacy is our top priority. We employ a privacy-first approach by removing all personal identifiers from your genetic data during analysis. Only essential, actionable genetic information is processed and included in your report.

Our secure laboratory protocols ensure that your genetic information is handled with the highest levels of confidentiality. We never share your genetic data with third parties, and you maintain complete control over your genomic kundli report.`,
    },
    {
      category: "Testing Process",
      question: "How do I collect my sample for the Genomic Kundli?",
      answer: `Sample collection is simple and can be done from the comfort of your home. We provide a comprehensive at-home testing kit that includes detailed instructions and all necessary materials.

The process typically involves a simple saliva sample or cheek swab collection. Our kit includes step-by-step guidance to ensure proper sample collection for accurate genetic analysis. Once collected, you'll send the sample back to our laboratory using the provided secure shipping materials.`,
    },
    {
      category: "Results & Reports",
      question: "What information will my Genomic Kundli report contain?",
      answer: `Your personalized Genomic Kundli report provides comprehensive insights into your genetic wellbeing, including:

• Health predisposition analysis for various conditions
• Personalized wellness and lifestyle recommendations
• Nutritional insights based on your genetic makeup  
• Exercise and fitness guidance tailored to your genes
• Medication response indicators
• Carrier status for inherited conditions

The report is designed to empower both you and your healthcare professionals to make precise, informed decisions about your health and wellbeing.`,
    },
    {
      category: "Healthcare Integration",
      question: "How can healthcare professionals use my Genomic Kundli?",
      answer: `Your Genomic Kundli serves as a powerful tool for healthcare professionals to provide personalized medicine. The genetic insights enable doctors to:

• Develop personalized treatment plans based on your genetic profile
• Prescribe medications with optimal efficacy and minimal side effects
• Recommend preventive measures for genetic predispositions
• Create targeted wellness strategies
• Make informed decisions about screening schedules and health monitoring

The report provides actionable genetic information that bridges the gap between your DNA and personalized healthcare.`,
    },
    {
      category: "Accuracy & Science",
      question: "How accurate and scientifically valid is the Genomic Kundli analysis?",
      answer: `Our Genomic Kundli analysis is based on cutting-edge genomic science and validated genetic markers. We use state-of-the-art sequencing technology and bioinformatics algorithms to ensure high accuracy in our genetic analysis.

Our laboratory follows strict quality control protocols and international standards for genetic testing. The genetic variants we analyze are backed by peer-reviewed scientific research and established genetic databases. However, like all genetic tests, results should be interpreted in consultation with healthcare professionals.`,
    },
    {
      category: "Getting Started",
      question: "How do I order my Genomic Kundli kit?",
      answer: `Ordering your Genomic Kundli is simple and convenient. You can request your at-home genetic testing kit through our secure online platform or by contacting our customer service team.

Once you place your order, we'll ship your kit with detailed instructions, sample collection materials, and secure return packaging. The entire process from ordering to receiving your personalized genomic kundli report typically takes 3-4 weeks, ensuring thorough and accurate analysis of your genetic profile.`,
    },
    {
      category: "Follow-up Support",
      question: "What support do I receive after getting my Genomic Kundli report?",
      answer: `We provide comprehensive support to help you understand and act on your genomic kundli insights. This includes:

• Detailed explanation of your report findings
• Genetic counseling sessions to discuss implications
• Guidance on sharing results with healthcare providers
• Updates on new scientific discoveries relevant to your genetic profile
• Ongoing support for implementing personalized wellness recommendations

Our team of genetic experts is available to answer questions and help you make the most of your genomic insights for better health and wellbeing.`,
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