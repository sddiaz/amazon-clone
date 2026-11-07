"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const AmazonCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    {
      src: "/ranked-ad.jpg",
      alt: "Ranked Advertisement"
    },
    {
      src: "/new-deals-ad.jpg",
      alt: "New Deals Advertisement"
    },
    {
      src: "/ryze-ad.jpg",
      alt: "Ryze Advertisement"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 500); // Half of our transition duration
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] lg:h-[600px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            currentImageIndex === index
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            className="object-cover"
            fill
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-40% to-[var(--amazonGrey)]" />
        </div>
      ))}
    </div>
  );
};

export default AmazonCarousel;