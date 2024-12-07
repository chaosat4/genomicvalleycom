import Link from "next/link"
import Image from "next/image"

export default function Hero() { 
  return (   
    <>
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero-cover.jpg"
          alt="Medical care background"
          width={1200}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-800/60 to-purple-400/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-1 mx-auto max-w-7xl px-4 pt-[25%] sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            You know where to go if you need answers.
          </h1>
          <p className="text-xl text-white/90">
            Genomicvalley is India&apos;s most trusted Next Generation Sequencing diagnostic platform.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 z-20 grid w-full grid-cols-1 divide-x divide-gray-200 border-t border-gray-200 bg-white sm:grid-cols-3">
        <Link
          href="#appointment"
          className="flex items-center justify-between p-4 text-sm hover:bg-gray-50"
        >
          Request an Appointment
          <span className="ml-2">→</span>
        </Link>
        <Link
          href="#search"
          className="flex items-center justify-between p-4 text-sm hover:bg-gray-50"
        >
          Search Diseases & Conditions
          <span className="ml-2">→</span>
        </Link>
        <Link
          href="#locations"
          className="flex items-center justify-between p-4 text-sm hover:bg-gray-50"
        >
          Find Genomicvalley
          <span className="ml-2">→</span>
        </Link>
      </div>
    </section>
    </>
  )
}

