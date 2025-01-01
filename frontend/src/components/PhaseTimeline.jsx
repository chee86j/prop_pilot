/* eslint-disable react/prop-types */
/* https://www.npmjs.com/package/react-chrono#media */
import { Chrono } from "react-chrono";

const PhaseTimeline = ({ phases, onEdit, onDelete }) => {
  // Check if phases are empty and display a message if so
  if (!phases || phases.length === 0) {
    return (
      <div className="text-center text-red-500 mb-5">
        No Phases Found! Add a Phase Below!
      </div>
    );
  }

  // Map phases to items for the Chrono component
  const items = phases.map((phase) => ({
    title: phase.name,
    cardTitle: phase.name,
    // Use span with display block instead of br
    cardSubtitle: [
      `Expected Start: ${phase.expectedStartDate || ""}`,
      `Actual Start: ${phase.startDate || ""}`,
    ].join(" | "),
    // Wrap buttons in span instead of div to avoid nesting issues
    cardDetailedText: (
      <span className="inline-flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 hover:cursor-pointer w-full">
        <button
          onClick={() => {
            console.log(`Editing phase: ${phase.id}`);
            onEdit(phase);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto sm:mr-2"
          aria-label={`Edit ${phase.name}`}
        >
          Edit
        </button>
        <button
          onClick={() => {
            console.log(`Deleting phase: ${phase.id}`);
            onDelete(phase.id);
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
          aria-label={`Delete ${phase.name}`}
        >
          Delete
        </button>
      </span>
    ),
  }));

  return (
    <div className="w-full h-full my-10 px-4 sm:px-0">
      <Chrono
        items={items}
        mode="VERTICAL_ALTERNATING"
        slideShow
        slideItemDuration={4500}
        enableOutline={false}
        theme={{
          secondary: "rgb(239, 246, 255)", // Tailwind's blue-50 for backgrounds
          cardBgColor: "rgb(255, 255, 255)", // white background for cards
          cardForeColor: "rgb(55, 65, 81)", // Tailwind's gray-800 for text color
        }}
        cardHeight={250}
        scrollable={{ scrollbar: true }}
      />
    </div>
  );
};

export default PhaseTimeline;
