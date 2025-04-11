import { useState } from "react";
import PropTypes from "prop-types";

// Section Header component for consistent styling across sections
const SectionHeader = ({ title }) => (
  <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-green-500 pb-2 inline-block">
    {title}
  </h3>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

// About Section component to modularize content sections
const AboutSection = ({ title, content, additionalContent = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mb-6 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <SectionHeader title={title} />
      <p className="text-sm md:text-md text-gray-600 mb-4">{content}</p>
      {additionalContent && (
        <div
          className={`overflow-hidden transition-max-height duration-500 ${
            isExpanded ? "max-h-96" : "max-h-0"
          }`}
        >
          <p className="text-sm md:text-md text-gray-600">
            {additionalContent}
          </p>
        </div>
      )}
      {additionalContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-500 hover:text-green-700 text-sm font-medium focus:outline-none transition-colors duration-200"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </section>
  );
};

AboutSection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  additionalContent: PropTypes.string,
};

const About = () => {
  const sections = [
    {
      title: "Empowering House Flippers",
      content:
        "For house flippers, our app offers a robust suite of tools that simplifies the process of flipping. From detailed financial tracking and analysis to managing the renovation process, our app ensures that your investments are handled efficiently, increasing ROI and reducing time on the market.",
    },
    {
      title: "Streamlining Developers' Workflow",
      content:
        "Developers can leverage our app to oversee multiple projects seamlessly. The app's ability to integrate project timelines, budget management, and contractor coordination into one platform makes it an indispensable tool for managing large-scale developments.",
    },
    {
      title: "Tool for Construction Trade Contractors",
      content:
        "Construction trade contractors will find our app invaluable for tracking job progress, managing subcontractor tasks, and aligning project timelines. With real-time updates and communication features, it's easier than ever to stay on top of every project detail.",
    },
    {
      title: "Optimized for Real Estate Accountants",
      content:
        "Real estate accountants play a crucial role in the financial management of property investments. Our app offers specialized tools designed to streamline accounting tasks, from tracking expenses and revenues to generating comprehensive financial reports. With features such as automated expense categorization, easy integration with existing accounting software, and real-time financial analytics, accountants can efficiently manage the financial health of properties, ensuring compliance and maximizing profitability.",
      additionalContent:
        "Whether it's handling complex tax considerations or navigating diverse financial portfolios, our app simplifies and enhances the financial oversight of real estate investments, making it an invaluable asset for accountants in the industry.",
    },
    {
      title: "Innovative Features",
      content:
        "Our app stands out with features like real-time analytics, comprehensive property lifecycle management, Scope of Work component, and streamlined communication channels. We've also integrated powerful tools like a data scraper for foreclosure listings and direct connectivity with lenders for financial needs.",
    },
    {
      title: "Our Commitment",
      content:
        "We are committed to continuous innovation and user-centric enhancements. Our mission is to provide a platform that not only meets but exceeds the expectations of today's real estate professionals. Join us in transforming the world of real estate investment and management.",
    },
  ];

  return (
    <div className="about-container mx-auto px-4 py-6 md:px-8 md:py-10 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-6 relative">
          <span className="bg-green-500 h-1 w-64 absolute left-1/2 transform -translate-x-1/2 bottom-0"></span>
          About Prop Pilot
        </h2>
        <p className="text-sm md:text-md text-gray-600 mb-6 leading-relaxed">
          Prop Pilot is the brainchild of a software engineer with over 12 years
          of experience in the property management industry. This transition
          from hands-on real estate management to innovative software
          development has fueled our app&apos;s creation. Prop Pilot is
          dedicated to revolutionizing the way real estate investments are
          handled. Designed for house flippers, developers, construction trade
          contractors, and real estate accountants, our app is a comprehensive
          solution that streamlines every phase of property management, merging
          industry expertise with cutting-edge technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <AboutSection
            key={index}
            title={section.title}
            content={section.content}
            additionalContent={section.additionalContent}
          />
        ))}
      </div>
    </div>
  );
};

export default About;
