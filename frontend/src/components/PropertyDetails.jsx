/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { debounce, throttle } from "../utils/performanceUtils";
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

// Field Group Component
const FieldGroup = ({ title, children, isExpanded, onToggle }) => (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
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
  const [expandedSections, setExpandedSections] = useState({});
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

  const saveChanges = async (details) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(details),
        }
      );
      if (!response.ok) throw new Error("Failed to save changes");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const debouncedSave = useCallback(
    debounce((details) => {
      saveChanges(details);
    }, 1000),
    [saveChanges]
  );

  // Throttled scroll handler
  /*
  1. Throttles scroll events to reduce the number of times the handler is called
  2. Uses throttle to prevent rapid calls to handleScroll
  3. Properly handles the throttled scroll handler
  */
  const handleScroll = useCallback(
    throttle(() => {
      const sections = Object.keys(expandedSections);
      const viewportHeight = window.innerHeight;

      sections.forEach((section) => {
        const element = document.getElementById(section);
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
    }, 100),
    [expandedSections]
  );

  // Use effect for scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Optimized input handler
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setEditedDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
      debouncedSave({
        ...editedDetails,
        [name]: value,
      });
    },
    [editedDetails, debouncedSave]
  );

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const cancelChanges = () => {
    setEditedDetails(propertyDetails);
    setError("");
    toggleEditMode();

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
    const value = isEditing ? editedDetails[name] : propertyDetails[name];
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
          required={isRequired}
          className={`
            w-full px-3 py-2 rounded-lg border
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 ease-in-out
            ${isNumber ? "text-right" : ""}
            ${hasError ? "border-red-500" : "border-gray-300"}
            ${isRequired ? "bg-gray-50" : ""}
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

  const exportToCSV = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + data;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSavePhase = async (formData) => {
    const phaseData = {
      ...formData,
      property_id: propertyId,
    };

    try {
      const response = await fetch(
        phaseData.id
          ? `http://localhost:5000/api/phases/${phaseData.id}`
          : "http://localhost:5000/api/phases",
        {
          method: phaseData.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(phaseData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving phase");
      }

      // Get the updated phase data from the response
      const savedPhase = await response.json();

      // Update the phases state immediately
      setPhases((currentPhases) =>
        phaseData.id
          ? currentPhases.map((phase) =>
              phase.id === phaseData.id ? savedPhase : phase
            )
          : [...currentPhases, savedPhase]
      );

      // Reset form state
      setIsEditing(false);
      setIsAddingPhase(false);
      setEditedDetails({});
      toast.success("Phase saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to save phase.");
    }
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FieldGroup
              title="Foreclosure Information"
              isExpanded={expandedGroups.foreclosureInfo}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  foreclosureInfo: !prev.foreclosureInfo,
                }))
              }
            >
              {renderInputField("Detail Link", "detail_link")}
              {renderInputField("Property ID", "property_id")}
              {renderInputField("Sheriff Number", "sheriff_number")}
              {renderInputField("Status Date", "status_date", "date")}
              {renderInputField("Plaintiff", "plaintiff")}
              {renderInputField("Defendant", "defendant")}
              {renderInputField("Zillow URL", "zillow_url")}
            </FieldGroup>

            <FieldGroup
              title="Location"
              isExpanded={expandedGroups.location}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  location: !prev.location,
                }))
              }
            >
              {renderInputField("Property Name", "propertyName")}
              {renderInputField("Address", "address")}
              {renderInputField("City", "city")}
              {renderInputField("State", "state")}
              {renderInputField("Zip Code", "zipCode", "number")}
              {renderInputField("County", "county")}
              {renderInputField("Bedrooms", "bedroomsDescription")}
              {renderInputField("Bathrooms", "bathroomsDescription")}
              {renderInputField("Kitchen", "kitchenDescription")}
              {renderInputField("Amenities", "amenitiesDescription")}
            </FieldGroup>

            <FieldGroup
              title="Departments"
              isExpanded={expandedGroups.departments}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  departments: !prev.departments,
                }))
              }
            >
              {renderInputField(
                "Municipal Building Address",
                "municipalBuildingAddress"
              )}
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
            </FieldGroup>

            <FieldGroup
              title="Total Outlay To Date"
              isExpanded={expandedGroups.outlayToDate}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  outlayToDate: !prev.outlayToDate,
                }))
              }
            >
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
              {renderInputField(
                "Total Rehab Cost",
                "totalRehabCost",
                "number",
                true
              )}
              {renderInputField(
                "Kick Start Funds",
                "kickStartFunds",
                "number",
                true
              )}
              {renderInputField(
                "Lender Construction Draws Received",
                "lenderConstructionDrawsReceived",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField(
                "Utilities Cost",
                "utilitiesCost",
                "number",
                true
              )}
              {renderInputField("Sewer Yearly Cost", "sewer", "number", true)}
              {renderInputField("Water Yearly Cost", "water", "number", true)}
              {renderInputField("Lawn Yearly Cost", "lawn", "number", true)}
              {renderInputField(
                "Garbage Yearly Cost",
                "garbage",
                "number",
                true
              )}
              {renderInputField(
                "Yearly Property Taxes",
                "yearlyPropertyTaxes",
                "number",
                true
              )}
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
              {renderInputField("Number of Units", "numUnits", "number", true)}
              {renderInputField("Vacancy Rate", "vacancyRate", "number", true)}
              {renderInputField(
                "Average Tenant Stay",
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
              {renderInputField("Vacancy Loss", "vacancyLoss", "number", true)}
              {renderInputField(
                "Management Fees",
                "managementFees",
                "number",
                true
              )}
              {renderInputField(
                "Maintenance Costs",
                "maintenanceCosts",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Total Equity", "totalEquity", "number", true)}
            </FieldGroup>

            <FieldGroup
              title="Sale Projection"
              isExpanded={expandedGroups.saleProjection}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  saleProjection: !prev.saleProjection,
                }))
              }
            >
              {renderInputField(
                "ARV Sale Price",
                "arvSalePrice",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField("Realtor Fees", "realtorFees", "number", true)}
              {renderInputField(
                "Remaining Property Tax",
                "propTaxTillEndOfYear",
                "number",
                true
              )}
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
              {renderInputField(
                "Attorney Fees",
                "attorneyFees",
                "number",
                true
              )}
              {renderInputField("Misc Fees", "miscFees", "number", true)}
              {renderInputField("Utilities", "utilities", "number", true)}
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
              {renderInputField(
                "Total Rehab Costs",
                "totalRehabCosts",
                "number",
                true
              )}
              {renderInputField(
                "Expected Remaining Rent End To Year",
                "expectedRemainingRentEndToYear",
                "number",
                true
              )}
              {renderInputField(
                "Mortgage Paid",
                "mortgagePaid",
                "number",
                true
              )}
              <div className="border-t-2 border-black border-solid my-4"></div>
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
              <div className="border-t-2 border-black border-solid my-4"></div>
              {renderInputField(
                "Project Net Profit If Sold",
                "projectNetProfitIfSold",
                "number",
                true
              )}
              {renderInputField("Cash Flow", "cashFlow", "number", true)}
              {renderInputField("Cash ROI", "cashRoi", "number", true)}
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
              {renderInputField(
                "Finance Amount",
                "financeAmount",
                "number",
                true
              )}
              {renderInputField(
                "Purchase Cap Rate",
                "purchaseCapRate",
                "number",
                true
              )}
            </FieldGroup>

            <FieldGroup
              title="Utility Information"
              isExpanded={expandedGroups.utilityInformation}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  utilityInformation: !prev.utilityInformation,
                }))
              }
            >
              {renderInputField(
                "Type of Heating & Cooling",
                "typeOfHeatingAndCooling"
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderInputField("Water Company", "waterCompany")}
              {renderInputField("Water Account Number", "waterAccountNumber")}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderInputField("Electric Company", "electricCompany")}
              {renderInputField(
                "Electric Account Number",
                "electricAccountNumber"
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderInputField("Gas or Oil Company", "gasOrOilCompany")}
              {renderInputField(
                "Gas or Oil Account Number",
                "gasOrOilAccountNumber"
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderInputField("Sewer Company", "sewerCompany")}
              {renderInputField("Sewer Account Number", "sewerAccountNumber")}
            </FieldGroup>

            <FieldGroup
              title="Lender Information"
              isExpanded={expandedGroups.lender}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  lender: !prev.lender,
                }))
              }
            >
              {renderInputField("Lender", "lender")}
              {renderInputField("Lender Phone", "lenderPhone")}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderInputField("Refinance Lender", "refinanceLender")}
              {renderInputField(
                "Refinance Lender Phone",
                "refinanceLenderPhone"
              )}
              <div className="border-t-2 border-transparent my-2"></div>
              {renderInputField("Loan Officer", "loanOfficer")}
              {renderInputField("Loan Officer Phone", "loanOfficerPhone")}
              {renderInputField("Loan Number", "loanNumber")}
              {renderInputField(
                "Down Payment Percentage",
                "downPaymentPercentage",
                "number"
              )}
              {renderInputField(
                "Loan Interest Rate",
                "loanInterestRate",
                "number"
              )}
              {renderInputField("PMI Percentage", "pmiPercentage", "number")}
              {renderInputField("Mortgage Years", "mortgageYears", "number")}
              {renderInputField(
                "Lender Points Amount",
                "lenderPointsAmount",
                "number"
              )}
              {renderInputField("Other Fees", "otherFees", "number")}
            </FieldGroup>

            <FieldGroup
              title="Key Players"
              isExpanded={expandedGroups.keyPlayers}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  keyPlayers: !prev.keyPlayers,
                }))
              }
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
              isExpanded={expandedGroups.salesAndMarketing}
              onToggle={() =>
                setExpandedGroups((prev) => ({
                  ...prev,
                  salesAndMarketing: !prev.salesAndMarketing,
                }))
              }
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

      {/* Add the sticky action bar */}
      <StickyActionBar
        isEditing={isEditing}
        onSave={saveChanges}
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
