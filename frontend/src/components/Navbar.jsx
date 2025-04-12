import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../assets/icons/logo.svg";
import PropTypes from "prop-types";
import {
  LogOutIcon,
  Calculator,
  ChevronDown,
  ChevronUp,
  Wrench,
  DollarSign,
  Hammer,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import {
  renderDSCRCalculatorInWindow,
  renderAmortizationCalculatorInWindow,
  renderRehabEstimatorInWindow,
} from "../utils/windowRenderer.jsx";
import { fetchUserProfile } from "../utils/user";

// NavLogo component for the brand logo
const NavLogo = () => (
  <Link
    to="/home"
    className="flex items-center text-gray-800 text-xl font-bold md:text-2xl md:mr-8 hover:text-blue-600 transition-colors"
  >
    <img
      src={LogoIcon}
      alt="Logo"
      className="mr-2"
      style={{ width: "42px", height: "42px" }}
    />
    Prop Pilot
  </Link>
);

// NavLink component for consistent styling across navigation links
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block py-2 px-4 md:py-0 md:px-0 my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 hover:bg-gray-50 md:hover:bg-transparent md:mx-4 md:my-0 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// ToolsMenu component for the tools dropdown
const ToolsMenu = ({ isOpen, toggleOpen }) => {
  const menuRef = useRef(null);

  // Tools configuration
  const tools = [
    {
      name: "DSCR Calculator",
      icon: Calculator,
      action: renderDSCRCalculatorInWindow,
      windowName: "DSCRCalculator",
      width: 500,
      height: 700,
    },
    {
      name: "Amortization Calculator",
      icon: DollarSign,
      action: renderAmortizationCalculatorInWindow,
      windowName: "AmortizationCalculator",
      width: 900,
      height: 800,
    },
    {
      name: "Rehab Estimator",
      icon: Hammer,
      action: renderRehabEstimatorInWindow,
      windowName: "RehabEstimator",
      width: 500,
      height: 800,
    },
  ];

  // Generic tool opener
  const openTool = useCallback((tool) => {
    const toolWindow = window.open(
      "",
      tool.windowName,
      `width=${tool.width},height=${tool.height}`
    );

    if (toolWindow) {
      toolWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${tool.name} - Prop Pilot</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              background-color: #f9fafb;
              padding: 1rem;
            }
            #root {
              max-width: 1200px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
      `);

      tool.action(toolWindow);
    } else {
      alert(`Please allow popups to use the ${tool.name}`);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isOpen) toggleOpen();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleOpen}
        className="flex items-center w-full md:w-auto py-2 px-4 md:py-0 md:px-0 my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 hover:bg-gray-50 md:hover:bg-transparent md:mx-4 md:my-0 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Wrench size={16} className="mr-1" />
        Tools
        {isOpen ? (
          <ChevronUp size={16} className="ml-1" />
        ) : (
          <ChevronDown size={16} className="ml-1" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 left-0 md:right-0 md:left-auto border border-gray-200">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={index}
                onClick={() => openTool(tool)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-md m-1"
              >
                <Icon size={16} className="mr-2" /> {tool.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

ToolsMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
};

// UserMenu component for profile and logout
const UserMenu = ({ avatar, name, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isOpen) setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center my-1 md:mx-4 md:my-0 group p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={name || "Profile"}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200 group-hover:border-blue-400 transition-colors">
          {avatar ? (
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<svg class="w-5 h-5 md:w-6 md:h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
              }}
            />
          ) : (
            <UserCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
          )}
        </div>
      </button>

      {/* User Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 right-0 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              {name || "User"}
            </p>
          </div>

          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-md m-1"
          >
            <UserCircle size={16} className="mr-2" /> Profile
          </Link>

          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center rounded-md m-1"
          >
            <LogOutIcon size={16} className="mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

UserMenu.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
  };

  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Fetch user avatar if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const getUserData = async () => {
        try {
          await fetchUserProfile((userData) => {
            setUserAvatar(userData.avatar);
            setUserName(
              `${userData.first_name || ""} ${userData.last_name || ""}`.trim()
            );
          });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };

      getUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/home");
    window.location.reload();
  };

  // Navigation links configuration
  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    ...(isAuthenticated
      ? [{ name: "Property List", path: "/propertylist" }]
      : []),
    { name: "Lender", path: "/lender" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md mb-5 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center py-3">
          <NavLogo />

          <button
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex md:items-center py-3 md:py-0 transition-all duration-200 ease-in-out`}
        >
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            {navLinks.map((link, index) => (
              <NavLink key={index} to={link.path}>
                {link.name}
              </NavLink>
            ))}

            <ToolsMenu
              isOpen={isToolsDropdownOpen}
              toggleOpen={toggleToolsDropdown}
            />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 md:mt-0 md:pt-0 md:border-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:ml-6">
            {isAuthenticated ? (
              <UserMenu
                avatar={userAvatar}
                name={userName}
                onLogout={handleLogout}
              />
            ) : (
              <NavLink to="/authform">Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
