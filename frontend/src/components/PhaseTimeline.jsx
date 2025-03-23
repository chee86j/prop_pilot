/* eslint-disable react/prop-types */
import { Chrono } from "react-chrono";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PhaseTimeline = ({ phases, onEdit, onDelete }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [phases]);

  if (!phases || phases.length === 0) {
    return (
      <div className="text-center text-red-500 mb-5">
        No Phases Found! Add a Phase Below!
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentPhaseIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPhaseIndex((prev) => Math.min(phases.length - 1, prev + 1));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const items = phases.map((phase) => ({
    title: phase.name,
    cardTitle: phase.name,
    cardSubtitle: `Expected Start: ${
      phase.expectedStartDate || ""
    }\nActual Start: ${phase.startDate || ""}`,
    cardDetailedText: (
      <span className="inline-block">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(phase);
            toast.success("Phase edit initiated!", {
              autoClose: 3000,
            });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(phase.id);
            toast.success("Phase deleted successfully!", {
              autoClose: 3000,
            });
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </span>
    ),
  }));

  return (
    <div className="w-full">
      <ToastContainer />

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevious}
              disabled={currentPhaseIndex === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous phase"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium text-gray-600">
              Phase {currentPhaseIndex + 1} of {phases.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPhaseIndex === phases.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next phase"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {phases[currentPhaseIndex].name}
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Expected Start:</span>{" "}
                {formatDate(phases[currentPhaseIndex].expectedStartDate)}
              </p>
              <p>
                <span className="font-medium">Actual Start:</span>{" "}
                {formatDate(phases[currentPhaseIndex].startDate)}
              </p>
              <p>
                <span className="font-medium">Expected End:</span>{" "}
                {formatDate(phases[currentPhaseIndex].expectedEndDate)}
              </p>
              <p>
                <span className="font-medium">Actual End:</span>{" "}
                {formatDate(phases[currentPhaseIndex].endDate)}
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  onEdit(phases[currentPhaseIndex]);
                  toast.success("Phase edit initiated!");
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(phases[currentPhaseIndex].id);
                  toast.success("Phase deleted successfully!");
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          ref={containerRef}
          className="w-full my-10"
          style={{ minHeight: "400px", height: "400px" }}
        >
          {mounted ? (
            <Chrono
              key={phases.length}
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
      </div>
    </div>
  );
};

export default PhaseTimeline;
