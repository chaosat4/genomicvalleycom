import React from "react"


export const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Genome Assembly",
        description: "Get accurate and comprehensive genome assembly with our expert services",
      },
      contentTitle: "Genome Assembly",
      contentDescription: `Unlock the secrets of genomes with our comprehensive assembly services. 
  Genome assembly is a critical step in understanding the genetic blueprint of an organism. 
  Our services employ cutting-edge Next-Generation Sequencing (NGS) technologies and advanced 
  bioinformatics tools to provide high-quality genome assemblies.`,
      servicesHeading: "Our Genome Assembly Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Human Genome Assembly",
          details: [
            "Assemble high-quality human genomes for research, clinical, and forensic applications.",
            "Ideal for studying genetic diseases, understanding population genetics, and identifying genetic variants.",
          ],
        },
        {
          number: "2",
          title: "Plant Genome Assembly",
          details: [
            "Assemble plant genomes to understand crop improvement, breeding, and genetic diversity.",
            "Suitable for studying plant evolution, understanding plant-microbe interactions, and identifying genes for desirable traits.",
          ],
        },
        {
          number: "3",
          title: "Bacterial Genome Assembly",
          details: [
            "Assemble bacterial genomes to understand microbial evolution, antimicrobial resistance, and host-microbe interactions.",
            "Ideal for studying bacterial pathogens, understanding microbiome dynamics, and identifying novel antimicrobial targets.",
          ],
        },
        {
          number: "4",
          title: "Fungal Genome Assembly",
          details: [
            "Assemble fungal genomes to understand fungal evolution, pathogenesis, and host-fungal interactions.",
            "Suitable for studying fungal diseases, understanding fungal-bacterial interactions, and identifying novel antifungal targets.",
          ],
        },
        {
          number: "5",
          title: "Animal Genome Assembly",
          details: [
            "Assemble animal genomes to understand animal evolution, breeding, and genetic diversity.",
            "Ideal for studying animal models of human disease, understanding animal-microbe interactions, and identifying genes for desirable traits.",
          ],
        },
        {
          number: "6",
          title: "Microbial Community Genome Assembly (Metagenomics)",
          details: [
            "Assemble genomes from microbial communities to understand community structure, function, and dynamics.",
            "Suitable for studying microbial ecology, understanding host-microbe interactions, and identifying novel biomarkers.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Genome Assembly Services:",
      benefits: [
        "High-quality genome assemblies for research, clinical, and forensic applications",
        "Improved understanding of genetic diversity, evolution, and function",
        "Identification of novel genes, variants, and biomarkers",
        "Insights into disease mechanisms, host-microbe interactions, and ecological dynamics",
        "Expert bioinformatics analysis and support",
      ],
    },
  };
  
  



export default function ServicesPage() {
  const { 
    mainContent 
  } = SERVICES_PAGE_CONTENT

  return (
    <div className="bg-purple-50 min-h-screen pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Gene Expression Analysis Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Box */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border-2 border-green-500 p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-3">
                {mainContent.leftBox.title}
              </h3>
              <p className="text-gray-700 text-center">
                {mainContent.leftBox.description}
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9">
            <h3 className="text-2xl font-bold text-purple-600 mb-3">
              {mainContent.contentTitle}
            </h3>
            <p className="text-gray-800 mb-4 text-justify">
              {mainContent.contentDescription}
            </p>

            <h4 className="text-xl font-semibold text-purple-600 mt-6 mb-4">
              {mainContent.servicesHeading}
            </h4>

            <div className="space-y-6">
              {mainContent.servicesList.map((service) => (
                <div key={service.number}>
                  <h5 className="text-lg font-semibold flex items-center">
                    <span className="bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-2">
                      {service.number}
                    </span>
                    {service.title}
                  </h5>
                  <div className="ml-9 text-gray-700">
                    {service.details.map((detail, i) => (
                      <p key={i} className="flex items-start text-justify">
                        <span className="text-purple-600 mr-2">→</span>
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-purple-600 mb-4">
                {mainContent.benefitsHeading}
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {mainContent.benefits.map((benefit, i) => (
                  <li key={i} className="text-justify">{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
