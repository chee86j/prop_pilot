import { useState } from "react";
import { BadgePlus, BadgeMinus } from "lucide-react";
import {
  PREDEFINED_PHASES,
  PHASE_TASKS,
  PHASE_CATEGORIES,
} from "../utils/phaseData";

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

  return (
    <div className="bg-gray-50 hover:bg-gray-200 mb-4 p-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
      <div
        className="cursor-pointer flex items-center"
        onClick={toggleExpansion}
      >
        {expanded ? <BadgeMinus size={24} /> : <BadgePlus size={24} />}
        <h3 className="text-left text-xl font-semibold text-gray-700 md:text-xl font-bold my-1 ml-2">
          What are the Phases in the Property Management Lifecycle?
        </h3>
      </div>

      {expanded && (
        <>
          <div className="my-4">
            <div className="my-2 mx-8">
              <h3 className="text-bold text-lg">{currentPhase.name}</h3>
              <span className={`text-sm text-${currentCategory.color}-600`}>
                {currentCategory.name}
              </span>
              {currentPhase.dependencies.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Dependencies: {currentPhase.dependencies.join(", ")}
                </p>
              )}
            </div>
            <ol className="text-md mx-8">
              {PHASE_TASKS[currentPhase.name].map((task, index) => (
                <li key={index} className="mb-2">
                  {index + 1}. {task}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-between">
            <button
              onClick={prevPhase}
              disabled={currentPhaseIndex === 0}
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ${
                currentPhaseIndex === 0 ? "hidden" : ""
              }`}
            >
              Previous Phase
            </button>
            <button
              onClick={nextPhase}
              disabled={currentPhaseIndex === PREDEFINED_PHASES.length - 1}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                currentPhaseIndex === PREDEFINED_PHASES.length - 1
                  ? "hidden"
                  : ""
              }`}
            >
              Next Phase
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PhaseTrackerFAQ;
