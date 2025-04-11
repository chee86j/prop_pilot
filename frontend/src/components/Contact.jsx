import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";
import PropTypes from "prop-types";

const ContactForm = ({
  contactData,
  handleChange,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={contactData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={contactData.email}
            onChange={handleChange}
            placeholder="Your email address"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={contactData.subject}
          onChange={handleChange}
          placeholder="What is this regarding?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            name="message"
            value={contactData.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            rows="5"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        <Send className="h-5 w-5" />
        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
      </button>
    </form>
  );
};

ContactForm.propTypes = {
  contactData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const ContactInfo = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">
        Get in Touch
      </h3>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-md font-medium text-gray-700">Email</h4>
            <a
              href="mailto:info@proppilot.com"
              className="text-gray-600 hover:text-green-500"
            >
              info@proppilot.com
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-md font-medium text-gray-700">Phone</h4>
            <a
              href="tel:+15555551234"
              className="text-gray-600 hover:text-green-500"
            >
              (555) 555-1234
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-md font-medium text-gray-700">Office</h4>
            <p className="text-gray-600">
              123 Property Lane
              <br />
              Suite 456
              <br />
              Real Estate City, RE 12345
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          Business Hours
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex justify-between">
            <span>Monday - Friday:</span>
            <span>9:00 AM - 5:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span>Saturday:</span>
            <span>10:00 AM - 2:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span>Sunday:</span>
            <span>Closed</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Contact = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission with a delay
    setTimeout(() => {
      console.log("Form data:", contactData);
      // Form submission logic would go here
      toast.success("Message sent successfully! We'll get back to you soon.");
      setIsSubmitting(false);

      // Reset form
      setContactData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="mx-auto p-4 md:p-6 max-w-6xl">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 border-b">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-2">
            Contact Us
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Have questions about our property management system? We&apos;re here
            to help! Fill out the form below and our team will get back to you
            as soon as possible.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ContactForm
                contactData={contactData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="md:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Embed Location of the Office */}
      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343077!2d-74.00425736797089!3d40.71256701806884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedbe7b%3A0x2cb2ddf003b5ae01!2sWall%20St%2C%20New%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1658156293933!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Office Location"
            className="w-full h-80 md:h-96"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
