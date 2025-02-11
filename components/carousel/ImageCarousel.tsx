'use client';

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'

type ImageType = {
  src: string
  alt: string
  caption?: string
}

interface ImageCarouselProps {
  images: ImageType[]
  options?: EmblaOptionsType
  className?: string
  aspectRatio?: "square" | "video" | "wide"
  showDots?: boolean
  showArrows?: boolean
  showCaption?: boolean
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]"
}

export function ImageCarousel({
  images,
  options = { loop: true },
  className = "",
  aspectRatio = "video",
  showDots = true,
  showArrows = true,
  showCaption = false
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className={`embla ${className}`}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div className="embla__slide" key={index}>
              <div className={`relative w-full ${aspectRatioClasses[aspectRatio]}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {showCaption && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <p className="text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <div className="embla__buttons absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      )}

      {showDots && (
        <div className="embla__dots flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={
                index === selectedIndex 
                  ? "w-6 bg-purple-600" 
                  : "bg-gray-300"
              }
            />
          ))}
        </div>
      )}
    </div>
  )
} 