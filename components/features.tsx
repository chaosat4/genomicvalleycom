import { Button } from "@/components/ui/button"
import { Microscope, BarChart3, Heart, Home } from 'lucide-react'
import Image from "next/image";
import { featureCards } from "@/constants";
import { FeatureCardProps } from "@/types";

const iconMap = {
  Microscope,
  BarChart3,
  Heart,
  Home
};

function Features() {
  return (
    <section className="py-8 bg-purple-50 md:py-0"> 
      <div className="container hidden md:block">
        <div className="w-full h-px bg-gray-200 mb-8 md:mb-16"></div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="mb-8 md:mb-12 max-w-lg mx-auto lg:mx-0"> 
        <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-center lg:text-left">
            Why Choose GenomicValley?
          </h2>
          <div className="flex justify-center lg:justify-start">
            <Button
              variant="secondary"
              className="mt-4 md:mt-6 bg-purple-600 rounded-full text-white hover:bg-purple-700 w-fit"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 relative">
          {featureCards.map((card, index) => {
            const Icon = iconMap[card.iconName as keyof typeof iconMap];
            return (
              <FeatureCard
                key={index}
                icon={<Icon className="w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4 text-purple-600" />}
                title={card.title}
                description={card.description}
              />
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

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-4 mx-4 md:p-6 bg-white rounded-lg shadow-md border-t-4 border-purple-500 hover:bg-accent">
      {icon}
      <h3 className="text-lg md:text-xl font-medium mb-2">{title}</h3>
      <p className="text-sm md:text-base text-gray-600">{description}</p>
    </div>
  );
}

export default Features;