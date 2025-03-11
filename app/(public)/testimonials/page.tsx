import { Testimonials } from '@/components/Testimonials';
import Link from 'next/link';
import Image from 'next/image';

export default function TestimonialsPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden mt-[120px]">
        <div className="absolute inset-0">
          <Image
            src="/testimonials-hero.jpg"
            alt="Genetic Counseling Hero"
            width={1200}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-800/60 to-purple-400/20" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-1 mx-auto max-w-7xl px-4 pt-[30%] sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Creating real impact with cutting-edge genetics
          </h1>
          <p className="text-xl text-white/90">
            Genomicvalley is India&apos;s most trusted Next Generation Sequencing diagnostic platform.
          </p>
        </div>
      </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-purple-50">
        <Testimonials />
      </div>
    </div>
  );
} 