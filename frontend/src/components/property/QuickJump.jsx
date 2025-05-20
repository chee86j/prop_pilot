import { useEffect } from 'react';

const QuickJump = ({ sections, expandedGroups, setExpandedGroups }) => {
  const handleClick = (sectionKey) => {
    // First, expand the section if not already expanded
    console.log(`QuickJump: Navigating to section "${sectionKey}"`);

    setExpandedGroups((prev) => {
      const newState = {
        ...prev,
        [sectionKey]: true,
      };
      console.log(`QuickJump: Updated expandedGroups`, newState);
      return newState;
    });

    // Wait for state update to complete, then scroll to the section
    setTimeout(() => {
      console.log(
        `QuickJump: Looking for element with data-field-group="${sectionKey}"`
      );
      const element = document.querySelector(
        `[data-field-group="${sectionKey}"]`
      );

      if (element) {
        console.log(`QuickJump: Found element, scrolling to view`);
        // Scroll to the section with smooth behavior
        element.scrollIntoView({ behavior: "smooth", block: "start" });

        // Provide visual feedback
        element.classList.add("highlight-section");
        setTimeout(() => {
          element.classList.remove("highlight-section");
        }, 1500);
      } else {
        console.warn(
          `QuickJump: Section with data-field-group="${sectionKey}" not found`
        );
        // List all data-field-group attributes for debugging
        const allGroups = document.querySelectorAll("[data-field-group]");
        console.log(
          `QuickJump: Available data-field-group elements:`,
          Array.from(allGroups).map((el) => el.getAttribute("data-field-group"))
        );
      }
    }, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Quick Navigation
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200
              ${
                expandedGroups[key]
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            aria-label={`Navigate to ${section.title} section`}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickJump; 