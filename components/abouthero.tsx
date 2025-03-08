import Link from "next/link"
import Image from "next/image"

export default function Hero() { 
  return (   
    <>
    <section className="relative h-[600px] bg-purple-50 w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/about-img.jpg"
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
          <h1 className="text-4xl font-bold tracking-tight text-amber-100 sm:text-5xl md:text-6xl">
            IT is India Today, <br /> BT is Bharat Tomorrow!
          </h1>
          <p className="text-xl text-amber-100">
            Genomic Valley is India&apos;s most trusted Next Generation Sequencing diagnostic platform.
          </p>
        </div>
      </div>
    </section>
    </>
  )
}

