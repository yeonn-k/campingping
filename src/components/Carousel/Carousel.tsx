'use client';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';

type CarouselProps = {
  options?: EmblaOptionsType;
  slides: ReactNode[];
};

const Carousel = ({ options, slides }: CarouselProps) => {
  const [emblaRef, embla] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, onSelect]);

  return (
    <div className="w-full relative rounded-md">
      <div className="overflow-hidden relative rounded-md" ref={emblaRef}>
        <div className="flex h-44">
          {slides.map((slide, index) => (
            <div className="w-full relative mx-1" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
