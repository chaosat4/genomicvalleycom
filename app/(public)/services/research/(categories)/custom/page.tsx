import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Customized as per need",
        description: "Explore the depth of customized NGS services as per your need",
      },
      contentTitle: "Customized Options tailored to your needs",
      contentDescription: `Tailor our services to your specific research needs with our customized options. 
  Our expert team will work with you to design a customized solution that meets your unique requirements.`,
      servicesHeading: "Customize Your Project:",
      servicesList: [
        {
          number: "1",
          title: "Optional Genome",
          details: [
            "Choose from a variety of genomes, including human, mouse, plant, or microbial genomes.",
            "Specify specific genome builds or assemblies.",
          ],
        },
        {
          number: "2",
          title: "Data Needed",
          details: [
            "Determine the type and amount of data required for your project.",
            "Choose from various data formats, such as FASTQ, BAM, or VCF.",
          ],
        },
        {
          number: "3",
          title: "Sequencer Instrument",
          details: [
            "Select from a range of sequencing platforms, including Illumina, Oxford Nanopore, or PacBio.",
            "Specify the desired sequencing depth, read length, and coverage.",
          ],
        },
        {
          number: "4",
          title: "Analysis Options",
          details: [
            "Choose from various analysis pipelines, including gene expression, variant detection, or metagenomics.",
            "Select specific bioinformatics tools and software.",
          ],
        },
        {
          number: "5",
          title: "Interpretation and Reporting",
          details: [
            "Determine the level of interpretation and reporting required for your project.",
            "Choose from various report formats, including written reports, data visualizations, or oral presentations.",
          ],
        },
      ],
      additionalCustomizationHeading: "Additional Customization Options:",
      additionalCustomizationList: [
        "Custom Primer Design: Design custom primers for targeted sequencing applications.",
        "Sample Preparation: Choose from various sample preparation methods, including DNA extraction, library preparation, or PCR amplification.",
        "Data Storage and Transfer: Specify data storage and transfer requirements, including cloud storage, FTP transfer, or hard drive shipment.",
      ],
      benefitsHeading: "Benefits of Customized Options:",
      benefits: [
        "Tailored solutions to meet specific research needs",
        "Increased efficiency and cost-effectiveness",
        "Expert guidance and support throughout the project",
        "High-quality data and analysis results",
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
