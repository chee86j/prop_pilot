import React, { useState } from 'react';

const Contact = () => {
    // Temporary data for the contact form
    const [contactData, setContactData] = useState({
        name: 'John Doe',
        email: 'johndoe@example.com',
        subject: 'Inquiry about Property Management App',
        message: 'I am interested in learning more about your property management solutions. Can you provide more detailed information?'
    });

    const handleChange = (e) => {
        setContactData({ ...contactData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', contactData);
        // Form submission logic goes here
    };

    return (
        <div className="contact-form-container mx-auto p-4 md:p-6 max-w-3xl bg-white rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 text-center mb-6">Contact Us</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <label className="block">
                    <span className="text-gray-700">Name:</span>
                    <input type="text" name="name" value={contactData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </label>
                <label className="block">
                    <span className="text-gray-700">Email:</span>
                    <input type="email" name="email" value={contactData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </label>
                <label className="block">
                    <span className="text-gray-700">Subject:</span>
                    <input type="text" name="subject" value={contactData.subject} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </label>
                <label className="block">
                    <span className="text-gray-700">Message:</span>
                    <textarea name="message" value={contactData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                </label>
                <button type="submit" className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Contact;
