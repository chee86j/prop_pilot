/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Testimonials from "./Testimonials";
import PropertyGallery from "./PropertyGallery";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import planeIcon from "../assets/icons/plane.svg";
import LogoIcon from "../assets/icons/logo.svg";

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
        console.error("Error fetching user profile:", error);
        setShowFallbackAvatar(true);
      }
    };

    loadUserData();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section bg-white shadow-lg rounded-lg text-center p-6 md:p-10 mb-6 md:mb-10">
        {/* User Avatar */}
        <div className="inline-block">
          {!showFallbackAvatar && user?.avatar ? (
            <img
              src={user.avatar}
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

        {/* Landing welcome */}
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
        <Link to="/authform" className="custom-button">
          <img
            src={planeIcon}
            alt="Plane"
            className="mr-2"
            style={{ width: "24px", height: "24px" }}
          />
          <span>Get Started</span>
        </Link>
      </div>

      {/* Features Section */}
      <div className="features-section p-4 md:p-6 rounded-lg mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-4 md:mb-6">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">Property Tracking</h3>
            <p>
              Keep track of all your properties in one place. Monitor status,
              documents, and financials with ease.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">Financial Management</h3>
            <p>
              Effortlessly manage rent, expenses, and revenue. Generate
              financial reports with a few clicks.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">Tenant Communication</h3>
            <p>
              Communicate with tenants directly through the platform for
              maintenance requests and notifications.
            </p>
          </div>
          {/* Feature 4 - Scope of Work Management */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">
              Scope of Work Management
            </h3>
            <p>
              Track renovation projects with detailed scope-of-work management,
              including contractor assignments and cost estimations.
            </p>
          </div>

          {/* Feature 5 - Inspection Tracking */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">Inspection Tracking</h3>
            <p>
              Manage critical inspection phases during renovations to ensure
              compliance and readiness for sale or rent.
            </p>
          </div>

          {/* Feature 6 - HUD-1 and GFE Documents */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">
              HUD-1 and GFE Integration
            </h3>
            <p>
              Generate and manage HUD-1 Settlement Statements and Good Faith
              Estimates seamlessly within the app.
            </p>
          </div>

          {/* Feature 7 - Data Scraper for Foreclosure Listings */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">
              Foreclosure Listings Scraper
            </h3>
            <p>
              Access the latest foreclosure listings with our integrated data
              scraper, gathering information from various real estate and
              auction sites.
            </p>
          </div>

          {/* Feature 8 - API Integration for Data Collection */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">API Data Integration</h3>
            <p>
              Utilize APIs for efficient data collection from multiple sources,
              ensuring a streamlined workflow and up-to-date information.
            </p>
          </div>

          {/* Feature 9 - Responsive Mobile Design */}
          <div className="feature bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-semibold mb-3">
              Mobile Responsive Design
            </h3>
            <p>
              Enjoy a seamless experience across all devices with our fully
              responsive mobile design, accessible anytime, anywhere.
            </p>
          </div>
        </div>
      </div>

      <Testimonials />

      {/* Call to Action Section */}
      <div className="call-to-action bg-green-500 text-white text-center p-6 md:p-10 rounded-lg mb-6 md:mb-10">
        <h2 className="text-4xl font-bold mb-6">
          Join the Revolution in Property Management
        </h2>
        <p className="text-xl mb-8">
          Be a part of our growing community and take your property business to
          new heights.
        </p>
        <Link
          to="/contact"
          className="bg-white hover:bg-gray-200 text-green-500 font-bold py-2 px-4 rounded"
        >
          Contact Us Now
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="faq-section bg-white p-6 md:p-10 rounded-lg mb-6 md:mb-10">
        {/* ... existing FAQs ... */}
      </div>

      {/* About Us Section */}
      <div className="about-us-section bg-blue-600 text-white p-6 md:p-10 rounded-lg mb-6 md:mb-10">
        <h2 className="text-4xl font-bold text-center mb-6">
          Driven by Innovation, Guided by Experience
        </h2>
        <p className="text-xl text-center mb-8">
          Our team of experts brings together the best of technology and real
          estate acumen to offer a platform that’s not just a tool, but a game
          changer in property management.
        </p>
        <Link
          to="/about"
          className="bg-white hover:bg-gray-200 text-blue-600 font-bold py-2 px-4 rounded"
        >
          Learn More About Us
        </Link>
      </div>

      {/* Property Gallery Section */}
      <div className="property-gallery bg-white p-6 md:p-10 rounded-lg mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-4 md:mb-6">
          Our Property Portfolio
        </h2>
        <PropertyGallery />
      </div>

      {/* Contact Section */}
      <div className="contact-section bg-gray-100 p-6 md:p-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Have any questions? Reach out to us and we’ll be happy to help.
        </p>
        <Link
          to="/contact"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Home;
