import Image from "next/image";
import React from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Banner = () => {
  return (
    <div className="w-full p-2 mt-2">
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false} showStatus={false}>
        <div className="h-full w-full">
          <Image width={400} height={400} src="/carousel1.jpeg" alt="Logo 1" className="h-[5.5rem] rounded-xl" />
        </div>
        <div className="h-full w-full">
          <Image width={400} height={400} src="/carousel2.jpeg" alt="Logo 2" className="h-[5.5rem] rounded-xl" />
        </div>
        <div className="h-full w-full">
          <Image width={400} height={400} src="/carousel3.png" alt="Logo 3" className="h-[5.5rem] rounded-xl" />
        </div>
        <div className="h-full w-full">
          <Image width={400} height={400} src="/carousel4.png" alt="Logo 3" className="h-[5.5rem] rounded-xl" />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;