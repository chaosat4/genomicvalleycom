'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const testimonialData = [
  {
    id: 1,
    name: "Dr Amit",
    role: "Healthcare Professional",
    image: "/male_avatar.png",
    testimonial: "Genomic Valley Bharat will be a trailblazer in integrating Next-Generation Sequencing and AI into healthcare. Their expertise and commitment to innovation will be evident in the precision and reliability of their diagnostic services. As a healthcare provider, I will trust their data and solutions to enhance patient outcomes and support informed decision-making.",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Mohit",
    role: "Healthcare Professional",
    image: "/male_avatar.png",
    testimonial: "Genomic Valley Bharat will be transformative. Their advanced AI-based genome healthcare research will provide us with invaluable insights into genetic patterns, driving innovation in our personalized medicine approaches. Their dedication to excellence and cutting-edge technology will be truly commendable.",
    rating: 5
  },
  {
    id: 3,
    name: "Dr. Shikha",
    role: "Healthcare Professional",
    image: "/female_avatar.png",
    testimonial: "The personalized healthcare services at Genomic Valley Bharat will revolutionize our approach to patient care. By tailoring treatments based on unique genetic profiles, they will ensure our patients receive the most effective therapies with minimal adverse effects. Their expertise in NGS and AI will be unmatched, making them an invaluable partner in our healthcare journey.",
    rating: 5
  }
];

const ROTATION_INTERVAL = 5000;

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [progress, setProgress] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
    setProgress(0);
  };

  const previousTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialData.length) % testimonialData.length);
    setProgress(0);
  };

  useEffect(() => {
    let animationFrame: number;
    let lastTime: number;

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;

      if (isAutoRotating) {
        setProgress((prev) => {
          const newProgress = prev + (deltaTime / ROTATION_INTERVAL) * 100;
          if (newProgress >= 100) {
            nextTestimonial();
            return 0;
          }
          return newProgress;
        });
      }

      lastTime = currentTime;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isAutoRotating]);

  return (
    <section className="bg-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600">Real experiences from people we've helped</p>
        </div>

        <div className="relative mx-auto"
          onMouseEnter={() => setIsAutoRotating(false)}
          onMouseLeave={() => setIsAutoRotating(true)}
        >
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 rounded-full mb-8">
            <motion.div
              className="h-full bg-purple-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-12"
            >
              <div className="flex flex-col items-center text-center">
                <Quote className="w-12 h-12 text-purple-600 mb-6" />
                <div className="relative w-24 h-24 mb-6">
                  <Image
                    src={testimonialData[currentIndex].image}
                    alt={testimonialData[currentIndex].name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  {testimonialData[currentIndex].testimonial}
                </p>
                <h3 className="text-xl font-semibold text-gray-900">
                  {testimonialData[currentIndex].name}
                </h3>
                <p className="text-purple-600">
                  {testimonialData[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousTestimonial}
              className="bg-white/80 hover:bg-white shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="bg-white/80 hover:bg-white shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonialData.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setProgress(0);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 bg-purple-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 