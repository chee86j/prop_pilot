import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from '../assets/icons/logo.svg';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md mb-5">
            <div className="container mx-auto px-4 py-3 md:flex md:justify-between md:items-center">
                <div className="flex justify-between items-center">
                    {/* Logo and App Name */}
                    <Link className="flex items-center text-gray-800 text-xl font-bold md:text-2xl hover:text-blue-600" to="/home">
                        <img src={LogoIcon} alt="Logo" className="mr-2" style={{ width: '42px', height: '42px' }} />
                        Prop Pilot
                    </Link>
                    
                    {/* Mobile Menu Button */}
                    <button type="button" onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 md:hidden">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                            <path fillRule="evenodd" d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"></path>
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                    <div className="flex flex-col md:flex-row md:mx-6">
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/home">Home</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/about">About</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/propertyform">Property Form</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/lender">Lender</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/testimonials">Testimonials</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/faq">FAQ</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/contact">Contact</Link>
                        <Link className="my-1 text-sm text-gray-700 leading-5 hover:text-blue-600 md:mx-4 md:my-0" to="/authform">Login</Link>
                        {/* Add other links as needed */}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
