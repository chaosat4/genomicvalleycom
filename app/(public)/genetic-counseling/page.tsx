import Hero from "@/components/geneticcounselinghero";
import MeetGeneticCounselor from "@/components/meetgeneticcounselor";
import { FaqSection } from "@/components/geneticcounselingfaq";
import GeneticCounselingProcess from "@/components/geneticcounselingprocess";


export default function Home() {
  return (
    <div>
      <Hero />
      <MeetGeneticCounselor />
      <GeneticCounselingProcess />
      <FaqSection />
    </div>
  );
}
