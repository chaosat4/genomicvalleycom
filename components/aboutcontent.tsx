import Image from "next/image"

const alternatingFeaturesData = [
    {
      title: "Innovative Solutions",
      description: "Our cutting-edge technology provides innovative solutions to complex business problems, helping you stay ahead in a rapidly evolving market.",
      image: "/placeholder.svg",
      alt: "Innovative business solutions visualization"
    },
    {
      title: "Expert Consultation",
      description: "Our team of industry experts offers personalized consultation to help you make informed decisions and optimize your business strategies.",
      image: "/placeholder.svg",
      alt: "Expert team in a consultation meeting"
    },
    {
      title: "Scalable Infrastructure",
      description: "We provide scalable infrastructure solutions that grow with your business, ensuring you're always prepared for the next big opportunity.",
      image: "/placeholder.svg",
      alt: "Scalable infrastructure diagram"
    }
  ]

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

