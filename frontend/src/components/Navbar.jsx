import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../assets/icons/logo.svg";
import { LogOutIcon, Calculator } from "lucide-react";
import DSCRCalculator from "./DSCRCalculator";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDSCRModalOpen, setIsDSCRModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isAuthenticated = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/home");
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-white shadow-md mb-5">
        <div className="container mx-auto px-4 py-3 md:flex md:justify-between md:items-center">
          <div className="flex justify-between items-center">
            <Link
              to="/home"
              className="flex items-center text-gray-800 text-xl font-bold md:text-2xl md:mr-8 hover:text-blue-600"
            >
              <img
                src={LogoIcon}
                alt="Logo"
                className="mr-2"
                style={{ width: "42px", height: "42px" }}
              />
              Prop Pilot
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none md:hidden"
            >
              <span
                className={`block w-6 h-0.5 bg-blue-500 absolute transform transition duration-500 ease-in-out ${
                  isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-blue-500 absolute transition duration-500 ease-in-out ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-blue-500 absolute transform transition duration-500 ease-in-out ${
                  isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              ></span>
            </button>
          </div>

          <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
            <div className="flex flex-col items-center md:flex-row md:mx-6">
              <Link
                to="/home"
                className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
              >
                About
              </Link>
              {isAuthenticated && (
                <Link
                  to="/propertylist"
                  className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
                >
                  Property List
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => setIsDSCRModalOpen(true)}
                  className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0 flex items-center"
                >
                  <Calculator size={16} className="mr-1" /> DSCR Calculator
                </button>
              )}
              <Link
                to="/lender"
                className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
              >
                Lender
              </Link>
              <Link
                to="/testimonials"
                className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
              >
                Testimonials
              </Link>
              <Link
                to="/faq"
                className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
              >
                Contact
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
                >
                  Profile
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0 flex items-center"
                  aria-label="Logout"
                >
                  Logout <LogOutIcon size={16} className="ml-1" />
                </button>
              )}
              {!isAuthenticated && (
                <Link
                  to="/authform"
                  className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <DSCRCalculator
        isOpen={isDSCRModalOpen}
        onClose={() => setIsDSCRModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
