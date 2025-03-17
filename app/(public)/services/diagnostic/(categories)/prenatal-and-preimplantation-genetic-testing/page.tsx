import React from "react"


export const SERVICES_PAGE_CONTENT = {
    mainContent: {
      leftBox: {
        title: "Prenatal and Preimplantation Genetic Testing",
        description: "Make informed reproductive choices with our genetic testing services",
      },
      contentTitle: "Prenatal and Preimplantation Genetic Testing",
      contentDescription: `Empower informed reproductive decisions with our comprehensive prenatal 
  and preimplantation genetic testing services. Our expert team employs cutting-edge 
  Next-Generation Sequencing (NGS) technologies and advanced bioinformatics tools to provide 
  accurate and reliable genetic testing results.`,
      
      // First section: Prenatal Genetic Testing
      servicesHeading: "Our Prenatal Genetic Testing Services Include:",
      servicesList: [
        {
          number: "1",
          title: "Non-Invasive Prenatal Testing (NIPT)",
          details: [
            "Analyze cell-free DNA (cfDNA) from maternal blood to detect chromosomal abnormalities, such as Down syndrome.",
          ],
        },
        {
          number: "2",
          title: "Chorionic Villus Sampling (CVS) Testing",
          details: [
            "Analyze placental tissue to detect chromosomal abnormalities and genetic disorders.",
          ],
        },
        {
          number: "3",
          title: "Amniocentesis Testing",
          details: [
            "Analyze amniotic fluid to detect chromosomal abnormalities and genetic disorders.",
          ],
        },
      ],
      
      // Second section: Preimplantation Genetic Testing
      preimplantationHeading: "Our Preimplantation Genetic Testing Services Include:",
      preimplantationList: [
        {
          number: "1",
          title: "Preimplantation Genetic Screening (PGS)",
          details: [
            "Analyze embryos for chromosomal abnormalities, such as aneuploidy, to select healthy embryos for transfer.",
          ],
        },
        {
          number: "2",
          title: "Preimplantation Genetic Diagnosis (PGD)",
          details: [
            "Analyze embryos for specific genetic disorders, such as cystic fibrosis or sickle cell anemia, to select healthy embryos for transfer.",
          ],
        },
        {
          number: "3",
          title: "Preimplantation Genetic Testing for Aneuploidy (PGT-A)",
          details: [
            "Analyze embryos for chromosomal abnormalities, such as aneuploidy, to select healthy embryos for transfer.",
          ],
        },
        {
          number: "4",
          title: "Preimplantation Genetic Testing for Monogenic Disorders (PGT-M)",
          details: [
            "Analyze embryos for specific genetic disorders, such as muscular dystrophy or Huntington's disease, to select healthy embryos for transfer.",
          ],
        },
      ],
      
      benefitsHeading: "Benefits of Our Prenatal and Preimplantation Genetic Testing Services:",
      benefits: [
        "Accurate and reliable genetic testing results",
        "Informed reproductive decisions and reduced risk of genetic disorders",
        "Expert genetic counseling and support",
        "Customized solutions for specific reproductive needs and goals",
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
