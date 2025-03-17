import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Gene Expression Analysis",
        description: "Understand gene expression patterns with our cutting-edge analysis services",
      },
      contentTitle: "Gene Expression Analysis",
      contentDescription: `Unlock the secrets of gene expression with our comprehensive analysis services. 
  Gene expression analysis is a crucial tool for understanding the intricacies of cellular function, 
  disease mechanisms, and treatment responses. Our services employ cutting-edge Next-Generation 
  Sequencing (NGS) technologies to provide detailed insights into gene expression patterns.`,
  
      servicesHeading: "Our Gene Expression Analysis Services Include:",
      servicesList: [
        {
          number: "1",
          title: "mRNA Sequencing",
          details: [
            "Analyze polyadenylated mRNA transcripts to understand gene expression levels and identify differentially expressed genes.",
            "Ideal for studying gene expression changes in response to various conditions, such as disease, treatment, or environmental factors.",
          ],
        },
        {
          number: "2",
          title: "Total RNA Sequencing",
          details: [
            "Examine the entire RNA transcriptome, including mRNA, tRNA, and other non-coding RNAs.",
            "Suitable for discovering novel transcripts, understanding RNA processing and modification, and identifying biomarkers.",
          ],
        },
        {
          number: "3",
          title: "miRNA Sequencing",
          details: [
            "Investigate microRNA (miRNA) expression patterns to understand their role in regulating gene expression.",
            "Useful for studying miRNA-mediated gene regulation, identifying potential biomarkers, and understanding disease mechanisms.",
          ],
        },
        {
          number: "4",
          title: "Transcriptome Sequencing",
          details: [
            "Characterize the complete set of transcripts in a cell, tissue, or organism.",
            "Ideal for understanding gene expression, identifying novel transcripts, and discovering alternative splicing events.",
          ],
        },
        {
          number: "5",
          title: "Single-cell RNA Sequencing",
          details: [
            "Analyze gene expression patterns at the single-cell level to understand cellular heterogeneity.",
            "Suitable for studying cell differentiation, understanding disease mechanisms, and identifying novel cell types.",
          ],
        },
      ],
  
      benefitsHeading: "Benefits of Our Gene Expression Analysis Services:",
      benefits: [
        "Comprehensive understanding of gene expression patterns",
        "Identification of differentially expressed genes and pathways",
        "Discovery of novel transcripts and biomarkers",
        "Insights into disease mechanisms and treatment responses",
        "High-quality data and expert analysis",
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
