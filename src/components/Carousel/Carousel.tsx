'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { CampImage } from '@/assets/types/Camp';

interface CarouselProps {
  images: CampImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="slider-container w-full">
      {images && (
        <Slider {...settings}>
          {images.map((image) => (
            <div key={image.id}>
              <Image
                src={image.url}
                width={300}
                height={200}
                alt="Camp Image"
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Carousel;
