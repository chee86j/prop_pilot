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
import Atropos from "atropos/react";
import "atropos/css";

const Property = ({ name, description, image }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [optimizedImage, setOptimizedImage] = useState(image);
  const [imageRef, setImageRef] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);

  /* handleImageOptimization: Optimizes image size and quality
  1. Compressing images to max 1MB
  2. Resizing images to max 800px width/height
  3. Using Web Workers for compression to avoid blocking the main thread
  4. Including error handling with fallback to original image
*/
  const handleImageOptimization = useCallback(
    async (imageUrl) => {
      // Clean up previous blob URL if it exists
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }

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
        setBlobUrl(optimizedUrl);
        setOptimizedImage(optimizedUrl);
      } catch (error) {
        console.error("Image optimization failed:", error);
        setOptimizedImage(imageUrl); // Fallback to original image
      }
    },
    [blobUrl]
  );

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

  // Clean up blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  return (
    <Atropos
      className="atropos-property"
      shadow={true}
      shadowScale={1.05}
      rotateXMax={5}
      rotateYMax={5}
      duration={300}
    >
      {/* Moving background layer that creates the 3D effect */}
      <div
        className="absolute inset-0 bg-white border border-gray-200 rounded-lg shadow-md"
        data-atropos-offset="0"
      ></div>

      {/* Shadow gradients - subtle decoration elements */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-5 rounded-tr-lg"
        data-atropos-offset="-2"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(255,255,255,0) 70%)`,
          transform: `translate(30%, -30%)`,
          pointerEvents: "none",
        }}
      ></div>

      {/* Stable content layer - won't move with 3D effect */}
      <div className="property p-6 rounded-lg atropos-inner property-content relative flex flex-col items-center">
        <div className="property-image relative mb-3" data-atropos-offset="5">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
          )}
          <img
            ref={setImageRef}
            src={imageError ? LogoIcon : optimizedImage}
            alt={name}
            className={`w-16 h-16 object-cover rounded-lg transition-opacity duration-300 ${
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

        {/* Decorative corner element */}
        <div
          className="absolute bottom-0 left-0 w-12 h-12 opacity-10 rounded-bl-lg"
          data-atropos-offset="-1"
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(255,255,255,0) 70%)`,
            transform: `translate(-30%, 30%)`,
            pointerEvents: "none",
          }}
        ></div>
      </div>
    </Atropos>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {properties.map((property, index) => (
        <Property key={index} {...property} />
      ))}
    </div>
  );
};

export default PropertyGallery;
