import { ImageCarousel } from '@/components/carousel/ImageCarousel'
import { GalleryCarousel } from '@/components/carousel/GalleryCarousel'

const galleryImages = [
      {
        src: "/about-img.jpg",
        alt: "With Former Prime Minister Atal Bihari Vajpayee",
        caption: "With Former Prime Minister Atal Bihari Vajpayee"
      },
      {
        src: "/labimg3.jpg",
        alt: "Research Team",
        caption: "Our dedicated research team at work"
      },
      {
        src: "/c6.png",
        alt: "Conference",
        caption: "Representing Genomic Valley at the conference"
      },
      {
        src: "/a2.jpeg",
        alt: "Conference",
        caption: "Genomic Valley at FOG London 2025"
      },
      {
        src: "/labimg11.jpg",
        alt: "Lab Equipments",
        caption: "State of the art lab equipments"
      },
      {
        src: "/a3.jpeg",
        alt: "Conference",
        caption: "Genomic Valley at FOG London 2025"
      },
      {
        src: "/labimg7.jpg",
        alt: "Lab",
        caption: "Lab Infrastructure"
      },
]

function Gallery() {
    return (
        <div className="min-h-screen bg-purple-50">
            {/* Title Section */}
            <div className="w-full px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-purple-600 mb-4">
                        Our Gallery
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Take a virtual tour of our state-of-the-art facilities and see how we're advancing genetic research and patient care.
                    </p>
                </div>

                {/* Full Width Gallery Carousel */}
                <div className="w-full">
                    <GalleryCarousel
                        images={galleryImages}
                        className="w-full max-w-[2000px] mx-auto px-0"
                    />
                </div>
            </div>
        </div>
    )
}

export default Gallery;