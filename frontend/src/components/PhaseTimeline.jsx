/* eslint-disable react/prop-types */
import { Chrono } from "react-chrono";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PREDEFINED_PHASES,
  PHASE_CATEGORIES,
  calculateProgress,
} from "../utils/data";

const PhaseTimeline = ({ phases, onEdit, onDelete }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  // Use this ref to track if component is mounted
  const isMounted = useRef(true);
  // Store toast IDs to be able to dismiss them on unmount
  const toastIds = useRef([]);

  // Cleanup function to dismiss all toasts when component unmounts
  const dismissAllToasts = useCallback(() => {
    toastIds.current.forEach((id) => {
      if (id && toast.isActive(id)) {
        toast.dismiss(id);
      }
    });
    toastIds.current = [];
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      dismissAllToasts();
    };
  }, [dismissAllToasts]);

  useEffect(() => {
    // Reset mounted state when phases change
    setMounted(false);

    // Add small delay to ensure DOM is ready before mounting Chrono
    const timer = setTimeout(() => {
      if (containerRef.current && phases.length > 0) {
        setMounted(true);
      }
    }, 300); // Increased timeout for better reliability

    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, [phases]);

  // Safe toast function that only shows toast if component is still mounted
  const safeToast = useCallback((message, type = "info") => {
    if (isMounted.current) {
      const id = toast[type](message, {
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        pauseOnFocusLoss: false,
        closeButton: false,
      });
      toastIds.current.push(id);
      return id;
    }
    return null;
  }, []);

  // Safe delete handler
  const handleDelete = useCallback(
    (id) => {
      if (isMounted.current) {
        onDelete(id);
        safeToast("Phase deleted", "success");
      }
    },
    [onDelete, safeToast]
  );

  // Safe edit handler
  const handleEdit = useCallback(
    (phase) => {
      if (isMounted.current) {
        onEdit(phase);
        safeToast("Editing phase...");
      }
    },
    [onEdit, safeToast]
  );

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
    // Check for special completion cases
    const hasClosingAndRenovations = phases.some(
      (p) => p.name === "Closing and Renovations" && p.endDate
    );
    const hasFinalsAndFinalInspections =
      phases.some((p) => p.name === "Finals (Operator)" && p.endDate) &&
      phases.some(
        (p) => p.name === "Final Inspections (Municipal)" && p.endDate
      );

    // Handle special cases first
    if (category === "acquisition" && hasClosingAndRenovations) {
      return 100;
    }
    if (
      (category === "renovation" || category === "inspection") &&
      hasFinalsAndFinalInspections
    ) {
      return 100;
    }

    // Regular progress calculation for other cases
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
      cardTitle: (
        <div className="flex items-center justify-between w-full">
          <span>{phase.name}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit(phase);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
              aria-label="Edit phase"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(phase.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
              aria-label="Delete phase"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ),
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
            onClick={() => handleEdit(phase)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            aria-label="Edit phase"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(phase.id)}
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
      <ToastContainer
        position="bottom-center"
        pauseOnFocusLoss={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        limit={3}
        autoClose={2000}
        hideProgressBar
      />

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
          {mounted && containerRef.current && items.length > 0 ? (
            <Chrono
              items={items}
              mode="HORIZONTAL"
              slideItemDuration={4500}
              enableOutline={false}
              disableClickOnCircle={true}
              theme={{
                primary: "rgb(59, 130, 246)",
                secondary: "rgb(239, 246, 255)",
                cardBgColor: "rgb(255, 255, 255)",
                cardForeColor: "rgb(55, 65, 81)",
                titleColor: "rgb(55, 65, 81)",
                cardTitleColor: "rgb(55, 65, 81)",
                cardSubtitleColor: "rgb(107, 114, 128)",
                cardDetailsColor: "rgb(107, 114, 128)",
              }}
              cardHeight={180}
              scrollable
              useReadMore={false}
              hideControls={false}
              classNames={{
                card: "hover:shadow-lg transition-shadow duration-200",
                cardTitle: "flex items-center justify-between w-full",
                cardSubtitle: "text-sm",
                cardText: "text-sm",
              }}
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
