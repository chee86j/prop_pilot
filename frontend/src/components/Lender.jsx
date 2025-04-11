import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Briefcase,
  Clock,
  Shield,
  Award,
} from "lucide-react";
import PropTypes from "prop-types";

// Section component for consistency across the lender page
const LenderSection = ({ title, icon, children, isDark = false }) => {
  return (
    <section
      className={`rounded-lg shadow-md overflow-hidden mb-8 ${
        isDark ? "bg-blue-600 text-white" : "bg-white"
      }`}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          {icon && (
            <div className={`mr-3 ${isDark ? "text-white" : "text-blue-600"}`}>
              {icon}
            </div>
          )}
          <h3
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-700"
            }`}
          >
            {title}
          </h3>
        </div>
        <div className={isDark ? "text-white" : "text-gray-600"}>
          {children}
        </div>
      </div>
    </section>
  );
};

LenderSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
  isDark: PropTypes.bool,
};

// Accordion component for loan types and FAQs
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150 flex justify-between items-center"
            onClick={() => toggleItem(index)}
          >
            <span className="font-medium text-gray-800">{item.title}</span>
            {openIndex === index ? (
              <ChevronUp className="text-blue-500" />
            ) : (
              <ChevronDown className="text-blue-500" />
            )}
          </button>

          <div
            className={`
              bg-white px-4 overflow-hidden transition-max-height duration-300 ease-in-out
              ${openIndex === index ? "max-h-96 py-4" : "max-h-0 py-0"}
            `}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
};

// InfoCard component for displaying loan benefits, features, etc.
const InfoCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
          {icon}
        </div>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

const Lender = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const loanTypeItems = [
    {
      title: "Hard Money Loans",
      content: (
        <div>
          <p className="mb-2">
            Hard money loans are asset-based and often have higher interest
            rates but faster approval processes. They are secured by the value
            of the property rather than the borrower&apos;s creditworthiness.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Typical interest rates: 8-15%</li>
            <li>Loan term: 6-24 months</li>
            <li>Loan-to-value (LTV): Up to 75%</li>
            <li>Quick funding: Often within 7-14 days</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Bridge Loans",
      content: (
        <div>
          <p className="mb-2">
            Bridge loans are short-term loans used to &quot;bridge&quot; the gap
            until long-term financing can be secured. They&apos;re useful when
            you need quick access to funds for a purchase while waiting for
            another source of funds.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Typical interest rates: 6-12%</li>
            <li>Loan term: 3-18 months</li>
            <li>Loan-to-value (LTV): Up to 80%</li>
            <li>Flexible repayment options available</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Cash-Out Refinance Loans",
      content: (
        <div>
          <p className="mb-2">
            Cash-out refinance loans involve refinancing an existing mortgage
            and taking out additional cash for renovations. This option is
            suitable for investors who have equity in existing properties.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Typically lower interest rates than hard money loans</li>
            <li>Longer terms available (15-30 years)</li>
            <li>Higher qualification requirements</li>
            <li>Good for investors with strong credit profiles</li>
          </ul>
        </div>
      ),
    },
  ];

  const faqItems = [
    {
      title: "How quickly can I get a private money loan?",
      content: (
        <p>
          Private money loans can typically be secured within a few weeks,
          depending on the lender and the specifics of your project. Some
          lenders may process applications in as little as 7-10 business days,
          while others might take 2-3 weeks.
        </p>
      ),
    },
    {
      title: "Are the interest rates higher for private money loans?",
      content: (
        <p>
          Yes, the interest rates are generally higher than traditional bank
          loans, reflecting the higher risk and shorter loan terms. Private
          money loan rates typically range from 8% to 15%, depending on your
          experience, the property, and market conditions.
        </p>
      ),
    },
    {
      title: "What documentation do I need to apply for a fix-and-flip loan?",
      content: (
        <p>
          Typically, you&apos;ll need property details (address, purchase price,
          estimated ARV), renovation budget, timeline, exit strategy, personal
          financial information, credit history, and details of your flipping
          experience. Some lenders may require business entity documentation if
          you&apos;re not applying as an individual.
        </p>
      ),
    },
    {
      title: "Can I get 100% financing for a fix-and-flip project?",
      content: (
        <p>
          While rare, some lenders offer 100% LTV loans for experienced flippers
          with proven track records. These typically come with higher interest
          rates and fees. Most lenders require a down payment of 10-30% of the
          purchase price, with additional funds for renovation costs.
        </p>
      ),
    },
  ];

  return (
    <div className="lender-container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      {/* Hero Section with CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-8 md:p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Private Money Loans for Property Flipping
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            Get quick access to flexible financing options designed specifically
            for real estate investors. Our private money loans offer faster
            approval and more flexible terms compared to traditional banks.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
              Apply for Financing
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-bold py-3 px-6 rounded-lg transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 text-lg font-medium ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("overview")}
          >
            Overview
          </button>
          <button
            className={`px-6 py-4 text-lg font-medium ${
              activeTab === "types"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("types")}
          >
            Loan Types
          </button>
          <button
            className={`px-6 py-4 text-lg font-medium ${
              activeTab === "requirements"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("requirements")}
          >
            Requirements
          </button>
          <button
            className={`px-6 py-4 text-lg font-medium ${
              activeTab === "faq"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => handleTabChange("faq")}
          >
            FAQs
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          {activeTab === "overview" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Understanding Fix-and-Flip Loans
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Fix-and-flip loans are designed to finance both the purchase and
                rehabilitation of investment properties. They are a popular
                choice among real estate investors for their flexibility and
                quick funding.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <InfoCard
                  title="Speed of Funding"
                  description="Get your financing approved in days rather than weeks. Private money loans can be secured much faster than traditional loans."
                  icon={<Clock size={24} />}
                />

                <InfoCard
                  title="Flexible Terms"
                  description="Enjoy more flexible loan terms that can be customized to your specific project needs and timeline."
                  icon={<Briefcase size={24} />}
                />

                <InfoCard
                  title="Asset-Based Approval"
                  description="Loans are secured by the property value rather than primarily on your credit score, making approval easier."
                  icon={<Shield size={24} />}
                />

                <InfoCard
                  title="Expert Guidance"
                  description="Receive personalized support from lenders who understand the unique needs of property flippers."
                  icon={<Award size={24} />}
                />
              </div>

              <p className="text-gray-600 mb-4">
                Types of fix-and-flip loans include hard money loans, bridge
                loans, and cash-out refinance loans. Each type has its unique
                features and suitability depending on the project and the
                investor&apos;s needs.
              </p>

              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>
                  <strong>Hard money loans</strong> are asset-based and often
                  have higher interest rates but faster approval processes.
                </li>
                <li>
                  <strong>Bridge loans</strong> are short-term loans used to
                  &quot;bridge&quot; the gap until long-term financing can be
                  secured.
                </li>
                <li>
                  <strong>Cash-out refinance loans</strong> involve refinancing
                  an existing mortgage and taking out additional cash for
                  renovations.
                </li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                  <DollarSign className="mr-2" /> Typical Loan Terms
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800">
                  <div>
                    <p className="font-medium">Interest Rates</p>
                    <p className="text-blue-600">8-15%</p>
                  </div>
                  <div>
                    <p className="font-medium">Loan Duration</p>
                    <p className="text-blue-600">6-24 months</p>
                  </div>
                  <div>
                    <p className="font-medium">Loan-to-Value</p>
                    <p className="text-blue-600">Up to 75-85%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tab content would be here */}
          {activeTab === "types" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Types of Fix-and-Flip Loans
              </h3>
              <Accordion items={loanTypeItems} />
            </div>
          )}

          {activeTab === "requirements" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Loan Requirements
              </h3>
              <p className="text-gray-600 mb-4">
                Understanding the down payment requirements is crucial when
                considering a hard money loan for house flipping. Typically,
                lenders require a down payment ranging from 20% to 30% of the
                purchase price, depending on various factors.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  The exact down payment percentage can vary based on the
                  lender&apos;s policies and the specifics of the deal.
                </li>
                <li>
                  Higher down payments might be required for borrowers with less
                  experience or for properties in riskier markets.
                </li>
                <li>
                  Some lenders may also consider the borrower&apos;s equity in
                  the property when determining the down payment requirement.
                </li>
              </ul>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h3>
              <Accordion items={faqItems} />
            </div>
          )}
        </div>
      </div>

      {/* Connect with Lenders Section */}
      <section className="connect-lenders-section mb-4 md:mb-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3 md:mb-4">
          Connect with Trusted Lenders
        </h3>
        <p className="text-gray-600 text-md md:text-lg mb-3">
          Ready to take the next step in your real estate investment journey?
          Our platform bridges the gap between ambitious investors and reputable
          lenders. Let us help you find the perfect lending partner for your
          next flip project.
        </p>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-lg">
          Connect with a Lender
        </button>
      </section>

      {/* Compelling Final CTA */}
      <section className="final-cta bg-blue-600 p-6 rounded-lg text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Flipping Project Today!
        </h2>
        <p className="text-xl mb-6">
          Don&apos;t let financing be a barrier to your success. Contact us now
          to explore your lending options and kickstart your property flipping
          journey!
        </p>
        <button className="bg-white hover:bg-gray-200 text-blue-600 font-bold py-2 px-6 rounded-lg text-lg">
          Contact Us for Lending Options
        </button>
      </section>
    </div>
  );
};

export default Lender;
