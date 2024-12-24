import { FaqSection } from "@/components/FaqSection";
import Features from "@/components/features";
import Hero from "@/components/hero";
import { ServiceCarousel } from "@/components/serviceCarousel";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <ServiceCarousel />
      <FaqSection />
    </div>
  );
}
