import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PREDEFINED_PHASES,
  PHASE_TASKS,
  PHASE_CATEGORIES,
} from "../utils/data";

const PhaseTrackerFAQ = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const nextPhase = () => {
    if (currentPhaseIndex < PREDEFINED_PHASES.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    }
  };

  const prevPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
    }
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const currentPhase = PREDEFINED_PHASES[currentPhaseIndex];
  const currentCategory = PHASE_CATEGORIES[currentPhase.category];

  // Get the category color class for Tailwind
  const getCategoryColorClass = () => {
    const colorMap = {
      blue: "blue-500",
      green: "green-500",
      purple: "purple-500",
      red: "red-500",
    };
    return colorMap[currentCategory.color] || "green-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <button
        className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg"
        onClick={toggleExpansion}
        aria-expanded={expanded}
      >
        <h4 className="text-lg font-semibold text-gray-800 pr-8">
          What are the Phases in the Property Management Lifecycle?
        </h4>
        <div className="text-green-500 flex-shrink-0">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <div
        className={`
          overflow-hidden transition-max-height duration-300 ease-in-out
          ${expanded ? "max-h-[800px] pb-6" : "max-h-0"}
        `}
      >
        <div className="px-6">
          {/* Phase navigator */}
          <div className="flex items-center justify-between mb-5 mt-3 bg-gray-50 p-3 rounded-lg">
            <button
              onClick={prevPhase}
              disabled={currentPhaseIndex === 0}
              className={`p-2 rounded-full bg-gray-100 hover:bg-green-100 transition-colors duration-200 ${
                currentPhaseIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous phase"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>

            <div className="flex-1 text-center px-4">
              <span className="text-sm text-gray-500 font-medium">
                Phase {currentPhaseIndex + 1} of {PREDEFINED_PHASES.length}
              </span>
            </div>

            <button
              onClick={nextPhase}
              disabled={currentPhaseIndex === PREDEFINED_PHASES.length - 1}
              className={`p-2 rounded-full bg-gray-100 hover:bg-green-100 transition-colors duration-200 ${
                currentPhaseIndex === PREDEFINED_PHASES.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Next phase"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </div>

          {/* Phase details */}
          <div
            className="border-l-4 pl-4 mb-4 border-green-500"
            style={{
              borderColor: `var(--tw-text-opacity-${getCategoryColorClass()})`,
            }}
          >
            <h3 className="font-bold text-xl text-gray-800">
              {currentPhase.name}
            </h3>
            <div className="flex items-center mb-2">
              <span
                className={`inline-block text-sm font-medium text-${getCategoryColorClass()} px-2 py-1 bg-gray-100 rounded-full`}
              >
                {currentCategory.name}
              </span>
            </div>
            {currentCategory.description && (
              <p className="text-gray-600 text-sm italic mb-2">
                {currentCategory.description}
              </p>
            )}
            {currentPhase.dependencies.length > 0 && (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Dependencies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentPhase.dependencies.map((dep, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-1 bg-gray-100 rounded-md text-xs"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Task list */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Tasks:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {PHASE_TASKS[currentPhase.name].map((task, index) => (
                <li key={index} className="text-gray-600">
                  {task}
                </li>
              ))}
            </ol>
          </div>

          {/* Progress weighting */}
          <div className="mt-6 bg-gray-50 p-3 rounded-lg text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Weight in project completion:</span>{" "}
              {Math.round(currentPhase.weight * 100)}%
            </p>
          </div>

          {/* Phase navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prevPhase}
              disabled={currentPhaseIndex === 0}
              className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors duration-200 flex items-center ${
                currentPhaseIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            <button
              onClick={nextPhase}
              disabled={currentPhaseIndex === PREDEFINED_PHASES.length - 1}
              className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors duration-200 flex items-center ${
                currentPhaseIndex === PREDEFINED_PHASES.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseTrackerFAQ;
