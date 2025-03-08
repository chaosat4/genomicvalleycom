'use client'
import { Button } from "@/components/ui/button"
import { Microscope, BarChart3, Heart, Home, Clock, Target, Globe2, LineChart, FlaskConical } from 'lucide-react'
import Image from "next/image";
import { featureCards } from "@/constants";
import { useRouter } from "next/navigation";


const iconMap = {
  Microscope,
  BarChart3,
  Heart,
  Home,
  Target,
  Globe2,
  LineChart,
  Clock,
  FlaskConical
};

function Features() {
  const router = useRouter();
  return (
    <section className="py-8 bg-purple-50 md:py-0"> 
      <div className="container hidden md:block">
        <div className="w-full h-px bg-gray-200 mb-8 md:mb-16"></div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="mb-8 md:mb-12 max-w-lg mx-auto lg:mx-0"> 
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-center lg:text-left">
            Why Choose Genomic Valley?
          </h2>
          <div className="flex justify-center lg:justify-start">
            <Button
              variant="secondary"
              className="mt-4 md:mt-6 bg-purple-600 rounded-full text-white hover:bg-purple-700 w-fit"
              onClick={() => {
                router.push('/services');
              }}
            >
              Learn More
            </Button>
          </div>
          <div className="pt-8 md:pt-16">
            <Image 
              src="/feature-img.jpg" 
              alt="Lab-Features" 
              width={450} 
              height={450}
              className="w-full max-w-[450px] mx-auto lg:mx-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featureCards.map((card, index) => {
            const Icon = iconMap[card.iconName as keyof typeof iconMap];
            return (
              <div className="relative group h-full" key={index}>
                <FeatureCard
                  icon={<Icon className="w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 text-purple-600" />}
                  title={card.title}
                  description={card.description}
                  maxLength={100}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="container">
        <div className="w-full h-px bg-gray-200 mt-8 md:mt-10 mb-4 md:mb-6"></div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  maxLength?: number;
}

function FeatureCard({ icon, title, description, maxLength = 150 }: FeatureCardProps) {
  const truncatedText = description.length > maxLength 
    ? description.slice(0, maxLength).trim()
    : description;

  const needsTruncation = description.length > maxLength;

  return (
    <div className="flex flex-col h-full p-4 md:p-5 bg-white rounded-lg shadow-md border-t-4 border-purple-500 
                    hover:bg-accent transition-all duration-300 ease-in-out
                    group-hover:scale-105 group-hover:shadow-xl group-hover:z-10">
      <div className="flex-shrink-0">
        {icon}
        <h3 className="text-lg font-medium mb-2 group-hover:line-clamp-none line-clamp-2">{title}</h3>
      </div>
      <div className="relative flex-grow">
        <p className="text-sm text-gray-600 transition-all duration-300 ease-in-out">
          <span>{truncatedText}</span>
          {needsTruncation && (
            <span className="group-hover:hidden">...</span>
          )}
          <span className="hidden group-hover:inline">
            {needsTruncation ? description.slice(maxLength) : ''}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Features;