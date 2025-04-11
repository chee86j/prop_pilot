import { useState } from "react";
import PhaseTrackerFAQ from "./PhaseTrackerFAQ";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import PropTypes from "prop-types";
import { generalFaqs } from "../utils/faqData";
import { filterFaqsByQuery, getFaqsByCategory } from "../utils/faqUtils";

// FAQ category component
const FAQCategory = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
};

FAQCategory.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// FAQ item component
const FAQItem = ({ question, answer, isExpanded, onToggle, index }) => {
  return (
    <div
      className={`
        faq-item rounded-lg overflow-hidden transition-all duration-300
        ${isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"} 
        bg-white
      `}
    >
      <button
        className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg"
        onClick={() => onToggle(index)}
        aria-expanded={isExpanded}
      >
        <h4 className="text-lg font-semibold text-gray-800 pr-8">{question}</h4>
        <div className="text-green-500 flex-shrink-0">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <div
        className={`
          px-6 overflow-hidden transition-max-height duration-300 ease-in-out
          ${isExpanded ? "max-h-96 pb-6" : "max-h-0"}
        `}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpansion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filter FAQs based on search query
  const filteredFaqs = filterFaqsByQuery(generalFaqs, searchQuery);

  // Group FAQs by category
  const featureFaqs = getFaqsByCategory(filteredFaqs, "features");
  const financingFaqs = getFaqsByCategory(filteredFaqs, "financing");
  const usageFaqs = getFaqsByCategory(filteredFaqs, "usage");

  return (
    <div className="faq-container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-6">
          Frequently Asked Questions
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          Welcome to our FAQ section! Here, we aim to address common questions
          related to our property management application. If you don&apos;t see
          the information you&apos;re looking for, feel free to reach out to us
          directly for personalized assistance.
        </p>

        {/* Search box */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Phase Tracker FAQs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <PhaseTrackerFAQ />
      </div>

      {/* General FAQs grouped by category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {featureFaqs.length > 0 && (
          <FAQCategory title="Features">
            {featureFaqs.map((faq, index) => (
              <FAQItem
                key={`feature-${index}`}
                question={faq.question}
                answer={faq.answer}
                isExpanded={expandedIndex === `feature-${index}`}
                onToggle={() => toggleExpansion(`feature-${index}`)}
                index={`feature-${index}`}
              />
            ))}
          </FAQCategory>
        )}

        {financingFaqs.length > 0 && (
          <FAQCategory title="Financing">
            {financingFaqs.map((faq, index) => (
              <FAQItem
                key={`financing-${index}`}
                question={faq.question}
                answer={faq.answer}
                isExpanded={expandedIndex === `financing-${index}`}
                onToggle={() => toggleExpansion(`financing-${index}`)}
                index={`financing-${index}`}
              />
            ))}
          </FAQCategory>
        )}

        {usageFaqs.length > 0 && (
          <FAQCategory title="Usage">
            {usageFaqs.map((faq, index) => (
              <FAQItem
                key={`usage-${index}`}
                question={faq.question}
                answer={faq.answer}
                isExpanded={expandedIndex === `usage-${index}`}
                onToggle={() => toggleExpansion(`usage-${index}`)}
                index={`usage-${index}`}
              />
            ))}
          </FAQCategory>
        )}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No FAQs found matching your search criteria.
            </p>
            <button
              className="mt-4 text-green-500 hover:text-green-700 font-medium"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;
