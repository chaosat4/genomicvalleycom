import Image from "next/image"

const alternatingFeaturesData = [
  {
    title: "Where Innovation Meets Expertise",
    description:
      "At Genomic Valley Bharat Pvt Ltd, we combine over 10 years of experience in Next-Generation Sequencing (NGS), oncology, and AI to propel healthcare forward. Our dedicated team implements both novel and validated methods, ensuring accurate and confident results in our quest for better healthcare outcomes.",
    image: "/c5.png",
    alt: "Team of biotech experts"
  },
  {
    title: "A Vision for India's Genomics Future",
    description:
      "Inspired by the dream of former Prime Minister Shri Atal Bihari Vajpayee to create a Silicon Valley of genomics in India, we are on a mission to establish Genomics Valley as a global epicenter for cutting-edge research, diagnostics, and healthcare solutions.",
    image: "/c6.png",
    alt: "Illustration of India's roadmap for genomic innovation"
  },
  {
    title: "Advancing Oncology with AI & IT",
    description:
      "By leveraging artificial intelligence and information technology, Genomic Valley Bharat Limited enhances the precision, efficiency, and effectiveness of oncology diagnostics and research. Our goal is to contribute to a healthier future for all through transformative, technology-driven solutions.",
    image: "/labimg3.jpg",
    alt: "AI-based oncology diagnostics"
  },
  {
    title: "Our Vision for Molecular Diagnostics",
    description:
      "We aim to usher in a new era of precision and efficiency by integrating novel AI-based approaches in molecular diagnostics. Through faster, more accurate results and comprehensive metadata, doctors receive robust support for decision-making, enabling personalized therapy options for patients worldwide.",
    image: "/labimg1.jpg",
    alt: "High-tech molecular diagnostics process"
  },
  {
    title: "Comprehensive Research Process Outsourcing (RPO)",
    description:
      "Our commitment extends to global researchers through tailored RPO services. With access to professional software tools and a dedicated team of experts, we refine data analysis to deliver optimal solutions, driving innovation and excellence in healthcare research.",
    image: "/a2.jpeg",
    alt: "Researchers collaborating on data analysis"
  }
];

const AlternatingFeatures = () => {
  return (
    <section className="py-24 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {alternatingFeaturesData.map((feature, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center mb-24 last:mb-0`}
          >
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            </div>
            <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
              <h2 className="text-3xl font-bold text-purple-700 mb-4">{feature.title}</h2>
              <p className="text-lg text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AlternatingFeatures

