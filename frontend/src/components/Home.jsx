import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section bg-white shadow-lg rounded-lg text-center p-10 mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">Welcome to Our Property Management System</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Streamline your property management with our advanced tools and services.
                </p>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Get Started
                </Link>
            </div>

            {/* Features Section */}
            <div className="features-section mb-10">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Our Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Feature 1 */}
                    <div className="feature bg-gray-50 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Property Tracking</h3>
                        <p>Keep track of all your properties in one place. Monitor status, documents, and financials with ease.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="feature bg-gray-50 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Financial Management</h3>
                        <p>Effortlessly manage rent, expenses, and revenue. Generate financial reports with a few clicks.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="feature bg-gray-50 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-3">Tenant Communication</h3>
                        <p>Communicate with tenants directly through the platform for maintenance requests and notifications.</p>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="testimonials-section bg-gray-100 p-10 rounded-lg mb-10">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Testimonial 1 */}
                    <div className="testimonial p-4 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-2">"This system has transformed the way we manage our properties. Highly recommended!"</p>
                        <p className="text-gray-700 font-semibold">- Jane Doe, Property Manager</p>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="testimonial p-4 rounded-lg shadow-md">
                        <p className="text-gray-600 mb-2">"User-friendly and efficient. It's everything we needed for our property portfolio."</p>
                        <p className="text-gray-700 font-semibold">- John Smith, Real Estate Investor</p>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="call-to-action bg-white shadow-lg rounded-lg text-center p-10">
                <h2 className="text-3xl font-bold text-gray-700 mb-6">Ready to Get Started?</h2>
                <p className="text-gray-600 text-lg mb-8">Join the many property managers and owners using our platform to streamline their operations.</p>
                <Link to="/contact" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Contact Us
                </Link>
            </div>

            {/* FAQ Section */}
            <div className="faq-section bg-gray-100 p-10 rounded-lg mb-10">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* FAQ 1 */}
                    <div className="faq-item mb-4">
                        <h3 className="text-xl font-semibold mb-2">How do I get started?</h3>
                        <p>Simply sign up, add your properties, and you’re ready to go. It’s that easy!</p>
                    </div>

                    {/* FAQ 2 */}
                    <div className="faq-item mb-4">
                        <h3 className="text-xl font-semibold mb-2">Is there a mobile app?</h3>
                        <p>Yes, our mobile app is available on both iOS and Android devices.</p>
                    </div>

                    {/* More FAQs... */}
                </div>
            </div>

            {/* About Us Section */}
            <div className="about-us-section bg-white p-10 rounded-lg mb-10">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">About Us</h2>
                <p className="text-gray-600 text-lg mb-8">
                    Learn more about our journey and how we became leaders in property management.
                </p>
                <Link to="/about" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Our Story
                </Link>
            </div>

            {/* Property Gallery Section */}
            <div className="property-gallery bg-white p-10 rounded-lg mb-10">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Our Property Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Property 1 */}
                    <div className="property bg-gray-50 p-4 rounded-lg shadow-md">
                        <img src="/images/property1.jpg" alt="Property 1" className="mb-3" />
                        <h3 className="text-lg font-semibold">Modern Apartment</h3>
                        <p>City Center, 2BHK</p>
                    </div>

                    {/* Property 2 */}
                    {/* ... */}
                </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section bg-gray-100 p-10 rounded-lg">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Get in Touch</h2>
                <p className="text-gray-600 text-lg mb-8">
                    Have any questions? Reach out to us and we’ll be happy to help.
                </p>
                <Link to="/contact" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Contact Us
                </Link>
            </div>
        </div>
    );
};

export default Home;

