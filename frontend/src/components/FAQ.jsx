import { useState } from "react";
import PhaseTracker from "./PhaseTracker";

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
    // Add more FAQs as needed
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpansion = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="faq-container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl bg-white rounded-lg shadow-md">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-6">
        Frequently Asked Questions
      </h2>
      <PhaseTracker />
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="faq-item max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm my-4"
          >
            <h3
              className="text-xl font-semibold text-gray-700 mb-2 cursor-pointer"
              onClick={() => toggleExpansion(index)}
            >
              {faq.question}
            </h3>
            {expandedIndex === index && (
              <p className="text-md text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
