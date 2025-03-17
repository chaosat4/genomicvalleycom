import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Metagenomics",
        description: "Explore microbial communities with our metagenomics services",
      },
      contentTitle: "MetaGenomics",
      contentDescription: `Explore the microbial world with our comprehensive meta-genomics services. 
  Meta-genomics is the study of genetic material recovered directly from environmental samples, 
  allowing researchers to understand the diversity, structure, and function of microbial communities. 
  Our services employ cutting-edge Next-Generation Sequencing (NGS) technologies and advanced 
  bioinformatics tools to provide insights into the microbial world.`,
      servicesHeading: "Our MetaGenomics Services Include:",
      servicesList: [
        {
          number: "1",
          title: "16S rRNA Gene Sequencing",
          details: [
            "Analyze specific variable regions (V1-V9) or the entire 16S rRNA gene to understand microbial diversity and community structure.",
            "Ideal for researching microbial ecology, understanding host-microbe interactions, and identifying novel biomarkers.",
          ],
        },
        {
          number: "2",
          title: "Shotgun MetaGenomics",
          details: [
            "Sequence the entire meta-genome to understand the functional potential of microbial communities.",
            "Suitable for researching microbial metabolism, understanding nutrient cycling, and identifying novel enzymes.",
          ],
        },
        {
          number: "3",
          title: "Whole MetaGenome Sequencing",
          details: [
            "Assemble and analyze the complete meta-genome to understand the genetic blueprint of microbial communities.",
            "Ideal for researching microbial evolution, understanding community dynamics, and identifying novel biomarkers.",
          ],
        },
        {
          number: "4",
          title: "Meta-Transcriptomics",
          details: [
            "Analyze the expression of microbial genes to understand community function and dynamics.",
            "Suitable for researching microbial physiology, understanding host-microbe interactions, and identifying novel biomarkers.",
          ],
        },
        {
          number: "5",
          title: "Virome Analysis",
          details: [
            "Study the viral component of microbial communities to understand viral-host interactions and ecosystem dynamics.",
            "Ideal for researching viral ecology, understanding disease transmission, and identifying novel viral biomarkers.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our MetaGenomics Services:",
      benefits: [
        "Comprehensive understanding of microbial diversity and community structure",
        "Insights into microbial function, metabolism, and ecology",
        "Identification of novel biomarkers, enzymes, and bioactive compounds",
        "Expert bioinformatics analysis and support",
        "Customized solutions for specific research questions and applications",
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
