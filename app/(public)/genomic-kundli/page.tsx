import Hero from "@/components/genomickundlihero";
import { AboutGenomicKundli } from "@/components/aboutgenomickundli";
import GenomicKundliProcess from "@/components/genomickundliprocess";
import { GenomicKundliFaq } from "@/components/genomickundlifaq";

export default function GenomicKundliPage() {
  return (
    <div>
      <Hero />
      <AboutGenomicKundli />
      <GenomicKundliProcess />
      <GenomicKundliFaq />
    </div>
  );
}
