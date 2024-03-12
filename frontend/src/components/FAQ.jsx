import { useState } from "react";
import PhaseTrackerFAQ from "./PhaseTrackerFAQ";
import { BadgePlus, BadgeMinus } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the Property Lifecycle Management feature work?",
      answer:
        "Our Property Lifecycle Management feature allows you to track every stage of a property's lifecycle, from purchase and renovation to sale or rental. It integrates financial calculators, document management, and timeline tracking for comprehensive management.",
    },
    {
      question: "What are the benefits of using the Scope of Work component?",
      answer:
        "The Scope of Work component helps you manage renovation projects effectively. You can track contractor assignments, cost estimations, and project timelines, ensuring that every renovation phase is completed on time and within budget.",
    },
    {
      question: "How do private money loans work in property flipping?",
      answer:
        "Private money loans provide quick, flexible financing for property flipping. They are ideal for covering both the purchase and rehabilitation costs of a property, with faster approval times compared to traditional loans.",
    },
    {
      question: "What should I consider when applying for a fix-and-flip loan?",
      answer:
        "When applying for a fix-and-flip loan, consider the loan-to-value ratio, interest rates, repayment terms, and the lender's reputation. Ensure the loan aligns with your project's budget and timeline.",
    },
    {
      question:
        "Can I manage multiple properties simultaneously with this app?",
      answer:
        "Yes, our app is designed to handle multiple properties efficiently. You can track and analyze data for each property individually or view aggregated data for overall insights.",
    },
    {
      question:
        "What tools does your app provide for financial management during a flip?",
      answer:
        "With our Financial Management feature, you can effortlessly manage rent, expenses, and revenue. Generate comprehensive financial reports with just a few clicks to keep track of your budget and cash flow throughout the flipping process.",
    },
    {
      question:
        "Can your app assist in communicating with tenants during renovations?",
      answer:
        "Absolutely! Our Tenant Communication tool enables you to directly interact with tenants through the platform for any maintenance requests and notifications, ensuring smooth communication and efficient management during renovations.",
    },
    {
      question:
        "How does the Scope of Work Management feature streamline renovation projects?",
      answer:
        "Our Scope of Work Management feature helps you track renovation projects in detail, including assigning tasks to contractors and estimating costs. This ensures that every renovation phase is efficiently managed, staying on time and within budget.",
    },
    {
      question:
        "Does your app offer support for inspection tracking during property flipping?",
      answer:
        "Yes, our Inspection Tracking feature helps manage critical inspection phases during renovations. It ensures compliance with standards and that the property is ready for sale or rent, avoiding any unexpected hurdles in your flipping process.",
    },
    {
      question:
        "How does HUD-1 and GFE Integration enhance the flipping process?",
      answer:
        "Our app streamlines the generation and management of HUD-1 Settlement Statements and Good Faith Estimates, making the financial and legal aspects of property flipping more manageable and less time-consuming.",
    },
    {
      question: "Can I access foreclosure listings through your app?",
      answer:
        "Definitely! Our Foreclosure Listings Scraper provides up-to-date access to foreclosure listings, collecting information from various real estate and auction sites. This feature aids in finding undervalued properties with high potential for flipping.",
    },
    {
      question: "How does API Data Integration benefit my flipping projects?",
      answer:
        "Our API Data Integration allows for efficient collection of data from multiple sources, ensuring you have the most current information for making informed decisions. This feature streamlines your workflow and enhances your ability to analyze potential flips.",
    },
    {
      question:
        "Is your app accessible on mobile devices for on-the-go management?",
      answer:
        "Yes, our app features a Mobile Responsive Design, ensuring a seamless experience across all devices. You can manage your flipping projects anytime, anywhere, which is crucial for staying on top of fast-paced property investments.",
    },

    // Add more FAQs as needed
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpansion = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="faq-container mx-auto p-2 md:p-6 lg:p-8 max-w-4xl bg-white rounded-lg shadow-md">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-6">
        Frequently Asked Questions
      </h2>
      <PhaseTrackerFAQ />
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="faq-item mb-4 bg-gray-50 p-2 rounded-lg shadow-md hover:scale-105 hover:bg-gray-200 transition-transform duration-200"
          >
            <div
              className="faq-question flex items-center cursor-pointer"
              onClick={() => toggleExpansion(index)}
            >
              <div className="faq-icon mr-2">
                {expandedIndex === index ? <BadgeMinus /> : <BadgePlus />}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {faq.question}
              </h3>
            </div>
            {expandedIndex === index && (
              <p className="mx-8 md:mx-0 text-md text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
