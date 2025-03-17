import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Rare Genetic Disorders",
        description: "Diagnose and manage rare genetic disorders with our expert services",
      },
      contentTitle: "Rare Genetic Disorders",
      contentDescription: `Unlock the genetic secrets of rare diseases with our comprehensive genetic testing services. 
  Rare genetic disorders affect millions of people worldwide, and identifying the underlying genetic cause 
  is crucial for diagnosis, treatment, and management. Our expert team employs cutting-edge Next-Generation 
  Sequencing (NGS) technologies and advanced bioinformatics tools to provide accurate and reliable genetic 
  testing results.`,
      servicesHeading: "Our Rare Genetic Disorders Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Mendelian Disorders",
          details: [
            "Identify genetic variants associated with single-gene disorders, such as cystic fibrosis, sickle cell anemia, and muscular dystrophy.",
          ],
        },
        {
          number: "2",
          title: "Complex Genetic Disorders",
          details: [
            "Analyze genetic variants associated with complex diseases, such as autism spectrum disorder, epilepsy, and intellectual disability.",
          ],
        },
        {
          number: "3",
          title: "Genetic Panel Testing",
          details: [
            "Choose from pre-designed panels or create custom panels to test for specific genetic disorders.",
          ],
        },
        {
          number: "4",
          title: "Whole Exome Sequencing (WES)",
          details: [
            "Analyze the protein-coding regions of the genome to identify genetic variants associated with rare diseases.",
          ],
        },
        {
          number: "5",
          title: "Whole Genome Sequencing (WGS)",
          details: [
            "Analyze the entire genome to identify genetic variants associated with rare diseases.",
          ],
        },
        {
          number: "6",
          title: "Mitochondrial Genome Analysis",
          details: [
            "Identify genetic variants associated with mitochondrial disorders, such as mitochondrial myopathies and neurodegenerative diseases.",
          ],
        },
        {
          number: "7",
          title: "Copy Number Variation (CNV) Analysis",
          details: [
            "Identify changes in gene copy number associated with rare genetic disorders.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Rare Genetic Disorders Services:",
      benefits: [
        "Accurate and reliable genetic testing results",
        "Comprehensive understanding of the genetic basis of rare diseases",
        "Identification of potential therapeutic targets and treatment options",
        "Expert genetic counseling and support",
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
