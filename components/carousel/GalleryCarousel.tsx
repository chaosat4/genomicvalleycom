'use client';

import React, { useState, useCallback, useEffect } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'

type ImageType = {
  src: string
  alt: string
  caption?: string
}

interface GalleryCarouselProps {
  images: ImageType[]
  options?: EmblaOptionsType
  className?: string
}

const thumbOptions: EmblaOptionsType = {
  containScroll: 'keepSnaps',
  dragFree: true,
}

export function GalleryCarousel({
  images,
  options = { loop: true },
  className = ""
}: GalleryCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mainViewportRef, mainEmblaApi] = useEmblaCarousel(options)
  const [thumbViewportRef, thumbEmblaApi] = useEmblaCarousel(thumbOptions)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(mainEmblaApi)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmblaApi || !thumbEmblaApi) return
      mainEmblaApi.scrollTo(index)
    },
    [mainEmblaApi, thumbEmblaApi]
  )

  const onSelect = useCallback(() => {
    if (!mainEmblaApi || !thumbEmblaApi) return
    setSelectedIndex(mainEmblaApi.selectedScrollSnap())
    thumbEmblaApi.scrollTo(mainEmblaApi.selectedScrollSnap())
  }, [mainEmblaApi, thumbEmblaApi])

  useEffect(() => {
    if (!mainEmblaApi) return
    onSelect()
    mainEmblaApi.on('select', onSelect)
  }, [mainEmblaApi, onSelect])

  return (
    <div className={className}>
      <div className="relative mb-4">
        <div className="embla w-full max-w-none">
          <div className="embla__viewport" ref={mainViewportRef}>
            <div className="embla__container">
              {images.map((image, index) => (
                <div className="embla__slide" key={index}>
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                        <p className="text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="embla__buttons absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </div>
      </div>

      <div className="embla-thumbs max-w-[2000px] mx-auto px-4">
        <div className="embla-thumbs__viewport" ref={thumbViewportRef}>
          <div className="embla-thumbs__container flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`relative flex-0 min-w-[150px] aspect-video ${
                  index === selectedIndex 
                    ? 'ring-2 ring-purple-600' 
                    : 'ring-1 ring-gray-200'
                }`}
                type="button"
              >
                <Image
                  src={image.src}
                  alt={`${image.alt} thumbnail`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 