'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { CampImage } from '@/types/Camp';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DefaultImg from '@components/DefaultImg/DefaultImg';

interface CarouselProps {
  images: CampImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const MAX_IMAGES = 10;
  const validImages =
    Array.isArray(images) && images.length > 0
      ? images.slice(0, MAX_IMAGES).map((image) => ({
          ...image,
          url: image.url || null,
        }))
      : [];

  const isSliderEnabled = validImages.length > 1;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    lazyLoad: 'ondemand' as const,
  };

  return (
    <div className="slider-container w-full rounded-[5px]">
      {isSliderEnabled ? (
        <Slider {...settings}>
          {validImages.map((image, index) => (
            <div key={image.id || `default-${index}`}>
              {image.url ? (
                <Image
                  className="rounded-[5px] justify-items-stretch"
                  src={image.url}
                  width={350}
                  height={350}
                  alt="Camp Image"
                />
              ) : (
                <DefaultImg />
              )}
            </div>
          ))}
        </Slider>
      ) : validImages.length === 1 && validImages[0].url ? (
        <Image
          className="rounded-[5px] justify-items-stretch"
          key={validImages[0].id || 'default'}
          src={validImages[0].url}
          width={350}
          height={350}
          alt="Camp Image"
        />
      ) : (
        <DefaultImg />
      )}
    </div>
  );
};

export default Carousel;
