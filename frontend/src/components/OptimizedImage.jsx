import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  className = "",
  onLoad,
  placeholder = "blur",
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const optimizeImage = async () => {
      let createdBlobUrl = null;
      try {
        setIsLoading(true);

        // Skip optimization for SVGs and data URLs
        if (src.startsWith("data:") || src.endsWith(".svg")) {
          setImageSrc(src);
          return null;
        }

        // Create a blob from the image URL
        const response = await fetch(src);
        const blob = await response.blob();

        // Compression options
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: Math.max(width || 800, height || 800),
          useWebWorker: true,
          quality: quality / 100,
        };

        const compressedBlob = await imageCompression(blob, options);
        const optimizedUrl = URL.createObjectURL(compressedBlob);
        createdBlobUrl = optimizedUrl;

        if (isMounted) {
          setImageSrc(optimizedUrl);
          setIsLoading(false);
        }
        
        return optimizedUrl;
      } catch (err) {
        console.error("Image optimization failed:", err);
        if (isMounted) {
          setError(err);
          setImageSrc(src); // Fallback to original source
          setIsLoading(false);
        }
        return null;
      }
    };

    let blobUrl;
    
    optimizeImage().then(url => {
      blobUrl = url;
    });

    return () => {
      isMounted = false;
      // Properly revoke any blob URLs created
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src, width, height, quality]);

  const handleLoad = (e) => {
    // Add performance mark
    performance.mark(`img-loaded-${src}`);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    console.error("Image loading failed:", e);
    setError(e);
    setIsLoading(false);
  };

  // Blur placeholder style
  const blurStyle =
    isLoading && placeholder === "blur"
      ? {
          filter: "blur(20px)",
          transition: "filter 0.3s ease-out",
        }
      : {};

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && placeholder === "blur" && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"}`}
        style={{
          ...blurStyle,
          transition: "opacity 0.3s ease-out",
          objectFit: "cover",
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500">
          Error loading image
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
