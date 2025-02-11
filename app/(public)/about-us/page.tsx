import OurTeam from "@/components/ourteam";
import Hero from "@/components/abouthero";
import ContentSection from "@/components/contentsection";
import AboutContent from "@/components/aboutcontent";
import Timeline from "@/components/timeline";
import Gallery from "@/components/gallery";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutContent />
      <ContentSection />
      <Gallery />
      <OurTeam />
    </div>
  );
}
