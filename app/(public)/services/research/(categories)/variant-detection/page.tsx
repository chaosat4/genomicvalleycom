import React from "react"


export const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Variant Detection",
        description: "Identify genetic variants with our advanced detection services",
      },
      contentTitle: "Variant Detection",
      contentDescription: `Identify genetic variations with our comprehensive variant detection services. 
  Variant detection is a crucial step in understanding the genetic basis of diseases, 
  developing personalized medicine, and improving crop yields. Our services employ 
  cutting-edge Next-Generation Sequencing (NGS) technologies and advanced bioinformatics 
  tools to provide accurate and reliable variant detection.`,
      servicesHeading: "Our Variant Detection Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Whole Genome Sequencing (WGS)",
          details: [
            "Detect variants across the entire genome, including coding and non-coding regions.",
            "Ideal for researching genetic diseases, understanding population genetics, and identifying novel variants.",
          ],
        },
        {
          number: "2",
          title: "Whole Exome Sequencing (WES)",
          details: [
            "Focus on the protein-coding regions of the genome to identify variants associated with disease.",
            "Suitable for diagnosing genetic disorders, understanding disease mechanisms, and identifying potential therapeutic targets.",
          ],
        },
        {
          number: "3",
          title: "Whole Transcriptome Sequencing (WTS)",
          details: [
            "Analyze the complete set of transcripts in a cell or tissue to identify variants in expressed genes.",
            "Ideal for researching gene regulation, understanding disease mechanisms, and identifying novel biomarkers.",
          ],
        },
        {
          number: "4",
          title: "Low-Pass Genome Sequencing",
          details: [
            "Detect variants at a lower sequencing depth, ideal for large-scale genotyping and population genetics studies.",
            "Suitable for researching genetic diversity, understanding population structure, and identifying novel variants.",
          ],
        },
        {
          number: "5",
          title: "Targeted/Amplicon Sequencing",
          details: [
            "Focus on specific regions of the genome, such as genes or pathways, to identify variants associated with disease.",
            "Ideal for diagnosing genetic disorders, understanding disease mechanisms, and identifying potential therapeutic targets.",
          ],
        },
        {
          number: "6",
          title: "Mitochondrial Genome Sequencing",
          details: [
            "Detect variants in the mitochondrial genome, ideal for researching mitochondrial diseases and understanding energy metabolism.",
          ],
        },
        {
          number: "7",
          title: "Panel-Based Sequencing",
          details: [
            "Analyze a pre-defined set of genes or regions, ideal for diagnosing specific genetic disorders or understanding disease mechanisms.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Variant Detection Services:",
      benefits: [
        "Accurate and reliable variant detection",
        "Comprehensive understanding of genetic variation",
        "Identification of novel variants and biomarkers",
        "Insights into disease mechanisms and potential therapeutic targets",
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
