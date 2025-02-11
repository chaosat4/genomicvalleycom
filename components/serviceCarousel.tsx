import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Dna, FlaskConical, Database, Network } from 'lucide-react' // Import relevant icons

export function ServiceCarousel() {
  const services = [
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "DNA-Based Mutations (CNV, SNV, InDel) – Germline & Somatic",
      description: "Accurate detection of critical genetic alterations for advanced diagnostics."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "RNA Fusion",
      description: "Identify and characterize essential RNA fusion events in oncology."
    },

    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Pathogen Genomics",
      description: "Comprehensive genomic profiling of pathogens for effective control."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Antibiotic Resistance (AMR) Studies",
      description: "Analyze resistance markers to guide targeted antibiotic therapies."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Viral Genomics",
      description: "Uncover viral diversity and evolution for rapid outbreak response."
    },

    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Rare Disease Genomics",
      description: "Pinpoint elusive genetic variants for rare disease diagnostics."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Mendelian Disorders Testing",
      description: "Determine inherited mutations for informed family guidance."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Genetic Testing & Screening",
      description: "Early detection of inherited conditions to improve patient outcomes."
    },

    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Pan-cancer Studies",
      description: "Broad-scale cancer research leveraging multi-tumor genomic data."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Hereditary Cancer Syndromes Testing",
      description: "Identify inherited mutations to guide preventive cancer strategies."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Tumor Microenvironment Studies",
      description: "Elucidate tumor-immune interactions for novel therapeutic targets."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Tumor Profiling",
      description: "Comprehensive tumor characterization for personalized treatment."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Liquid Biopsy",
      description: "Minimally invasive approach for real-time cancer monitoring."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Mutation Detection",
      description: "Spot critical genomic alterations across diverse sample types."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Biomarker Discovery",
      description: "Unearth clinically relevant biomarkers for diagnosis and therapy."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Pharmacogenomics Testing",
      description: "Tailor medication choices based on individual genetic profiles."
    },

    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Library Preparation",
      description: "High-quality sample processing for precise sequencing results."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Sequencing Platforms",
      description: "State-of-the-art platforms supporting diverse genomic applications."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Bioinformatics Analysis",
      description: "Streamlined data processing pipelines for actionable insights."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Data Interpretation",
      description: "Expert review and reporting of genomic findings."
    },

    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Whole Genome Sequencing (WGS)",
      description: "Comprehensive analysis of the entire genome for deep insights."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Whole Exome Sequencing (WES)",
      description: "Focus on coding regions to pinpoint disease-associated variants."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Targeted Sequencing",
      description: "Custom panels for rapid, cost-effective variant detection."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "RNA Sequencing (RNA-Seq)",
      description: "Uncover gene expression dynamics for comprehensive transcriptomics."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Single-cell Sequencing",
      description: "Dissect cellular heterogeneity at the highest resolution."
    },
    {
      icon: <Dna className="w-8 h-8 mb-4 text-purple-600" />,
      title: "Metagenomics Testing",
      description: "Characterize microbial communities for infection and biodiversity studies."
    }
  ];

  return (
    <>
    <div className="container mx-auto mt-8 md:mt-16 px-4 md:px-6"> 
        <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-xl md:text-3xl lg:text-4xl px-4 md:px-12 lg:px-20 text-center mb-6 md:mb-10">
          We offer a comprehensive coverage of more than 80+ medical tests with reliable results
        </p>
    </div>
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-32"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {services.map((service, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
            <div className="h-full p-1">
              <Card className="border-none shadow-md hover:bg-accent h-full flex flex-col">
                <CardContent className="flex flex-col h-full p-4 md:p-6 border-t-4 border-purple-500">
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-2 flex-none">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 flex-grow">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex border-purple-600 text-purple-600 hover:bg-purple-300" />
      <CarouselNext className="hidden md:flex border-purple-600 text-purple-600 hover:bg-purple-300" />
    </Carousel>
    </>
  )
}