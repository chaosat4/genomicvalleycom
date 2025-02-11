"use client"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const FAQ_CONSTANTS = {
  title: "Frequently Asked Questions",
  subtitle: "Find answers to common questions about genetic counseling",
  questions: [
    {
      category: "Genetic Counseling",
      question: "What Is Genetic Counseling?",
      answer: `Genetic counseling is a specialized service aimed at providing information and support to individuals and families to understand the medical and psychological implications of genetic conditions. It involves assessing the risk of inherited disorders, providing information on how genetics affects health, and guiding individuals on their options for diagnosis, prevention, and treatment.

At Genomic Valley Bharat Limited, we integrate cutting-edge genomics with personalized care to offer comprehensive genetic counseling services. The mission is to empower families with knowledge, ensuring they make informed decisions about their health.`,
    },
    {
      category: "Genetic Counseling",
      question: "Why Would Someone See a Genetic Counselor?",
      answer: `There are many reasons someone might seek genetic counseling. You may be referred to a genetic counselor if you or your family have a history of inherited genetic conditions, birth defects, or repeated pregnancy loss. This includes individuals with concerns about cancers with hereditary links (such as breast, ovarian, or colon cancer) and those with questions about family planning or fertility. The experienced team at Genomic Valley is equipped to address these concerns with precision, offering genetic insights to support your healthcare journey.`,
    },
    {
      category: "Genetic Counseling",
      question: "Who Should Get Genetic Counseling?",
      answer: `Genetic counseling is particularly beneficial for individuals or couples with advanced maternal age planning to start a family, those with a known family history of a genetic condition, and pregnant women with abnormal prenatal test results. It's also valuable for individuals diagnosed with or suspected of having a genetic disorder, as well as cancer patients or those with a family history of hereditary cancers. Whether you're looking for information before starting a family or navigating an existing health condition, Genomic Valley Bharat Limited provides tailored genetic counseling to guide you every step of the way.`,
    },
    {
      category: "Genetic Counseling",
      question: "What Happens in Genetic Counseling?",
      answer: `During a genetic counseling session, the counselor will gather detailed information about your family's medical history and discuss any potential health concerns. They may suggest genetic testing to further explore your genetic risks and work with you to interpret the results. This process helps in understanding the likelihood of passing genetic conditions on to your children or managing inherited health risks.`,
    },
    {
      category: "Genetic Counseling",
      question: "What Can I Expect in a Genetic Counseling Session?",
      answer: `A typical genetic counseling session at Genomic Valley is comprehensive and personalized. Your counselor will begin with a thorough review of your medical and family history, followed by creating a detailed pedigree chart from both parties (husband and wife) to assess inherited conditions. You'll receive detailed explanations about your genetic risks and available testing options, along with consistent psychosocial support throughout the process. We prioritize secure informed consent, ensuring you're fully aware of all procedures and tests involved. If genetic testing is pursued, the counselor will provide detailed result interpretation and help you make informed decisions about healthcare options. Each session concludes with a written summary serving as a permanent record of the information discussed.`,
    },
    {
      category: "Genetic Counseling",
      question: "When Might I See a Genetic Counselor?",
      answer: `You should consider seeing a genetic counselor when planning a pregnancy to understand your genetic risks, if you or your partner has a known genetic condition in the family, or if you're pregnant and your doctor suggests genetic screening or testing based on results or age. Additionally, if you have concerns about hereditary cancer risks or other inherited conditions, our counselors at Genomic Valley are available to help you at every stage, from family planning to post-diagnosis care.`,
    },
    {
      category: "Genetic Counseling",
      question: "What Are the Options After Genetic Counseling?",
      answer: `After genetic counseling, depending on your personal and family history, you may be offered genetic testing or referred to specialists for further care. Our team will support you in making informed decisions about family planning, prenatal testing, managing inherited health risks, and exploring available treatment or prevention strategies. We ensure that you have a clear understanding of all your options and the potential implications of each choice.`,
    },
    {
      category: "Genetic Counseling",
      question: "How Can I Find a Genetic Counsellor?",
      answer: `Genomic Valley Bharat Limited provides an expert genetic counsellor with deep knowledge in genomics and healthcare. The counselor is highly skilled in guiding you through complex genetic information and helping you make choices that suit your personal situation. We ensure that each individual receives personalized care, comfort, and attention throughout their counselling journey.`,
    },
  ],
};

const ROTATION_INTERVAL = 5000 // 5 seconds per question

export function FaqSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [progress, setProgress] = useState(0)

  const questions = FAQ_CONSTANTS.questions
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
            {FAQ_CONSTANTS.title}
          </h2>
          <p className="text-lg md:text-3xl text-gray-600">
            {FAQ_CONSTANTS.subtitle}
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