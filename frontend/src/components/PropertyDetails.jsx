/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { debounce, throttle } from "../utils/performance";
import { formatCurrency, formatPercent } from "../utils/format";
import { savePropertyChanges, savePhase, exportToCSV } from "../utils/property";
import ConstructionDraw from "./ConstructionDraw";
import PhaseTimeline from "./PhaseTimeline";
import PhaseForm from "./PhaseForm";
import ProfitAndLoss from "./ProfitAndLoss";
import OperatingExpense from "./OperatingExpense";
import RentalIncome from "./RentalIncome";
import CapitalExpenditure from "./CapitalExpenditure";
import RentalAnalysis from "./RentalAnalysis";
// import CsvDisplay from "./CsvDisplay";
// import CsvReader from "./CsvReader";
import {
  ChevronsUp,
  ChevronsDown,
  Download,
  Printer,
  Edit2,
  Save,
  X,
  ChevronDown,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearchDropdown from "./ResearchDropdown";

// Property Summary Component
const PropertySummary = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
        <h2 className="text-white text-lg font-semibold">
          Property Summary Dashboard
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Financial Metrics */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Purchase Price</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.purchaseCost)}
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600 font-medium">ARV</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.arvSalePrice)}
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Rehab Cost</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.totalRehabCost)}
            </p>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-600 font-medium">Total Equity</p>
            <p className="text-xl font-bold">
              {formatCurrency(property.totalEquity)}
            </p>
          </div>

          {/* ROI Metrics */}
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Cash ROI</p>
            <p className="text-xl font-bold">
              {formatPercent(property.cashRoi)}
            </p>
          </div>

          <div className="bg-teal-50 p-3 rounded-lg">
            <p className="text-sm text-teal-600 font-medium">Cap Rate</p>
            <p className="text-xl font-bold">
              {formatPercent(property.purchaseCapRate)}
            </p>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium">
              Monthly Cashflow
            </p>
            <p className="text-xl font-bold">
              {formatCurrency(property.cashFlow)}
            </p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">
              Projected Profit
            </p>
            <p className="text-xl font-bold">
              {formatCurrency(property.projectNetProfitIfSold)}
            </p>
          </div>
        </div>

        {/* Property Status */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.numUnits > 1 ? `${property.numUnits} Units` : "1 Unit"}
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.bedroomsDescription || "N/A"} Bed
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.bathroomsDescription || "N/A"} Bath
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.county || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Quick Jump Navigation Component
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

// Memoized Components
const MemoizedProfitAndLoss = memo(ProfitAndLoss);
const MemoizedOperatingExpense = memo(OperatingExpense);
const MemoizedRentalIncome = memo(RentalIncome);
const MemoizedCapitalExpenditure = memo(CapitalExpenditure);
const MemoizedRentalAnalysis = memo(RentalAnalysis);

// Button Styles
const buttonStyles = {
  primary: `
    flex items-center justify-center gap-2 
    min-w-[44px] px-4 py-2.5
    text-sm font-medium text-white
    bg-gradient-to-r from-blue-500 to-blue-600
    hover:from-blue-600 hover:to-blue-700
    rounded-lg shadow hover:shadow-lg
    transform hover:scale-105 active:scale-95
    transition-all duration-200
    sm:min-w-[100px]
  `,
  secondary: `
    flex items-center justify-center gap-2
    min-w-[44px] px-4 py-2.5
    text-sm font-medium text-gray-700
    bg-white hover:bg-gray-50
    border border-gray-300
    rounded-lg shadow hover:shadow-lg
    transform hover:scale-105 active:scale-95
    transition-all duration-200
    sm:min-w-[100px]
  `,
  danger: `
    flex items-center justify-center gap-2
    min-w-[44px] px-4 py-2.5
    text-sm font-medium text-white
    bg-gradient-to-r from-red-500 to-red-600
    hover:from-red-600 hover:to-red-700
    rounded-lg shadow hover:shadow-lg
    transform hover:scale-105 active:scale-95
    transition-all duration-200
    sm:min-w-[100px]
  `,
  success: `
    flex items-center justify-center gap-2
    min-w-[44px] px-4 py-2.5
    text-sm font-medium text-white
    bg-gradient-to-r from-green-500 to-green-600
    hover:from-green-600 hover:to-green-700
    rounded-lg shadow hover:shadow-lg
    transform hover:scale-105 active:scale-95
    transition-all duration-200
    sm:min-w-[100px]
  `,
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error, resetError }) => (
  <div className="p-4 bg-red-50 rounded-lg text-red-700">
    <h3 className="font-bold mb-2">Something went wrong</h3>
    <p className="text-sm">{error.message}</p>
    <button
      onClick={resetError}
      className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200"
    >
      Try again
    </button>
  </div>
);

