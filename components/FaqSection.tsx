"use client"
import { useState, useEffect, useCallback } from "react"
import { Target, ClipboardList, Clock, Eye } from 'lucide-react'
import { FAQ_CONSTANTS } from "@/constants"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Database, Network } from 'lucide-react'

const iconMap = {
 Target,
 ClipboardList,
 Clock,
 Eye,
 Database,
 Network,
}

const ROTATION_INTERVAL = 5000 // 5 seconds per question
export function FaqSection() {
 const [activeCategory, setActiveCategory] = useState("General")
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
 const [isAutoRotating, setIsAutoRotating] = useState(true)
 const [progress, setProgress] = useState(0)
  const filteredQuestions = FAQ_CONSTANTS.questions.filter(
   (q) => q.category === activeCategory
 )
  const currentQuestion = filteredQuestions[currentQuestionIndex]
  const rotateQuestion = useCallback(() => {
   setProgress(0)
   setCurrentQuestionIndex((prevIndex) => 
     prevIndex === filteredQuestions.length - 1 ? 0 : prevIndex + 1
   )
 }, [filteredQuestions.length])
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
  useEffect(() => {
   setCurrentQuestionIndex(0)
   setProgress(0)
 }, [activeCategory])
  return (
   <section className="bg-white mb-16 px-4">
     <div className="container mx-auto max-w-7xl">
       <div className="text-center mb-12">
         <h2 className="text-2xl md:text-2xl text-purple-600 font-bold mb-2">
           {FAQ_CONSTANTS.title}
         </h2>
         <p className="text-lg md:text-3xl text-gray-600">
           {FAQ_CONSTANTS.subtitle}
         </p>
       </div>
        {/* Category Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
         {FAQ_CONSTANTS.categories.map((category) => {
           const Icon = iconMap[category.icon as keyof typeof iconMap]
           return (
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               key={category.title}
               onClick={() => {
                 setActiveCategory(category.title)
                 setCurrentQuestionIndex(0)
               }}
               className={cn(
                 "p-4 md:p-6 rounded-lg border-2 transition-all duration-300",
                 "hover:border-purple-600 hover:shadow-lg",
                 "flex flex-col items-center gap-2 md:gap-3",
                 activeCategory === category.title
                   ? "border-purple-600 bg-purple-50"
                   : "border-gray-200"
               )}
             >
               <div
                 className={cn(
                   "p-2 md:p-3 rounded-full transition-all duration-300",
                   activeCategory === category.title
                     ? "bg-purple-600 text-white"
                     : "bg-gray-100 text-gray-600"
                 )}
               >
                 <Icon className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <h3 className="text-sm md:text-lg font-semibold text-center">
                 {category.title}
               </h3>
             </motion.button>
           )
         })}
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
                 className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8"
               >
                 {currentQuestion.answer}
               </motion.p>
               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="w-full md:w-auto bg-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm md:text-base"
               >
                 Explore More Solutions
               </motion.button>
             </motion.div>
           )}
         </AnimatePresence>
          {/* Pagination Dots */}
         <div className="flex justify-center gap-1.5 md:gap-2 mt-6 md:mt-8">
           {filteredQuestions.map((_, index) => (
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
 )
}