import React from "react"


const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Transplantation Genetics",
        description: "Optimize transplant outcomes with our comprehensive genetic testing services",
      },
      contentTitle: "Transplantation Genetics",
      contentDescription: `Optimize transplant outcomes with our comprehensive transplantation genetics services. 
  Transplantation genetics involves the study of genetic factors that influence transplant success, 
  including human leukocyte antigen (HLA) matching and non-HLA genetic markers. Our expert team employs 
  cutting-edge Next-Generation Sequencing (NGS) technologies and advanced bioinformatics tools to provide 
  accurate and reliable transplantation genetics results.`,
      servicesHeading: "Our Transplantation Genetics Services Include:",
      servicesList: [
        {
          number: "1",
          title: "HLA Typing",
          details: [
            "Determine HLA genotypes and alleles to match donors and recipients for organ and bone marrow transplants.",
            "Suitable for solid organ transplantation, hematopoietic stem cell transplantation, and cord blood banking.",
          ],
        },
        {
          number: "2",
          title: "HLA Sequencing",
          details: [
            "Sequence HLA genes to identify specific alleles and variants associated with transplant outcomes.",
          ],
        },
        {
          number: "3",
          title: "Non-HLA Genetic Marker Analysis",
          details: [
            "Analyze non-HLA genetic markers associated with transplant rejection, graft-versus-host disease (GVHD), and other transplant-related complications.",
          ],
        },
        {
          number: "4",
          title: "Donor-Recipient Matching",
          details: [
            "Use HLA and non-HLA genetic data to match donors and recipients for optimal transplant outcomes.",
          ],
        },
        {
          number: "5",
          title: "Transplant Risk Assessment",
          details: [
            "Evaluate genetic risk factors for transplant-related complications, including rejection, GVHD, and post-transplant lymphoproliferative disorders (PTLD).",
          ],
        },
        {
          number: "6",
          title: "Post-Transplant Monitoring",
          details: [
            "Monitor genetic markers for transplant rejection, GVHD, and other complications to optimize patient care.",
          ],
        },
      ],
      benefitsHeading: "Benefits of Our Transplantation Genetics Services:",
      benefits: [
        "Accurate and reliable HLA typing and genetic marker analysis",
        "Improved transplant outcomes through optimized donor-recipient matching",
        "Personalized risk assessment and post-transplant monitoring",
        "Expert bioinformatics analysis and support",
        "Customized solutions for specific transplant programs and research applications",
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
