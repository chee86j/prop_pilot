/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Testimonials from "./Testimonials";
import PropertyGallery from "./PropertyGallery";
import { fetchUserProfile, persistAvatarData } from "../utils/user";
import planeIcon from "../assets/icons/plane.svg";
import LogoIcon from "../assets/icons/logo.svg";
import Atropos from "atropos/react";
import "atropos/css";
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaTools,
  FaClipboardCheck,
  FaFileContract,
  FaSearchDollar,
  FaDatabase,
  FaMobileAlt,
} from "react-icons/fa";

// Extracting Hero section into a separate component
const HeroSection = ({ user, showFallbackAvatar, setShowFallbackAvatar }) => {
  const [processedAvatarUrl, setProcessedAvatarUrl] = useState(null);

  // Process the avatar URL when user data changes
  useEffect(() => {
    const processAvatar = async () => {
      if (user?.avatar) {
        try {
          // Convert any avatar URL to base64 for consistent display
          const persistedUrl = await persistAvatarData(user.avatar);
          setProcessedAvatarUrl(persistedUrl);
          setShowFallbackAvatar(false);
        } catch (error) {
          console.error("Failed to process avatar:", error);
          setProcessedAvatarUrl(null);
          setShowFallbackAvatar(true);
        }
      } else {
        setProcessedAvatarUrl(null);
        setShowFallbackAvatar(true);
      }
    };

    processAvatar();
  }, [user?.avatar, setShowFallbackAvatar]);

  return (
    <div className="hero-section bg-white shadow-lg rounded-lg text-center p-6 md:p-10 mb-6 md:mb-10">
      <div className="inline-block">
        {!showFallbackAvatar && processedAvatarUrl ? (
          <img
            src={processedAvatarUrl}
            alt={`${user?.first_name || "User"}'s profile picture`}
            className="inline-block rounded-full align-middle object-cover"
            style={{
              width: "clamp(60px, 12vw, 80px)",
              height: "clamp(60px, 12vw, 80px)",
              marginRight: "12px",
            }}
            onError={() => setShowFallbackAvatar(true)}
          />
        ) : (
          <svg
            className="inline-block w-16 h-16 text-gray-400 align-middle"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ marginRight: "12px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-0">
        Welcome{" "}
        <span className="italic text-green-500">
          {user ? `${user.first_name} ${user.last_name}` : "Guest"}
        </span>{" "}
        to Prop Pilot
        <img
          src={LogoIcon}
          alt="Logo"
          className="inline-block align-middle mr-2"
          style={{ width: "68px", height: "68px" }}
        />
        <br />
        REI Property Management System
      </h1>
      <p className="text-gray-600 text-lg my-5">
        Streamline your property management with our advanced tools and
        services.
      </p>
      <Link
        to={user && !user.isGuest ? "/propertylist" : "/authform"}
        className="custom-button"
      >
        <img
          src={planeIcon}
          alt="Plane"
          className="mr-2"
          style={{ width: "24px", height: "24px" }}
        />
        <span>{user && !user.isGuest ? "Portfolio" : "Get Started"}</span>
      </Link>
    </div>
  );
};

// Features component with hover effect and consistent styling
const FeatureCard = ({ title, description, index }) => {
  // Array of icons for each feature
  const icons = [
    FaHome,
    FaChartLine,
    FaUsers,
    FaTools,
    FaClipboardCheck,
    FaFileContract,
    FaSearchDollar,
    FaDatabase,
    FaMobileAlt,
  ];

  // Get the icon component based on index
  const IconComponent = icons[index % icons.length];

  return (
    <Atropos
      className="atropos-feature"
      shadow={true}
      shadowScale={1.05}
      rotateXMax={6}
      rotateYMax={6}
      duration={300}
    >
      {/* Moving background layer that creates the 3D effect */}
      <div
        className="absolute inset-0 bg-gray-50 rounded-lg shadow-sm"
        data-atropos-offset="0"
      ></div>

      {/* Shadow gradients - these move with the 3D effect */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-tr-lg"
        data-atropos-offset="-2"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(255,255,255,0) 70%)`,
          transform: `translate(30%, -30%)`,
          pointerEvents: "none",
        }}
      ></div>

      <div
        className="absolute bottom-0 left-0 w-16 h-16 opacity-10 rounded-bl-lg"
        data-atropos-offset="-1"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(255,255,255,0) 70%)`,
          transform: `translate(-30%, 30%)`,
          pointerEvents: "none",
        }}
      ></div>

      {/* Stable content layer - won't move with 3D effect */}
      <div className="feature p-6 rounded-lg atropos-inner feature-content relative">
        {/* Icon */}
        <div className="text-blue-500 mb-4">
          <IconComponent size={28} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-3">{title}</h3>

        {/* Description */}
        <p>{description}</p>
      </div>
    </Atropos>
  );
};

