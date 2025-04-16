import Atropos from "atropos/react";
import "atropos/css";
import PropTypes from "prop-types";

// These paths will need to be updated to point to your actual SVG assets
import layer01 from "../assets/layers/layer01.svg";
import layer02 from "../assets/layers/layer02.svg";
import layer03 from "../assets/layers/layer03.svg";

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
            rotateXMax={10}
            rotateYMax={10}
            stretchX={20}
            stretchY={20}
            duration={700}
            activeOffset={40}
          >
            {/* Furthest Background - Gradient Sky */}
            <div className="atropos-banner-spacer" style={{ zIndex: 0 }}></div>
            <div
              className="atropos-banner-bg-shadow"
              style={{
                zIndex: 2,
                backgroundImage:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%)",
              }}
            ></div>

            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-100 to-sky-200"
              data-atropos-offset="-6"
              style={{ zIndex: 2 }}
            ></div>

            {/* Background Layer - Distant Houses and Skyline */}
            <img
              src={layer03}
              alt="Distant cityscape"
              className="w-full h-auto object-cover object-bottom absolute bottom-0 left-0"
              data-atropos-offset="-4"
              style={{ zIndex: 3, transform: "scale(1.2)" }}
            />

            {/* Middle Layer - Medium distance houses */}
            <img
              src={layer02}
              alt="Neighborhood houses"
              className="w-full h-auto object-cover object-bottom absolute bottom-0 left-0"
              data-atropos-offset="-2"
              style={{ zIndex: 4, transform: "scale(1.2)" }}
            />

            {/* Foreground Layer - Close houses */}
            <img
              src={layer01}
              alt="Foreground houses"
              className="w-full h-auto object-cover object-bottom absolute bottom-0 left-0"
              data-atropos-offset="0"
              style={{ zIndex: 5, transform: "scale(1.2)" }}
            />

            {/* Hero Content / Text Overlay */}
            <div
              className="relative z-10 flex flex-col items-center justify-center h-full py-16 text-center"
              data-atropos-offset="5"
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
          height: 600px;
          margin: 0 auto;
          position: relative;
          perspective: 1200px;
        }
        
        .atropos-banner-spacer {
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }
        
        .atropos-banner-bg-shadow {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .atropos-banner {
            height: 500px;
          }
        }
        
        @media (max-width: 640px) {
          .atropos-banner {
            height: 400px;
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