// Floating Action Button Component
const FloatingActionButton = ({ onClick }) => (
  <div className="fixed bottom-4 right-4 sm:hidden z-50">
    <button
      onClick={onClick}
      className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors duration-200"
      aria-label="Quick actions"
    >
      <Edit2 size={24} />
    </button>
  </div>
);

// Field Group Component - This groups the sections together
const FieldGroup = ({
  title,
  children,
  isExpanded,
  onToggle,
  icon = null,
  importance = "normal",
  "data-field-group": dataFieldGroup,
}) => {
  // Color themes based on importance
  const importanceStyles = {
    high: "border-l-4 border-blue-500",
    normal: "border-l-4 border-gray-300",
    low: "border-l-4 border-gray-200",
  };

  return (
    <div
      className={`mb-6 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${importanceStyles[importance]}`}
      data-field-group={dataFieldGroup}
      id={`section-${dataFieldGroup}`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          {title}
        </h3>
        <ChevronDown
          size={20}
          className={`transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>
      {isExpanded && <div className="space-y-4 mt-4">{children}</div>}
    </div>
  );
};

// Offline Indicator Component
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 w-full bg-yellow-500 text-white text-center py-2 z-50">
      You are currently offline
    </div>
  );
};

// Print Styles
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    .print-full-width {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .page-break-after {
      page-break-after: always;
    }
    @page {
      margin: 2cm;
    }
  }
`;

// Sticky Action Bar Component
const StickyActionBar = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onPrint,
  onToggleGroups,
  expandedGroups,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg px-4 py-3">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
      <div className="flex-1 flex justify-start">
        {!isEditing && (
          <button
            onClick={onPrint}
            className={`${buttonStyles.secondary} hidden sm:flex`}
            aria-label="Print property information"
          >
            <Printer size={18} className="sm:mr-1" />
            <span className="hidden sm:inline">Print</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={onCancel}
              className={`${buttonStyles.danger} flex-1 sm:flex-none max-w-[200px]`}
              aria-label="Cancel editing"
            >
              <X size={18} className="sm:mr-1" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
            <button
              onClick={onSave}
              className={`${buttonStyles.success} flex-1 sm:flex-none max-w-[200px]`}
              aria-label="Save changes"
            >
              <Save size={18} className="sm:mr-1" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className={`${buttonStyles.primary} flex-1 sm:flex-none max-w-[200px]`}
            aria-label="Edit property details"
          >
            <Edit2 size={18} className="sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {!isEditing && (
          <button
            onClick={onToggleGroups}
            className={`${buttonStyles.success} hidden sm:flex`}
            aria-label={
              expandedGroups ? "Collapse all sections" : "Expand all sections"
            }
          >
            {expandedGroups ? (
              <ChevronsUp size={18} className="sm:mr-1" />
            ) : (
              <ChevronsDown size={18} className="sm:mr-1" />
            )}
            <span className="hidden sm:inline">
              {expandedGroups ? "Collapse" : "Expand"}
            </span>
          </button>
        )}
      </div>
    </div>
  </div>
);

const PropertyDetails = ({ propertyId }) => {
  const detailsPrintRef = useRef(null);
  const financialsPrintRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    financialDetails: false,
    utilityInfo: false,
    contactInfo: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [phases, setPhases] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({
    foreclosureInfo: false,
    location: false,
    departments: false,
    outlayToDate: true,
    saleProjection: true,
    utilityInformation: false,
    keyPlayers: false,
    lender: false,
    salesAndMarketing: false,
  });
  const [isAddingPhase, setIsAddingPhase] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSectionChange(1),
    onSwipedRight: () => handleSectionChange(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleSectionChange = (direction) => {
    const sections = Object.keys(expandedSections);
    const currentIndex = sections.findIndex(
      (section) => expandedSections[section]
    );
    const nextIndex = Math.max(
      0,
      Math.min(sections.length - 1, currentIndex + direction)
    );

    const newExpandedSections = {};
    sections.forEach((section, index) => {
      newExpandedSections[section] = index === nextIndex;
    });
    setExpandedSections(newExpandedSections);
  };

  // Add style tag for print styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Calculate progress
  const calculateProgress = () => {
    if (!editedDetails || Object.keys(editedDetails).length === 0) return 0;

    const totalFields = Object.keys(editedDetails).length;
    const filledFields = Object.values(editedDetails).filter(
      (value) => value && value.toString().trim() !== ""
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  const resetError = () => {
    setError(null);
    fetchPropertyDetails();
  };

  const fetchPropertyDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching property details");
      }

      const data = await response.json();
      setPropertyDetails(data);
      setEditedDetails(data);
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Failed to load property details");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchPropertyDetails();

    const fetchPhases = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/phases/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching phases");
        }

        const data = await response.json();
        setPhases(data);
      } catch (error) {
        console.error("Error fetching phases:", error);
      }
    };

    fetchPhases();
  }, [propertyId, fetchPropertyDetails]);

  const handleSaveChanges = async () => {
    try {
      await savePropertyChanges(
        editedDetails,
        propertyId,
        setIsEditing,
        setPropertyDetails
      );
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save changes");
    }
  };

  // Create a ref to hold the debounced function
  const debouncedSaveRef = useRef(null);

  // Setup the debounced save function
  useEffect(() => {
    debouncedSaveRef.current = debounce(async (details) => {
      try {
        await savePropertyChanges(
          details,
          propertyId,
          () => {},
          () => {}
        );
      } catch (error) {
        console.error("Error auto-saving:", error);
      }
    }, 1000);

    // Cleanup function
    return () => {
      debouncedSaveRef.current?.cancel?.();
    };
  }, [propertyId]);

  // Create a stable callback that uses the ref
  const debouncedSave = useCallback((details) => {
    debouncedSaveRef.current?.(details);
  }, []);

  /*
  Throttled scroll handler
  1. Throttles scroll events to reduce the number of times the handler is called
  2. Uses throttle to prevent rapid calls to handleScroll
  3. Properly handles the throttled scroll handler
  */
  // Create a ref for the throttled scroll handler
  const throttledScrollRef = useRef(null);

  // Setup the throttled scroll function
  useEffect(() => {
    throttledScrollRef.current = throttle(() => {
      const sections = Object.keys(expandedSections);
      const viewportHeight = window.innerHeight;

      sections.forEach((section) => {
        const element = document.getElementById(`section-${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= viewportHeight / 2) {
            setExpandedSections((prev) => ({
              ...prev,
              [section]: true,
            }));
          }
        }
      });
    }, 100);

    return () => {
      throttledScrollRef.current?.cancel?.();
    };
  }, [expandedSections]);

  // Create a stable callback that uses the ref
  const handleScroll = useCallback(() => {
    throttledScrollRef.current?.();
  }, []);

  // Use effect for scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* Optimized input handler - This is used to handle the input changes whenever
  the user types in the input fields. It debounces the input to prevent
  excessive calls to the server and saves the changes to the server.
  */
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setEditedDetails((prev) => {
        const updatedDetails = {
          ...prev,
          [name]: value,
        };

        debouncedSave(updatedDetails);
        return updatedDetails;
      });
    },
    [debouncedSave]
  );

  const toggleEditMode = () => {
    if (isEditing) {
      // If we're currently editing, treat this as a save operation
      handleSaveChanges();
    } else {
      // If we're not editing, enter edit mode
      setIsEditing(true);
    }
  };

  const cancelChanges = () => {
    setEditedDetails(propertyDetails);
    setError("");
    setIsEditing(false);

    toast.info("Changes cancelled", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const renderInputField = (label, name, type = "text", isNumber = false) => {
    const value = isEditing ? editedDetails[name] : propertyDetails?.[name];
    const isRequired = [
      "propertyName",
      "address",
      "city",
      "state",
      "zipCode",
    ].includes(name);
    const hasError = error && isRequired && !value && type !== "number";

    return (
      <div className="form-group mb-4">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={name}
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          id={name}
          type={type}
          name={name}
          value={value || ""}
          onChange={handleInputChange}
          disabled={!isEditing}
          required={isRequired}
          className={`
            w-full px-3 py-2 rounded-lg border
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 ease-in-out
            ${isNumber ? "text-right" : ""}
            ${hasError ? "border-red-500" : "border-gray-300"}
            ${isRequired ? "bg-gray-50" : ""}
            ${!isEditing ? "bg-gray-50 text-gray-700" : ""}
          `}
        />
        {hasError && (
          <p className="mt-1 text-sm text-red-500">{`${label} is required`}</p>
        )}
      </div>
    );
  };

  const handlePrintDetails = () => {
    if (detailsPrintRef.current) {
      window.print();
    }
  };

  const handlePrintFinancials = () => {
    if (financialsPrintRef.current) {
      window.print();
    }
  };

  const handleEditPhase = (phase) => {
    setEditedDetails(phase);
    setIsEditing(true);
    setIsAddingPhase(false); // Make sure we're not in adding mode
  };

  const handleDeletePhase = async (phaseId) => {
    if (window.confirm("Are you sure you want to delete this phase?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/phases/${phaseId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error deleting phase");
        }

        setPhases(phases.filter((phase) => phase.id !== phaseId));
        toast.success("Phase deleted successfully");
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to delete phase");
      }
    }
  };

  const handleSavePhase = async (formData) => {
    return savePhase(
      formData,
      propertyId,
      setPhases,
      setIsEditing,
      setIsAddingPhase,
      setEditedDetails
    );
  };

  const handleAddPhase = () => {
    setEditedDetails({}); // Reset current phase to empty
    setIsAddingPhase(true);
    setIsEditing(false);
  };

  const handleCancelPhase = () => {
    setEditedDetails({});
    setIsAddingPhase(false);
    setIsEditing(false);
  };

  const toggleAllGroups = () => {
    const allExpanded = Object.values(expandedGroups).every((val) => val);
    setExpandedGroups((prevGroups) => {
      const newGroups = {};
      Object.keys(prevGroups).forEach((key) => {
        newGroups[key] = !allExpanded;
      });
      return newGroups;
    });
  };

  // Enhanced card styles
  const cardStyles = `
    bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden
    transition-all duration-300 ease-in-out
    hover:shadow-xl transform hover:-translate-y-1
    focus-within:ring-2 focus-within:ring-blue-500
    p-4 sm:p-6 lg:p-8
    mx-4 sm:mx-0
  `;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error && !propertyDetails) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  if (!propertyDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p>The requested property details could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-24"
      {...swipeHandlers}
    >
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="sm:bottom-4 bottom-2 sm:right-4 right-2"
        toastClassName="sm:min-w-[300px] min-w-[250px] shadow-lg"
      />

      <OfflineIndicator />

      {/* Floating Action Button for mobile */}
      <FloatingActionButton onClick={toggleEditMode} />

      {/* Header Section */}
      <header
        className="max-w-7xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8"
        role="banner"
      >
        <div className="text-center sm:text-left">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 
                       break-words leading-tight"
            aria-label={`Property Details for ${propertyDetails.propertyName}`}
          >
            {propertyDetails.propertyName}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 break-words">
            {propertyDetails.address}
          </p>
        </div>
      </header>

      {/* Add Research Dropdown */}
      <div className="max-w-7xl mx-auto mb-6 px-4 sm:px-6 lg:px-8">
        <ResearchDropdown />
      </div>

      {/* Property Summary Dashboard */}
      {propertyDetails && (
        <div className="max-w-7xl mx-auto mb-6 px-4 sm:px-6 lg:px-8">
          <PropertySummary property={propertyDetails} />
        </div>
      )}

      {/* Quick Jump Navigation */}
      <div className="max-w-7xl mx-auto mb-6 px-4 sm:px-6 lg:px-8">
        <QuickJump
          sections={{
            location: { title: "Location", icon: "📍" },
            foreclosureInfo: { title: "Foreclosure", icon: "🏠" },
            departments: { title: "Departments", icon: "🏛️" },
            outlayToDate: { title: "Financials", icon: "💰" },
            saleProjection: { title: "Sale Projection", icon: "📈" },
            utilityInformation: { title: "Utilities", icon: "⚡" },
            lender: { title: "Lending", icon: "🏦" },
            keyPlayers: { title: "Key Players", icon: "👥" },
            salesAndMarketing: { title: "Management", icon: "🏢" },
          }}
          expandedGroups={expandedGroups}
          setExpandedGroups={setExpandedGroups}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Construction Progress Card */}
        <section className={`${cardStyles} p-6`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span role="img" aria-label="Construction">
              🏗️
            </span>
            Construction Progress
          </h2>
          <ConstructionDraw propertyId={propertyId} />
        </section>

        {/* Project Timeline Card */}
        <section className={`${cardStyles} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span role="img" aria-label="Timeline">
                📅
              </span>
              Project Timeline
            </h2>
            <button
              onClick={handleAddPhase}
              className={buttonStyles.primary}
              aria-label="Add new phase"
            >
              Add Phase
            </button>
          </div>
          <PhaseTimeline
            phases={phases}
            onEdit={handleEditPhase}
            onDelete={handleDeletePhase}
          />
          {(isEditing || isAddingPhase) && (
            <div className="mt-6">
              <PhaseForm
                initialData={editedDetails}
                onSave={handleSavePhase}
                onCancel={handleCancelPhase}
              />
            </div>
          )}
        </section>

        {/* Property Information Card */}
        <section className={`${cardStyles} p-6`} ref={detailsPrintRef}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span role="img" aria-label="Details">
                📋
              </span>
              Property Information
            </h2>

            {/* Add search field for property information */}
            <div className="relative w-full max-w-xs ml-auto">
              <input
                type="text"
                placeholder="Search fields..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  // Implementation for filtering visible fields based on search term
                  const searchTerm = e.target.value.toLowerCase();
                  const allGroups =
                    document.querySelectorAll("[data-field-group]");

                  if (!searchTerm) {
                    allGroups.forEach((group) => {
                      group.style.display = "block";
                    });
                    return;
                  }

                  allGroups.forEach((group) => {
                    const fieldLabels = Array.from(
                      group.querySelectorAll("label")
                    ).map((label) => label.textContent.toLowerCase());
                    const visible = fieldLabels.some((label) =>
                      label.includes(searchTerm)
                    );
                    group.style.display = visible ? "block" : "none";
                  });
                }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FieldGroup
              title="Location"
              icon="📍"
              importance="high"
              isExpanded={expandedGroups.location}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  location: !prev.location,
                }))
              }
              data-field-group="location"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInputField("Property Name", "propertyName")}
                {renderInputField("Address", "address")}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {renderInputField("City", "city")}
                {renderInputField("State", "state")}
                {renderInputField("Zip Code", "zipCode", "number")}
              </div>
              {renderInputField("County", "county")}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">
                  Property Features
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField("Bedrooms", "bedroomsDescription")}
                  {renderInputField("Bathrooms", "bathroomsDescription")}
                </div>
                {renderInputField("Kitchen", "kitchenDescription")}
                {renderInputField("Amenities", "amenitiesDescription")}
              </div>
            </FieldGroup>

            <FieldGroup
              title="Foreclosure Information"
              icon="🏠"
              isExpanded={expandedGroups.foreclosureInfo}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  foreclosureInfo: !prev.foreclosureInfo,
                }))
              }
              data-field-group="foreclosureInfo"
            >
              <div className="grid grid-cols-2 gap-4">
                {renderInputField("Detail Link", "detail_link")}
                {renderInputField("Property ID", "property_id")}
              </div>
              {renderInputField("Sheriff Number", "sheriff_number")}
              {renderInputField("Status Date", "status_date", "date")}
              <div className="grid grid-cols-1 gap-4 mt-4 pt-4 border-t border-gray-100">
                {renderInputField("Plaintiff", "plaintiff")}
                {renderInputField("Defendant", "defendant")}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                {renderInputField("Zillow URL", "zillow_url")}
              </div>
            </FieldGroup>

            <FieldGroup
              title="Departments"
              icon="🏛️"
              isExpanded={expandedGroups.departments}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  departments: !prev.departments,
                }))
              }
              data-field-group="departments"
            >
              {renderInputField(
                "Municipal Building Address",
                "municipalBuildingAddress"
              )}
              <div className="grid grid-cols-1 gap-4 mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-2">
                  Department Contacts
                </h4>
                {renderInputField("Building Dept", "buildingDepartmentContact")}
                {renderInputField("Electric Dept", "electricDepartmentContact")}
                {renderInputField("Plumbing Dept", "plumbingDepartmentContact")}
                {renderInputField("Fire Dept", "fireDepartmentContact")}
                {renderInputField(
                  "Homeowners Association",
                  "homeownersAssociationContact"
                )}
                {renderInputField(
                  "Environmental Dept",
                  "environmentalDepartmentContact"
                )}
              </div>
            </FieldGroup>

            <FieldGroup
              title="Total Outlay To Date"
              icon="💰"
              importance="high"
              isExpanded={expandedGroups.outlayToDate}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  outlayToDate: !prev.outlayToDate,
                }))
              }
              data-field-group="outlayToDate"
            >
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-blue-700 mb-2">
                  Purchase & Refinance
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Purchase Cost",
                    "purchaseCost",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Refinance Cost",
                    "refinanceCost",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-green-700 mb-2">
                  Construction & Renovation
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Equipment Cost",
                    "equipmentCost",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Construction Cost",
                    "constructionCost",
                    "number",
                    true
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField(
                    "Large Repair Cost",
                    "largeRepairCost",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Renovation Cost",
                    "renovationCost",
                    "number",
                    true
                  )}
                </div>
                <div className="mt-2">
                  {renderInputField(
                    "Total Rehab Cost",
                    "totalRehabCost",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-purple-700 mb-2">Funding</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Kick Start Funds",
                    "kickStartFunds",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Lender Construction Draws",
                    "lenderConstructionDrawsReceived",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-orange-700 mb-2">
                  Operating Costs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Utilities Cost",
                    "utilitiesCost",
                    "number",
                    true
                  )}
                  {renderInputField("Sewer Yearly", "sewer", "number", true)}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField("Water Yearly", "water", "number", true)}
                  {renderInputField("Lawn Yearly", "lawn", "number", true)}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField(
                    "Garbage Yearly",
                    "garbage",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Property Taxes Yearly",
                    "yearlyPropertyTaxes",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-red-700 mb-2">Expenses</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Mortgage Paid",
                    "mortgagePaid",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Homeowners Insurance",
                    "homeownersInsurance",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-yellow-700 mb-2">
                  Rental Income
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Expected Yearly Rent",
                    "expectedYearlyRent",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Rental Income Received",
                    "rentalIncomeReceived",
                    "number",
                    true
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField(
                    "Number of Units",
                    "numUnits",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Vacancy Rate %",
                    "vacancyRate",
                    "number",
                    true
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField(
                    "Avg Tenant Stay (months)",
                    "avgTenantStay",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Other Monthly Income",
                    "otherMonthlyIncome",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Management</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Vacancy Loss",
                    "vacancyLoss",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Management Fees",
                    "managementFees",
                    "number",
                    true
                  )}
                </div>
                <div className="mt-2">
                  {renderInputField(
                    "Maintenance Costs",
                    "maintenanceCosts",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="border-t-2 border-black border-solid my-4"></div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <h4 className="font-medium text-indigo-700 mb-2 text-center">
                  Summary
                </h4>
                {renderInputField(
                  "Total Equity",
                  "totalEquity",
                  "number",
                  true
                )}
              </div>
            </FieldGroup>

            <FieldGroup
              title="Sale Projection"
              icon="📈"
              importance="high"
              isExpanded={expandedGroups.saleProjection}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  saleProjection: !prev.saleProjection,
                }))
              }
              data-field-group="saleProjection"
            >
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-green-700 mb-2">Sale Value</h4>
                {renderInputField(
                  "ARV Sale Price",
                  "arvSalePrice",
                  "number",
                  true
                )}
              </div>

              <div className="bg-red-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-red-700 mb-2">
                  Transaction Costs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Realtor Fees",
                    "realtorFees",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Attorney Fees",
                    "attorneyFees",
                    "number",
                    true
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField(
                    "Remaining Property Tax",
                    "propTaxTillEndOfYear",
                    "number",
                    true
                  )}
                  {renderInputField("Misc Fees", "miscFees", "number", true)}
                </div>
                <div className="mt-2">
                  {renderInputField("Utilities", "utilities", "number", true)}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-blue-700 mb-2">
                  Loan Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Lender Loan Balance",
                    "lenderLoanBalance",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Pay Off Statement",
                    "payOffStatement",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-purple-700 mb-2">Cash Flow</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Cash to Close from Purchase",
                    "cash2closeFromPurchase",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Cash to Close from Refinance",
                    "cash2closeFromRefinance",
                    "number",
                    true
                  )}
                </div>
                <div className="mt-2">
                  {renderInputField(
                    "Total Rehab Costs",
                    "totalRehabCosts",
                    "number",
                    true
                  )}
                </div>
                <div className="mt-2">
                  {renderInputField(
                    "Expected Remaining Rent End To Year",
                    "expectedRemainingRentEndToYear",
                    "number",
                    true
                  )}
                </div>
                {renderInputField(
                  "Mortgage Paid",
                  "mortgagePaid",
                  "number",
                  true
                )}
              </div>

              <div className="border-t-2 border-black border-solid my-4"></div>

              <div className="bg-orange-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-orange-700 mb-2">Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Total Expenses",
                    "totalExpenses",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Total Expected Draws In",
                    "totalConstructionDrawsReceived",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="border-t-2 border-black border-solid my-4"></div>

              <div className="bg-indigo-100 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-indigo-700 mb-2 text-center">
                  Profitability Analysis
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Project Net Profit If Sold",
                    "projectNetProfitIfSold",
                    "number",
                    true
                  )}
                  {renderInputField("Cash Flow", "cashFlow", "number", true)}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField("Cash ROI", "cashRoi", "number", true)}
                  {renderInputField(
                    "Finance Amount",
                    "financeAmount",
                    "number",
                    true
                  )}
                </div>
              </div>

              <div className="bg-teal-100 p-3 rounded-lg">
                <h4 className="font-medium text-teal-700 mb-2 text-center">
                  Investment Rules
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Rule 2 Percent",
                    "rule2Percent",
                    "number",
                    true
                  )}
                  {renderInputField(
                    "Rule 50 Percent",
                    "rule50Percent",
                    "number",
                    true
                  )}
                </div>
                <div className="mt-2">
                  {renderInputField(
                    "Purchase Cap Rate",
                    "purchaseCapRate",
                    "number",
                    true
                  )}
                </div>
              </div>
            </FieldGroup>

            <FieldGroup
              title="Utility Information"
              icon="⚡"
              isExpanded={expandedGroups.utilityInformation}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  utilityInformation: !prev.utilityInformation,
                }))
              }
              data-field-group="utilityInformation"
            >
              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-yellow-700 mb-2">
                  Heating & Cooling
                </h4>
                {renderInputField(
                  "Type of Heating & Cooling",
                  "typeOfHeatingAndCooling"
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">💧</span>Water
                  </h4>
                  {renderInputField("Water Company", "waterCompany")}
                  {renderInputField("Account Number", "waterAccountNumber")}
                </div>

                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="font-medium text-amber-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">⚡</span>Electric
                  </h4>
                  {renderInputField("Electric Company", "electricCompany")}
                  {renderInputField("Account Number", "electricAccountNumber")}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">🔥</span>Gas/Oil
                  </h4>
                  {renderInputField("Gas or Oil Company", "gasOrOilCompany")}
                  {renderInputField("Account Number", "gasOrOilAccountNumber")}
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">🌊</span>Sewer
                  </h4>
                  {renderInputField("Sewer Company", "sewerCompany")}
                  {renderInputField("Account Number", "sewerAccountNumber")}
                </div>
              </div>
            </FieldGroup>

            <FieldGroup
              title="Lender Information"
              icon="🏦"
              importance="high"
              isExpanded={expandedGroups.lender}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  lender: !prev.lender,
                }))
              }
              data-field-group="lender"
            >
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-blue-700 mb-2">
                  Primary Lender
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField("Lender", "lender")}
                  {renderInputField("Lender Phone", "lenderPhone")}
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-purple-700 mb-2">
                  Refinance Lender
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField("Refinance Lender", "refinanceLender")}
                  {renderInputField(
                    "Refinance Lender Phone",
                    "refinanceLenderPhone"
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-green-700 mb-2">
                  Loan Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField("Loan Officer", "loanOfficer")}
                  {renderInputField("Loan Officer Phone", "loanOfficerPhone")}
                </div>
                {renderInputField("Loan Number", "loanNumber")}
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <h4 className="font-medium text-amber-700 mb-2">Loan Terms</h4>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField(
                    "Down Payment %",
                    "downPaymentPercentage",
                    "number"
                  )}
                  {renderInputField(
                    "Interest Rate %",
                    "loanInterestRate",
                    "number"
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField("PMI %", "pmiPercentage", "number")}
                  {renderInputField(
                    "Mortgage Years",
                    "mortgageYears",
                    "number"
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {renderInputField(
                    "Points Amount",
                    "lenderPointsAmount",
                    "number"
                  )}
                  {renderInputField("Other Fees", "otherFees", "number")}
                </div>
              </div>
            </FieldGroup>

            <FieldGroup
              title="Key Players"
              icon="👥"
              isExpanded={expandedGroups.keyPlayers}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  keyPlayers: !prev.keyPlayers,
                }))
              }
              data-field-group="keyPlayers"
            >
              {renderInputField("Seller's Agent", "sellersAgent")}
              {renderInputField("Seller's Broker", "sellersBroker")}
              {renderInputField("Seller's Agent Phone", "sellersAgentPhone")}
              {renderInputField("Seller's Attorney", "sellersAttorney")}
              {renderInputField(
                "Seller's Attorney Phone",
                "sellersAttorneyPhone"
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Escrow Company", "escrowCompany")}
              {renderInputField("Escrow Agent", "escrowAgent")}
              {renderInputField("Escrow Agent Phone", "escrowAgentPhone")}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Buyer's Agent", "buyersAgent")}
              {renderInputField("Buyer's Broker", "buyersBroker")}
              {renderInputField("Buyer's Agent Phone", "buyersAgentPhone")}
              {renderInputField("Buyer's Attorney", "buyersAttorney")}
              {renderInputField(
                "Buyer's Attorney Phone",
                "buyersAttorneyPhone"
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField(
                "Title Insurance Company",
                "titleInsuranceCompany"
              )}
              {renderInputField("Title Agent", "titleAgent")}
              {renderInputField("Title Agent Phone", "titleAgentPhone")}
              {renderInputField("Title Company Phone", "titlePhone")}
            </FieldGroup>

            <FieldGroup
              title="Sales & Marketing"
              icon="🏢"
              isExpanded={expandedGroups.salesAndMarketing}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  salesAndMarketing: !prev.salesAndMarketing,
                }))
              }
              data-field-group="salesAndMarketing"
            >
              {renderInputField("Property Manager", "propertyManager")}
              {renderInputField(
                "Property Manager Phone",
                "propertyManagerPhone"
              )}
              {renderInputField(
                "Property Management Company",
                "propertyManagementCompany"
              )}
              {renderInputField(
                "Property Management Phone",
                "propertyManagementPhone"
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Photographer", "photographer")}
              {renderInputField("Photographer Phone", "photographerPhone")}
              {renderInputField("Videographer", "videographer")}
              {renderInputField("Videographer Phone", "videographerPhone")}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Appraisal Company", "appraisalCompany")}
              {renderInputField("Appraiser", "appraiser")}
              {renderInputField("Appraiser Phone", "appraiserPhone")}
              {renderInputField("Surveyor", "surveyor")}
              {renderInputField("Surveyor Phone", "surveyorPhone")}
              {renderInputField("Home Inspector", "homeInspector")}
              {renderInputField("Home Inspector Phone", "homeInspectorPhone")}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Architect", "architect")}
              {renderInputField("Architect Phone", "architectPhone")}
            </FieldGroup>
          </div>
        </section>

        {/* Financial Analysis Section */}
        <section
          className={`${cardStyles} print-full-width`}
          ref={financialsPrintRef}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Financial Analysis
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrintFinancials}
                className={buttonStyles.primary}
                aria-label="Print financial analysis"
              >
                <Printer size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">
                  Print Financial Analysis
                </span>
                <span className="sm:hidden">Print</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Profit & Loss Statement
                </h3>
                <button
                  onClick={() =>
                    exportToCSV(propertyDetails.profitLossData, "profit-loss")
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <MemoizedProfitAndLoss property={propertyDetails} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Operating Expenses
                </h3>
                <button
                  onClick={() =>
                    exportToCSV(
                      propertyDetails.operatingExpenseData,
                      "operating-expenses"
                    )
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <MemoizedOperatingExpense property={propertyDetails} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Rental Income
                </h3>
                <button
                  onClick={() =>
                    exportToCSV(
                      propertyDetails.rentalIncomeData,
                      "rental-income"
                    )
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <MemoizedRentalIncome property={propertyDetails} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Capital Expenditure
                </h3>
                <button
                  onClick={() =>
                    exportToCSV(
                      propertyDetails.capExData,
                      "capital-expenditure"
                    )
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <MemoizedCapitalExpenditure property={propertyDetails} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Rental Analysis
                </h3>
                <button
                  onClick={() =>
                    exportToCSV(
                      propertyDetails.rentalAnalysisData,
                      "rental-analysis"
                    )
                  }
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <MemoizedRentalAnalysis property={propertyDetails} />
            </div>
          </div>
        </section>

        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 text-right">
            {progress}% Complete
          </p>
        </div>
      </div>

      {/* Sticky Action Bar*/}
      <StickyActionBar
        isEditing={isEditing}
        onSave={handleSaveChanges}
        onCancel={cancelChanges}
        onEdit={toggleEditMode}
        onPrint={handlePrintDetails}
        onToggleGroups={toggleAllGroups}
        expandedGroups={Object.values(expandedGroups).every((val) => val)}
      />
    </div>
  );
};

export default memo(PropertyDetails);
