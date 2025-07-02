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

      <div className="container grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
        <div className="mb-8 md:mb-12 max-w-lg mx-auto lg:mx-0 lg:col-span-2"> 
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
              src="/Why Choose Us_2.jpg" 
              alt="Lab-Features" 
              width={450} 
              height={450}
              className="w-full max-w-[450px] mx-auto lg:mx-0"
            />
          </div>
        </div>

        {/* Features as horizontal cards in a single column */}
        <div className="flex flex-col gap-4 md:gap-6 w-full lg:col-span-3">
          {featureCards.map((card, index) => {
            const Icon = iconMap[card.iconName as keyof typeof iconMap];
            return (
              <div className="relative group h-full" key={index}>
                <FeatureCard
                  icon={<Icon className="w-10 h-10 md:w-12 md:h-12 text-purple-600 flex-shrink-0" />}
                  title={card.title}
                  description={card.description}
                  maxLength={150}
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
    <div className="flex flex-row items-center h-full p-3 md:p-4 bg-white rounded-lg shadow-md border-l-4 border-purple-500 
                    hover:bg-accent transition-all duration-300 ease-in-out
                    group-hover:scale-105 group-hover:shadow-xl group-hover:z-10 gap-4 md:gap-6">
      <div className="flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-medium mb-1 group-hover:line-clamp-none line-clamp-2">{title}</h3>
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
    </div>
  );
}

export default Features;