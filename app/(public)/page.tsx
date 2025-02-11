import { FaqSection } from "@/components/FaqSection";
import Features from "@/components/features";
import Hero from "@/components/hero";
import { ServiceCarousel } from "@/components/serviceCarousel";
import { Testimonials } from "@/components/Testimonials";
import Image from "next/image";
import Gallery from "@/components/Gallery";
export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <ServiceCarousel />
      <Gallery />
      <FaqSection />
      <Testimonials />
    </div>
  );
}
