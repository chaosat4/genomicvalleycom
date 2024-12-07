import { Button } from "@/components/ui/button"
import { Microscope, BarChart3, Heart, Home } from 'lucide-react'
import { FeatureCardProps } from "@/types"

function Features() {
  return (
    <section>
      {/* Top separator */}
      <div className="container">
        <div className="w-full h-px bg-gray-200 mb-16"></div>
      </div>

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="mb-12 max-w-lg">
          <h2 className="text-6xl tracking-tight sm:text-5xl">
            Why Choose Genomicvalley?
          </h2>
          <Button
            variant="secondary"
            className="mt-6 bg-purple-600 text-white hover:bg-purple-700"
          >
            Learn More about Genomicvalley
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:gap-12 relative">
          <FeatureCard
            icon={<Microscope className="w-8 h-8 mb-4 text-purple-600" />}
            title="Advanced Analysis"
            description="State-of-the-art genomic analysis tools powered by cutting-edge algorithms and machine learning."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 mb-4 text-purple-600" />}
            title="Data Visualization"
            description="Interactive and intuitive visualization tools to help you understand complex genomic data."
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8 mb-4 text-purple-600" />}
            title="Healthcare Integration"
            description="Seamless integration with healthcare systems for improved patient care and research outcomes."
          />
          <FeatureCard
            icon={<Home className="w-8 h-8 mb-4 text-purple-600" />}
            title="User-Friendly Platform"
            description="Easy-to-use interface designed for both researchers and healthcare professionals."
          />
        </div>
      </div>

      {/* Bottom separator */}
      <div className="container">
        <div className="w-full h-px bg-gray-200 mt-10 mb-6 "></div>
      </div>
    </section>
  );
}



function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {icon}
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Features;