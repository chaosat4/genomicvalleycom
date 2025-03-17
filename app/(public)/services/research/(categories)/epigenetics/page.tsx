import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Epigenetics",
        description: "Explore the epigenetic landscape with our comprehensive services",
      },
      contentTitle: "Epigenetics",
      contentDescription: `Unlock the secrets of gene regulation with our comprehensive epigenetics services. 
  Epigenetics is the study of heritable changes in gene function that occur without a change in the underlying DNA sequence. 
  Our services employ cutting-edge Next-Generation Sequencing (NGS) technologies and advanced bioinformatics tools 
  to provide insights into epigenetic mechanisms.`,
      servicesHeading: "Our Epigenetics Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Whole Genome Methylation",
          details: [
            "Analyze genome-wide DNA methylation patterns to understand gene regulation and epigenetic mechanisms.",
            "Ideal for researching epigenetic reprogramming, understanding disease mechanisms, and identifying novel biomarkers.",
          ],
        },
        {
          number: "2",
          title: "Targeted Methylation",
          details: [
            "Focus on specific genes or regions of interest to analyze DNA methylation patterns and understand gene regulation.",
            "Suitable for researching gene-specific epigenetic mechanisms, understanding disease mechanisms, and identifying novel therapeutic targets.",
          ],
        },
        {
          number: "3",
          title: "cfDNA Methylation",
          details: [
            "Analyze cell-free DNA (cfDNA) methylation patterns to understand epigenetic changes in circulating DNA.",
            "Ideal for researching liquid biopsy applications, understanding cancer biology, and identifying novel biomarkers.",
          ],
        },
        {
          number: "4",
          title: "ChIP-Seq (Chromatin Immunoprecipitation Sequencing)",
          details: [
            "Analyze protein-DNA interactions to understand gene regulation and epigenetic mechanisms.",
            "Suitable for researching transcription factor binding, understanding chromatin structure, and identifying novel regulatory elements.",
          ],
        },
        {
          number: "5",
          title: "ATAC-Seq (Assay for Transposase-Accessible Chromatin Sequencing)",
          details: [
            "Analyze open chromatin regions to understand gene regulation and epigenetic mechanisms.",
            "Ideal for researching chromatin accessibility, understanding gene regulation, and identifying novel regulatory elements.",
          ],
        },
        {
          number: "6",
          title: "Histone Modification Analysis",
          details: [
            "Analyze histone modifications to understand chromatin structure and epigenetic mechanisms.",
            "Suitable for researching histone modification patterns, understanding gene regulation, and identifying novel biomarkers.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Epigenetics Services:",
      benefits: [
        "Comprehensive understanding of epigenetic mechanisms and gene regulation",
        "Insights into disease mechanisms and potential therapeutic targets",
        "Identification of novel biomarkers and regulatory elements",
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
