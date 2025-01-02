/* eslint-disable react/prop-types */
import { Chrono } from "react-chrono";
import { useEffect, useState, useRef } from "react";

const PhaseTimeline = ({ phases, onEdit, onDelete }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100); // Reduced timeout for better responsiveness

    return () => clearTimeout(timer);
  }, [phases]); // Add phases as dependency to remount when phases change

  if (!phases || phases.length === 0) {
    return (
      <div className="text-center text-red-500 mb-5">
        No Phases Found! Add a Phase Below!
      </div>
    );
  }

  const items = phases.map((phase) => ({
    title: phase.name,
    cardTitle: phase.name,
    cardSubtitle: `Expected Start: ${
      phase.expectedStartDate || ""
    }\nActual Start: ${phase.startDate || ""}`,
    cardDetailedText: (
      <span className="inline-block">
        {" "}
        {/* Changed from div to span */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Editing phase: ${phase.id}`);
            onEdit(phase);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Deleting phase: ${phase.id}`);
            onDelete(phase.id);
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </span>
    ),
  }));

  return (
    <div
      ref={containerRef}
      className="w-full my-10 px-4 sm:px-0"
      style={{ minHeight: "400px", height: "400px" }} // Fixed height container
    >
      {mounted ? (
        <Chrono
          key={phases.length} // Add key prop to force re-render
          items={items}
          mode="HORIZONTAL"
          slideItemDuration={4500}
          enableOutline={false}
          theme={{
            primary: "rgb(59, 130, 246)",
            secondary: "rgb(239, 246, 255)",
            cardBgColor: "rgb(255, 255, 255)",
            cardForeColor: "rgb(55, 65, 81)",
            titleColor: "rgb(55, 65, 81)",
          }}
          cardHeight={150}
          scrollable
          useReadMore={false}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          Loading timeline...
        </div>
      )}
    </div>
  );
};

export default PhaseTimeline;
