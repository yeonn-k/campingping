'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { CampImage } from '@/assets/types/Camp';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselProps {
  images: CampImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const slideInit = images.length <= 1 ? 0 : 1;

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: slideInit,
  };

  return (
    <div className="slider-container w-[350px] rounded-[5px]">
      {images && (
        <Slider {...settings}>
          {images.map((image) => (
            <Image
              className="rounded-[5px]"
              key={image.id}
              src={image.url}
              width={350}
              height={250}
              alt="Camp Image"
            />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Carousel;
