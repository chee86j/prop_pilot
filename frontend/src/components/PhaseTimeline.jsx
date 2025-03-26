/* eslint-disable react/prop-types */
import { Chrono } from "react-chrono";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PREDEFINED_PHASES,
  PHASE_CATEGORIES,
  calculateProgress,
} from "../constants/phases";

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
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">
          No phases found. Add your first phase to get started!
        </p>
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

  const getPhaseStatus = (phase) => {
    const now = new Date();
    const startDate = phase.startDate ? new Date(phase.startDate) : null;
    const endDate = phase.endDate ? new Date(phase.endDate) : null;

    if (endDate && endDate < now) return "completed";
    if (startDate && startDate <= now && (!endDate || endDate >= now))
      return "in-progress";
    return "pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  // Calculate progress for each category
  const calculateCategoryProgress = (category) => {
    const categoryPhases = phases.filter((phase) => {
      const predefinedPhase = PREDEFINED_PHASES.find(
        (p) => p.name === phase.name
      );
      return predefinedPhase && predefinedPhase.category === category;
    });

    if (categoryPhases.length === 0) return 0;
    return calculateProgress(categoryPhases);
  };

  const items = phases.map((phase) => {
    const predefinedPhase = PREDEFINED_PHASES.find(
      (p) => p.name === phase.name
    );
    const category = predefinedPhase
      ? PHASE_CATEGORIES[predefinedPhase.category]
      : null;

    return {
      title: phase.name,
      cardTitle: phase.name,
      cardSubtitle: `Expected: ${formatDate(
        phase.expectedStartDate
      )} - ${formatDate(phase.expectedEndDate)}`,
      cardDetailedText: `Actual: ${formatDate(phase.startDate)} - ${formatDate(
        phase.endDate
      )}`,
      status: getPhaseStatus(phase),
      category: category,
    };
  });

  // Mobile view card component
  const PhaseCard = ({ phase }) => {
    const status = getPhaseStatus(phase);
    const statusColor = getStatusColor(status);
    const predefinedPhase = PREDEFINED_PHASES.find(
      (p) => p.name === phase.name
    );
    const category = predefinedPhase
      ? PHASE_CATEGORIES[predefinedPhase.category]
      : null;

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {phase.name}
            </h3>
            {category && (
              <span className={`text-sm text-${category.color}-600`}>
                {category.name}
              </span>
            )}
          </div>
          <div className={`${statusColor} h-3 w-3 rounded-full`} />
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <p className="font-medium">Expected Timeline:</p>
            <p>
              {formatDate(phase.expectedStartDate)} -{" "}
              {formatDate(phase.expectedEndDate)}
            </p>
          </div>
          <div>
            <p className="font-medium">Actual Timeline:</p>
            <p>
              {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => {
              onEdit(phase);
              toast.info("Editing phase...");
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            aria-label="Edit phase"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => {
              onDelete(phase.id);
              toast.success("Phase deleted");
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            aria-label="Delete phase"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  };

  const overallProgress = calculateProgress(phases);
  const categoryProgresses = Object.keys(PHASE_CATEGORIES).map((category) => ({
    ...PHASE_CATEGORIES[category],
    progress: calculateCategoryProgress(category),
  }));

  return (
    <div className="w-full">
      <ToastContainer position="bottom-center" />

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="bg-white rounded-lg shadow-md p-4">
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

          <PhaseCard phase={phases[currentPhaseIndex]} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          ref={containerRef}
          className="w-full"
          style={{ minHeight: "400px", height: "400px" }}
        >
          {mounted ? (
            <Chrono
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
              <div className="animate-pulse text-gray-500">
                Loading timeline...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-6 px-4 space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span className="font-medium">Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Category Progress */}
        <div className="space-y-3">
          {categoryProgresses.map(({ name, color, progress }) => (
            <div key={name}>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>{name}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${color}-500 transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseTimeline;
