'use client';
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { CampImage } from '@/types/Camp';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselProps {
  images: CampImage[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const defaultImage = {
    id: 'noimage',
    url: '/images/noImg.png?v=1',
  };

  const MAX_IMAGES = 10;
  const validImages = Array.isArray(images) && images.length > 0
    ? images.slice(0, MAX_IMAGES).map((image) => ({
        ...image,
        url: image.url || defaultImage.url, // 이미지 URL이 없으면 기본 URL 사용
      }))
    : [defaultImage];

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
          {validImages.map((image) => (
            <div key={image.id || 'default'}>
              <Image
                className="rounded-[5px] justify-items-stretch"
                src={image.url}
                width={350}
                height={350}
                alt="Camp Image"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <Image
          className="rounded-[5px] justify-items-stretch"
          key={validImages[0].id || 'default'}
          src={validImages[0].url}
          width={350}
          height={350}
          alt="Camp Image"
        />
      )}
    </div>
  );
};

export default Carousel;
