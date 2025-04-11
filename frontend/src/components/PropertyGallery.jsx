/* eslint-disable react/prop-types */
/*
This file helps incorporate web performance optimization by:
1. Optimizing image size and quality
2. Using Web Workers for compression to avoid blocking the main thread
3. Including error handling with fallback to original image
*/

import { useState, useEffect, useCallback } from "react";
import LogoIcon from "../assets/icons/logo.svg";
import { createOptimizedObserver } from "../utils/performance";
import imageCompression from "browser-image-compression";

const Property = ({ name, description, image }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [optimizedImage, setOptimizedImage] = useState(image);
  const [imageRef, setImageRef] = useState(null);

  /* handleImageOptimization: Optimizes image size and quality
  1. Compressing images to max 1MB
  2. Resizing images to max 800px width/height
  3. Using Web Workers for compression to avoid blocking the main thread
  4. Including error handling with fallback to original image
*/
  const handleImageOptimization = useCallback(async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedBlob = await imageCompression(blob, options);
      const optimizedUrl = URL.createObjectURL(compressedBlob);
      setOptimizedImage(optimizedUrl);
    } catch (error) {
      console.error("Image optimization failed:", error);
      setOptimizedImage(imageUrl); // Fallback to original image
    }
  }, []);

  /* useEffect: 
  1.Only loads images when they enter the viewport
  2. Shows a loading placeholder until the image is loaded
  3. Properly cleans up observers to prevent memory leaks
  */
  useEffect(() => {
    if (image && image !== LogoIcon) {
      handleImageOptimization(image);
    }
  }, [image, handleImageOptimization]);

  useEffect(() => {
    const observer = createOptimizedObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsLoading(false);
        }
      });
    });

    if (imageRef) {
      observer.observe(imageRef);
    }

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef]);

  return (
    <div className="property bg-white border border-gray-200 p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="relative w-16 h-16 mb-3">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
        )}
        <img
          ref={setImageRef}
          src={imageError ? LogoIcon : optimizedImage}
          alt={name}
          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
          loading="lazy"
          decoding="async"
          width="64"
          height="64"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const PropertyGallery = () => {
  const properties = [
    {
      name: "Modern Apartment",
      description: "City Center, 3BR/1BA",
      image: LogoIcon,
    },
    {
      name: "Cozy Cottage",
      description: "Suburban Retreat, 2BR/1.5BA",
      image: LogoIcon,
    },
    {
      name: "Beachfront Villa",
      description: "Ocean View, 5BR/3BA",
      image: LogoIcon,
    },
    {
      name: "Urban Loft",
      description: "Downtown Living, 2BR/1BA",
      image: LogoIcon,
    },
    {
      name: "Mountain Chalet",
      description: "Alpine Escape, 4BR/2BA",
      image: LogoIcon,
    },
    {
      name: "Rustic Cabin",
      description: "Secluded Hideaway, 2BR/1BA",
      image: LogoIcon,
    },
    {
      name: "Luxury Penthouse",
      description: "City Skyline Views, 5BR/2.5BA",
      image: LogoIcon,
    },
    {
      name: "Lakefront Retreat",
      description: "Tranquil Waterside Living, 4BR/3BA",
      image: LogoIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {properties.map((property, index) => (
        <Property key={index} {...property} />
      ))}
    </div>
  );
};

export default PropertyGallery;