// Features section component
const FeaturesSection = () => {
  const features = [
    {
      title: "Property Tracking",
      description:
        "Keep track of all your properties in one place. Monitor status, documents, and financials with ease.",
    },
    {
      title: "Financial Management",
      description:
        "Effortlessly manage rent, expenses, and revenue. Generate financial reports with a few clicks.",
    },
    {
      title: "Tenant Communication",
      description:
        "Communicate with tenants directly through the platform for maintenance requests and notifications.",
    },
    {
      title: "Scope of Work Management",
      description:
        "Track renovation projects with detailed scope-of-work management, including contractor assignments and cost estimations.",
    },
    {
      title: "Inspection Tracking",
      description:
        "Manage critical inspection phases during renovations to ensure compliance and readiness for sale or rent.",
    },
    {
      title: "HUD-1 and GFE Integration",
      description:
        "Generate and manage HUD-1 Settlement Statements and Good Faith Estimates seamlessly within the app.",
    },
    {
      title: "Foreclosure Listings Scraper",
      description:
        "Access the latest foreclosure listings with our integrated data scraper, gathering information from various real estate and auction sites.",
    },
    {
      title: "API Data Integration",
      description:
        "Utilize APIs for efficient data collection from multiple sources, ensuring a streamlined workflow and up-to-date information.",
    },
    {
      title: "Mobile Responsive Design",
      description:
        "Enjoy a seamless experience across all devices with our fully responsive mobile design, accessible anytime, anywhere.",
    },
  ];

  return (
    <div className="features-section p-4 md:p-6 rounded-lg mb-4 md:mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-4 md:mb-6">
        Our Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            index={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

// Call to action component with improved styling
const CallToAction = ({
  title,
  description,
  buttonText,
  buttonLink,
  bgColor = "bg-green-500",
}) => (
  <div
    className={`${bgColor} text-white text-center p-6 md:p-10 rounded-lg mb-6 md:mb-10`}
  >
    <h2 className="text-4xl font-bold mb-6">{title}</h2>
    <p className="text-xl mb-8">{description}</p>
    <Link
      to={buttonLink}
      className="bg-white hover:bg-gray-200 text-green-500 font-bold py-2 px-4 rounded transition-colors duration-200"
    >
      {buttonText}
    </Link>
  </div>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const [showFallbackAvatar, setShowFallbackAvatar] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await fetchUserProfile((userData) => {
          setUser(userData);
          if (userData?.avatar) {
            setShowFallbackAvatar(false);
          } else {
            console.log("No avatar URL in user data");
            setShowFallbackAvatar(true);
          }
        });
      } catch (error) {
        // Silently handle authentication errors
        setShowFallbackAvatar(true);
      }
    };

    loadUserData();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <HeroSection
        user={user}
        showFallbackAvatar={showFallbackAvatar}
        setShowFallbackAvatar={setShowFallbackAvatar}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials section fits with home layout */}
      <Testimonials />

      {/* Call to Action Section */}
      <CallToAction
        title="Join the Revolution in Property Management"
        description="Be a part of our growing community and take your property business to new heights."
        buttonText="Contact Us Now"
        buttonLink="/contact"
      />

      {/* About Us Section - Using the same CallToAction component with different color */}
      <CallToAction
        title="Driven by Innovation, Guided by Experience"
        description="Our team of experts brings together the best of technology and real estate acumen to offer a platform that's not just a tool, but a game changer in property management."
        buttonText="Learn More About Us"
        buttonLink="/about"
        bgColor="bg-blue-600"
      />

      {/* Property Gallery Section */}
      <div className="property-gallery bg-gradient-to-br from-gray-50 to-white p-6 md:p-10 rounded-lg shadow-md mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-4 md:mb-6">
          Our Property Portfolio
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
          Explore our diverse portfolio of properties, each meticulously managed
          with our cutting-edge tools and professional expertise.
        </p>
        <PropertyGallery />
      </div>

      {/* Contact Section */}
      <div className="contact-section bg-gray-100 p-6 md:p-10 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Get in Touch</h2>
        <p className="text-gray-600 text-lg mb-8">
          Have any questions? Reach out to us and we&apos;ll be happy to help.
        </p>
        <Link
          to="/contact"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Home;
