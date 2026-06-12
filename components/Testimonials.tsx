'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const testimonialData = [
  
  {
    id: 1,
    name: "Dr Suman Mishra",
    role: "Assistant Professor",
    image: "/sm.jpeg",
    testimonial: "Genomic Valley Bharat's commitment to excellence and customer satisfaction truly sets them apart. I highly recommend them to researchers and clinicians seeking reliable genomic and transcriptomic analysis.",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Mohit",
    role: "Sr. Technical Officer",
    image: "/mohit.jpeg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. delivered high-quality sequencing services with a comprehensive, end-to-end approach, ensuring timely data generation and insightful analysis outcome. Team is highly experienced and supportive. We highly recommend their expertise for any genomics related projects.",
    rating: 5
  },
  {
    id: 3,
    name: "Prof. S. C. Lakhotia",
    role: "BHU Distinguished Professor (Lifetime), Cytogenetics Laboratory, Department of Zoology, Institute of Science, Banaras Hindu University, Varanasi",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. has consistently delivered high-quality genome sequencing and bioinformatics services with excellent turnaround time and reliable analytical support. Researchers have appreciated the accuracy of the generated sequencing data, along with the dedicated guidance and prompt technical assistance provided by the expert team whenever required. Their commitment to maintaining scientific standards, responsiveness, and dependable research support has made GV a trusted partner for academic and research institutions.",
    rating: 5,
    pdf: "/Testimonials/Dr.%20Lakhotia%20BHU.pdf"
  },
  {
    id: 4,
    name: "Prof. Manisha Sachan",
    role: "Professor, Department of Biotechnology, Motilal Nehru National Institute of Technology Allahabad, Prayagraj",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. provided efficient and satisfactory bisulfite amplicon sequencing services with high-quality NGS data analysis and timely project delivery. The sequencing outcomes and analytical standards met the expected research requirements, while the team ensured smooth collaboration and reliable communication throughout the project. Their professional approach and commitment to quality have established GV as a dependable partner for advanced biotechnology and genomics research services.",
    rating: 5,
    pdf: "/Testimonials/Dr.%20Manisha%20Sachan_MNNIT.pdf"
  },
  {
    id: 5,
    name: "Dr. Neeraj Kumar",
    role: "Scientist, Department of Reproductive Biology, All India Institute of Medical Sciences, New Delhi",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. demonstrated exceptional professionalism, technical expertise, and responsiveness while supporting advanced research projects with high-quality genomic analysis and data visualization services. Their efficient turnaround time, reliable deliverables, and strong analytical insights significantly enhanced the clarity and depth of the study outcomes. The team's dedication, collaborative approach, and commitment to maintaining research quality have made GV a highly recommended and trusted partner for biomedical and life science research.",
    rating: 5,
    pdf: "/Testimonials/Dr.%20Neeraj%20AIIMS.pdf"
  },
  {
    id: 6,
    name: "Dr. Varun Suroliya",
    role: "Scientist-C, Artemis Education & Research Foundation, Artemis Hospital, Gurugram",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. successfully delivered comprehensive next-generation sequencing and transcriptome analysis services with professionalism, technical expertise, and reliable end-to-end project support. Their team efficiently managed sample collection, RNA isolation, library preparation, quality control, data generation, and downstream analysis while maintaining timely communication and responsiveness throughout the project. The scientific guidance, proactive support, and commitment to research quality significantly contributed to the smooth execution and successful completion of the study, making GV a highly recommended partner for genomics and transcriptomics research projects.",
    rating: 5,
    pdf: "/Testimonials/Dr.%20Varun%20Artemis.pdf"
  },
  {
    id: 7,
    name: "Registrar",
    role: "Magadh University, Bodh Gaya",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. has been recognized for delivering reliable whole transcriptome sequencing and advanced data analysis services with a strong focus on quality, accuracy, and timely execution. Their expertise in RNA isolation, library preparation, RNA sequencing, and downstream analytical support has contributed significantly to successful research outcomes. GV's professional approach, technical proficiency, and commitment to providing comprehensive genomics solutions continue to make them a trusted partner for academic and scientific institutions.",
    rating: 5,
    pdf: "/Testimonials/Magadh%20University.pdf"
  },
  {
    id: 8,
    name: "Dr. Jayanthi Shastri",
    role: "Chair Professor, Centre of Excellence in Research & Training in Infectious Diseases, Maharashtra University of Health Sciences, Mumbai",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. successfully delivered high-quality next-generation sequencing (NGS) services with comprehensive end-to-end support for advanced infectious disease and viral genome research projects. Their team demonstrated exceptional technical expertise, professionalism, and responsiveness throughout the project by providing support in conceptualization, experimental planning, library preparation, sequencing execution, and downstream analysis. The sequencing quality, data integrity, and analytical outcomes consistently met expected scientific standards while ensuring timely and well-structured project delivery. GV's collaborative approach and reliable technical guidance significantly contributed to the successful completion of the research, making them a highly recommended partner for genomics and sequencing-based studies.",
    rating: 5,
    pdf: "/Testimonials/Recommendation%20Letter%20Genome%20Valley%20.pdf"
  },
  {
    id: 9,
    name: "Dr. Suman Mishra",
    role: "PhD Researcher",
    image: "/sm.jpeg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. has been recognized for delivering exceptional genomic and transcriptomic analysis services with remarkable professionalism, technical expertise, and attention to detail. Their team efficiently handled complex transcriptomic datasets, including challenging plasma sample analyses, while ensuring high-quality extraction, library preparation, data processing, and comprehensive reporting. The clarity of insights, reliable analytical support, and commitment to research excellence significantly enhanced the overall study outcomes. GV's consistent focus on quality, responsiveness, and customer satisfaction makes them a highly recommended partner for researchers and clinicians seeking advanced genomics solutions.",
    rating: 5,
    pdf: "/Testimonials/Recommendations%20Dr.%20Suman%20SGPGI.pdf"
  },
  {
    id: 10,
    name: "Dr. Gopinath M",
    role: "Scientist F, CFTRI, Mysore",
    image: "/default_profile.jpg",
    testimonial: "Genomic Valley Bharat Pvt. Ltd. provided exceptional 16S V3-V4 metagenomics analysis and NCBI SRA submission support for our research project. Their scientific expertise, technical guidance, and commitment to quality ensured reliable results, timely delivery, and a smooth project experience.",
    rating: 5,
    pdf: "/Testimonials/Dr.%20Gopinath%2C%20CFTRI%20Mysore.pdf"
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
                {testimonialData[currentIndex].pdf && (
                  <a
                    href={testimonialData[currentIndex].pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm font-medium text-purple-500 underline hover:text-purple-700"
                  >
                    View Recommendation Letter
                  </a>
                )}
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