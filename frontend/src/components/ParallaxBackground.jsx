import Atropos from "atropos/react";
import "atropos/css";
import PropTypes from "prop-types";

// These paths will need to be updated to point to your actual SVG assets
import layer01 from "../assets/layers/layer01.png";
import layer02 from "../assets/layers/layer02.png";
import layer03 from "../assets/layers/layer03.png";

const ParallaxBackground = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Hero Section with Parallax Background */}
      <div className="relative w-full z-0 mb-12">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Atropos
            className="atropos-banner"
            highlight={true}
            shadow={true}
            shadowScale={1.05}
            rotateXMax={22}
            rotateYMax={22}
            stretchX={45}
            stretchY={45}
            duration={700}
            activeOffset={90}
          >
            {/* Container for maintaining aspect ratio */}
            <div className="atropos-banner-spacer"></div>

            {/* Background shadow */}
            <div
              className="atropos-banner-bg-shadow"
              style={{
                zIndex: 2,
                backgroundImage:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%)",
              }}
            ></div>

            {/* Sky gradient background */}
            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-100 to-sky-200"
              data-atropos-offset="-20"
              style={{ zIndex: 2 }}
            ></div>

            {/* Background Layer - Distant Houses and Skyline */}
            <div className="absolute inset-x-0 bottom-0 w-full" style={{ zIndex: 3 }}>
              <img
                src={layer03}
                alt="Distant cityscape"
                className="w-full h-auto"
                data-atropos-offset="-15"
                style={{ transform: "scale(1.7)", transformOrigin: "bottom" }}
              />
            </div>

            {/* Middle Layer - Medium distance houses */}
            <div className="absolute inset-x-0 bottom-0 w-full" style={{ zIndex: 4 }}>
              <img
                src={layer02}
                alt="Neighborhood houses"
                className="w-full h-auto"
                data-atropos-offset="-8"
                style={{ transform: "scale(1.35)", transformOrigin: "bottom" }}
              />
            </div>

            {/* Foreground Layer - Close houses */}
            <div className="absolute inset-x-0 bottom-0 w-full" style={{ zIndex: 5 }}>
              <img
                src={layer01}
                alt="Foreground houses"
                className="w-full h-auto"
                data-atropos-offset="0"
                style={{ transform: "scale(1.0)", transformOrigin: "bottom" }}
              />
            </div>

            {/* Hero Content / Text Overlay */}
            <div
              className="relative z-10 flex flex-col items-center justify-center py-16 text-center"
              data-atropos-offset="12"
              style={{ zIndex: 10 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4">
                Property Investment Platform
              </h1>
              <p className="text-xl md:text-2xl text-white drop-shadow-md max-w-3xl">
                Analyze, manage, and optimize your real estate investments with
                our powerful tools
              </p>
            </div>
          </Atropos>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 bg-white rounded-t-3xl -mt-6 shadow-lg">
        {children}
      </div>

      {/* Custom styles for the Atropos banner */}
      <style>{`
        .atropos-banner {
          width: 100%;
          height: auto;
          margin: 0 auto;
          position: relative;
          perspective: 1800px;
        }
        
        .atropos-banner-spacer {
          width: 100%;
          padding-top: 66.67%; /* 3:2 Aspect ratio */
          position: relative;
        }
        
        .atropos-banner-bg-shadow {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* Ensure all image containers maintain proper sizing */
        .atropos-banner > div:not(.atropos-banner-spacer):not(.atropos-banner-bg-shadow) {
          position: absolute;
          width: 100%;
          height: auto;
          bottom: 0;
          left: 0;
          right: 0;
        }

        /* Ensure images within containers fit properly */
        .atropos-banner img {
          display: block;
          width: 100%;
          height: auto;
          max-width: 100%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .atropos-banner-spacer {
            padding-top: 75%; /* 4:3 Aspect ratio for tablets */
          }
          .atropos-banner {
            perspective: 1600px;
          }
        }
        
        @media (max-width: 640px) {
          .atropos-banner-spacer {
            padding-top: 100%; /* 1:1 Aspect ratio for mobile */
          }
          .atropos-banner {
            perspective: 1400px;
          }
        }
      `}</style>
    </div>
  );
};

ParallaxBackground.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ParallaxBackground;
