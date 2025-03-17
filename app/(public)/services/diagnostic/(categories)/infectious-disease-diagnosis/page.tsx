import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Infectious Disease Diagnosis",
        description: "Rapidly diagnose infectious diseases with our cutting-edge services",
      },
      contentTitle: "Infectious Disease Diagnosis",
      contentDescription: `Rapidly diagnose and manage infectious diseases with our cutting-edge 
  Next-Generation Sequencing (NGS) solutions. Infectious diseases pose a significant threat to 
  global health, and accurate diagnosis is crucial for effective treatment and prevention. 
  Our expert team employs NGS technologies and advanced bioinformatics tools to provide 
  comprehensive infectious disease diagnosis services.`,
      servicesHeading: "Our Infectious Disease Diagnosis Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Pathogen Identification",
          details: [
            "Identify bacterial, viral, fungal, or parasitic pathogens from clinical samples.",
            "Suitable for diagnosing respiratory, gastrointestinal, bloodstream, and other infections.",
          ],
        },
        {
          number: "2",
          title: "Antimicrobial Resistance (AMR) Testing",
          details: [
            "Detect genetic markers of antimicrobial resistance in pathogens.",
            "Ideal for guiding antibiotic treatment and infection control strategies.",
          ],
        },
        {
          number: "3",
          title: "Viral Genotyping and Subtyping",
          details: [
            "Identify viral genotypes and subtypes to inform treatment and prevention strategies.",
            "Suitable for diagnosing viral infections such as HIV, HCV, and influenza.",
          ],
        },
        {
          number: "4",
          title: "Bacterial Strain Typing",
          details: [
            "Identify bacterial strains to inform outbreak investigations and infection control strategies.",
          ],
        },
        {
          number: "5",
          title: "Fungal Identification and Typing",
          details: [
            "Identify fungal pathogens and determine their genetic relatedness.",
          ],
        },
        {
          number: "6",
          title: "Metagenomic Analysis",
          details: [
            "Analyze microbial communities from clinical samples to identify potential pathogens and understand disease mechanisms.",
          ],
        },
        {
          number: "7",
          title: "Infectious Disease Surveillance",
          details: [
            "Monitor infectious disease outbreaks and track the spread of pathogens.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Infectious Disease Diagnosis Services:",
      benefits: [
        "Rapid and accurate diagnosis of infectious diseases",
        "Comprehensive understanding of pathogen genetics and antimicrobial resistance",
        "Informative results for guiding treatment and infection control strategies",
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
