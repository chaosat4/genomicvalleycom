import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Cancer Genomics",
        description: "Unlock the genetic secrets of cancer with our comprehensive genomics services",
      },
      contentTitle: "Cancer Genomics",
      contentDescription: `Unlock the genetic secrets of cancer with our comprehensive cancer genomics services. 
  Our expert team employs cutting-edge Next-Generation Sequencing (NGS) technologies and advanced 
  bioinformatics tools to provide insights into cancer biology and identify potential therapeutic targets.`,
      servicesHeading: "Our Cancer Genomics Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Onco Panels",
          details: [
            "Germline Onco Panels: Identify inherited genetic mutations associated with increased cancer risk.",
            "Somatic Onco Panels: Detect acquired genetic mutations in tumor tissue.",
            "Liquid Biopsy Onco Panels: Analyze circulating tumor DNA (ctDNA) for non-invasive cancer diagnosis and monitoring.",
          ],
        },
        {
          number: "2",
          title: "RNA Fusion Analysis",
          details: [
            "Identify gene fusions and rearrangements associated with cancer.",
            "Suitable for researching cancer biology, understanding disease mechanisms, and identifying potential therapeutic targets.",
          ],
        },
        {
          number: "3",
          title: "Tumor Mutational Burden (TMB) Analysis",
          details: [
            "Quantify the number of mutations in a tumor genome.",
            "Ideal for researching cancer immunotherapy, understanding disease mechanisms, and identifying potential biomarkers.",
          ],
        },
        {
          number: "4",
          title: "Circulating Tumor DNA (ctDNA) Analysis",
          details: [
            "Cancer Screening: Detect early-stage cancer using ctDNA analysis, including methylation pattern analysis.",
            "Cancer Monitoring: Track treatment response and disease progression using ctDNA analysis.",
            "Cancer Diagnosis: Diagnose cancer using ctDNA analysis, including identification of cancer-specific mutations and gene expression patterns.",
          ],
        },
        {
          number: "5",
          title: "Copy Number Variation (CNV) Analysis",
          details: [
            "Identify changes in gene copy number associated with cancer.",
          ],
        },
        {
          number: "6",
          title: "Homologous Recombination Deficiency (HRD) Analysis",
          details: [
            "Identify defects in homologous recombination repair associated with cancer.",
          ],
        },
        {
          number: "7",
          title: "Comprehensive Genomic Profiling (CGP)",
          details: [
            "Analyze tumor genomes to identify genetic alterations associated with cancer.",
            "Suitable for researching cancer biology, understanding disease mechanisms, and identifying potential therapeutic targets.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Cancer Genomics Services:",
      benefits: [
        "Comprehensive understanding of cancer biology and genetics",
        "Identification of potential therapeutic targets and biomarkers",
        "Insights into disease mechanisms and treatment response",
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
