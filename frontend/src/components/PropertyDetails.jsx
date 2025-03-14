/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
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
import { formatFullCurrency } from "../utils/formatting";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { Download } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearchDropdown from "./ResearchDropdown";

const PropertyDetails = ({ propertyId }) => {
  const detailsPrintRef = useRef(null);
  const financialsPrintRef = useRef(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [phases, setPhases] = useState([]);
  const [isEditingPhase, setIsEditingPhase] = useState(false);
  const [currentPhase, setCurrentPhase] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({
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
  // const [csvData, setCsvData] = useState(null);
  // const handleFileUpload = (data) => {
  //   setCsvData(data); // Store the parsed CSV data
  // };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
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
      }
    };

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

    fetchPropertyDetails();
    fetchPhases();
  }, [propertyId]);

  const handleEditChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editedDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error saving property details");
      }

      const data = await response.json();
      setPropertyDetails(data);
      toggleEditMode();
      toast.success("Property details saved successfully!");
    } catch (error) {
      console.error("Error saving property details:", error);
      toast.error("Failed to save property details.");
    }
  };

  const cancelChanges = () => {
    setEditedDetails(propertyDetails);
    toggleEditMode();
  };

  const renderEditableField = (
    label,
    name,
    value,
    type = "text",
    isCurrency = false
  ) => {
    const displayValue =
      isCurrency && !editMode ? formatFullCurrency(value) : value;
    return (
      <div className="flex justify-between items-center mb-2">
        <strong>{label}:</strong>
        {editMode ? (
          <input
            type={type}
            name={name}
            value={displayValue}
            onChange={handleEditChange}
            className="border rounded px-2 py-1"
          />
        ) : (
          <span>{displayValue}</span>
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

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const toggleAllSections = () => {
    const allExpanded = Object.values(expandedSections).every((val) => val);
    setExpandedSections((prevSections) => {
      const newSections = {};
      for (const section in prevSections) {
        newSections[section] = !allExpanded;
      }
      return newSections;
    });
  };

  const renderSectionTitle = (title, sectionName) => (
    <div
      className="flex justify-between items-center mb-2 cursor-pointer group"
      onClick={() => toggleSection(sectionName)}
    >
      <h2 className="text-lg font-bold text-blue-700 cursor-pointer">
        {title}
      </h2>
      <button className="focus:outline-none transition-transform duration-200 transform group-hover:scale-110">
        {expandedSections[sectionName] ? (
          <ChevronsUp size={20} className="text-blue-600" />
        ) : (
          <ChevronsDown size={20} className="text-blue-600" />
        )}
      </button>
    </div>
  );

  const handleEditPhase = (phase) => {
    setCurrentPhase(phase);
    setIsEditingPhase(true);
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
      setIsEditingPhase(false);
      setIsAddingPhase(false);
      setCurrentPhase({});
      toast.success("Phase saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to save phase.");
    }
  };

  const handleAddPhase = () => {
    setCurrentPhase({}); // Reset current phase to empty
    setIsAddingPhase(true);
    setIsEditingPhase(false);
  };

  const handleCancelPhase = () => {
    setCurrentPhase({});
    setIsAddingPhase(false);
    setIsEditingPhase(false);
  };

  const renderExpandAllButton = () => (
    <button
      onClick={toggleAllSections}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 
      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
      rounded-lg shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
    >
      {Object.values(expandedSections).every((val) => val) ? (
        <>
          <ChevronsUp size={18} className="transition-transform duration-200" />
          <span>Collapse All</span>
        </>
      ) : (
        <>
          <ChevronsDown
            size={18}
            className="transition-transform duration-200"
          />
          <span>Expand All</span>
        </>
      )}
    </button>
  );

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="property-details-container bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      {/* Render ToastContainer for displaying notifications */}
      <ToastContainer position="top-left" autoClose={5000} />
      <header
        className="mb-8 px-4 sm:px-6 lg:px-8"
        role="banner"
        aria-label="Property Details Header"
      >
        <div className="text-center sm:text-left">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold break-words"
            aria-label={`Property Name: ${propertyDetails.propertyName}`}
          >
            {propertyDetails.propertyName}
          </h1>
          <p
            className="text-xl sm:text-2xl text-gray-600 mt-2 break-words"
            aria-label={`Address: ${propertyDetails.address}`}
          >
            {propertyDetails.address}
          </p>
        </div>
      </header>

      {/* Add Due Diligence Dropdown */}
      <ResearchDropdown />

      <button
        onClick={handlePrintDetails}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print Property Details
      </button>

      {/* Wrap all content you want to print in a div with the printRef */}
      <div ref={detailsPrintRef}>
        {/* Construction Draw Section */}
        <section className="mb-12 p-6 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
            Construction Progress
          </h2>
          <ConstructionDraw propertyId={propertyId} />
        </section>

        {/* Phase Timeline Section */}
        <section className="mb-12 p-6 bg-gray-50 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2">
              Project Timeline
            </h2>
          </div>
          <PhaseTimeline
            phases={phases}
            onEdit={handleEditPhase}
            onDelete={handleDeletePhase}
          />
          {isEditingPhase || isAddingPhase ? (
            <div className="mt-6">
              <PhaseForm
                initialData={currentPhase}
                onSave={handleSavePhase}
                onCancel={handleCancelPhase}
              />
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAddPhase}
                className="rounded-lg relative w-32 h-10 mb-5 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
              >
                <span className="text-white font-semibold ml-5 transform group-hover:translate-x-10 transition-all duration-300">
                  Phase
                </span>
                <span className="absolute right-0 h-full w-12 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                  <svg
                    className="svg w-8 text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="12" x2="12" y1="5" y2="19"></line>
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                  </svg>
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Property Details Grid */}
        <section className="mb-12 p-6 bg-gray-50 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2">
              Property Information
            </h2>
            {renderExpandAllButton()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foreclosure Information Section */}
            <div className="foreclosureInfo hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Foreclosure Information", "foreclosureInfo")}
              {expandedSections.foreclosureInfo && (
                <>
                  {renderEditableField(
                    "Detail Link",
                    "detail_link",
                    editedDetails.detail_link || ""
                  )}
                  {renderEditableField(
                    "Property ID",
                    "property_id",
                    editedDetails.property_id || ""
                  )}
                  {renderEditableField(
                    "Sheriff Number",
                    "sheriff_number",
                    editedDetails.sheriff_number || ""
                  )}
                  {renderEditableField(
                    "Status Date",
                    "status_date",
                    editedDetails.status_date || "",
                    "date"
                  )}
                  {renderEditableField(
                    "Plaintiff",
                    "plaintiff",
                    editedDetails.plaintiff || ""
                  )}
                  {renderEditableField(
                    "Defendant",
                    "defendant",
                    editedDetails.defendant || ""
                  )}
                  {renderEditableField(
                    "Zillow URL",
                    "zillow_url",
                    editedDetails.zillow_url || ""
                  )}
                </>
              )}
            </div>

            {/* Location Section */}
            <div className="propLocation hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Location", "location")}
              {expandedSections.location && (
                <>
                  {renderEditableField(
                    "Property Name",
                    "propertyName",
                    editedDetails.propertyName || ""
                  )}
                  {renderEditableField(
                    "Address",
                    "address",
                    editedDetails.address || ""
                  )}
                  {renderEditableField(
                    "City",
                    "city",
                    editedDetails.city || ""
                  )}
                  {renderEditableField(
                    "State",
                    "state",
                    editedDetails.state || ""
                  )}
                  {renderEditableField(
                    "Zip Code",
                    "zipCode",
                    editedDetails.zipCode || "",
                    "number"
                  )}
                  {renderEditableField(
                    "County",
                    "county",
                    editedDetails.county || ""
                  )}
                  {renderEditableField(
                    "Bedrooms",
                    "bedroomsDescription",
                    editedDetails.bedroomsDescription || ""
                  )}
                  {renderEditableField(
                    "Bathrooms",
                    "bathroomsDescription",
                    editedDetails.bathroomsDescription || ""
                  )}
                  {renderEditableField(
                    "Kitchen",
                    "kitchenDescription",
                    editedDetails.kitchenDescription || ""
                  )}
                  {renderEditableField(
                    "Amenities",
                    "amenitiesDescription",
                    editedDetails.amenitiesDescription || ""
                  )}
                </>
              )}
            </div>

            {/* Departments Section */}
            <div className="propDepartments hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Departments", "departments")}
              {expandedSections.departments && (
                <>
                  {renderEditableField(
                    "Municipal Building Address",
                    "municipalBuildingAddress",
                    editedDetails.municipalBuildingAddress || ""
                  )}
                  {renderEditableField(
                    "Building Dept",
                    "buildingDepartmentContact",
                    editedDetails.buildingDepartmentContact || ""
                  )}
                  {renderEditableField(
                    "Electric Dept",
                    "electricDepartmentContact",
                    editedDetails.electricDepartmentContact || ""
                  )}
                  {renderEditableField(
                    "Plumbing Dept",
                    "plumbingDepartmentContact",
                    editedDetails.plumbingDepartmentContact || ""
                  )}
                  {renderEditableField(
                    "Fire Dept",
                    "fireDepartmentContact",
                    editedDetails.fireDepartmentContact || ""
                  )}
                  {renderEditableField(
                    "Homeowners Association",
                    "homeownersAssociationContact",
                    editedDetails.homeownersAssociationContact || ""
                  )}
                  {renderEditableField(
                    "Environmental Dept",
                    "environmentalDepartmentContact",
                    editedDetails.environmentalDepartmentContact || ""
                  )}
                </>
              )}
            </div>

            {/* Total Outlay To Date Section */}
            <div className="propTotalOutlayToDate hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Total Outlay To Date", "outlayToDate")}
              {expandedSections.outlayToDate && (
                <>
                  {renderEditableField(
                    "Purchase Cost",
                    "purchaseCost",
                    editedDetails.purchaseCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Refinance Cost",
                    "refinanceCost",
                    editedDetails.refinanceCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Equipment Cost",
                    "equipmentCost",
                    editedDetails.equipmentCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Construction Cost",
                    "constructionCost",
                    editedDetails.constructionCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Large Repair Cost",
                    "largeRepairCost",
                    editedDetails.largeRepairCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Renovation Cost",
                    "renovationCost",
                    editedDetails.renovationCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Total Rehab Cost",
                    "totalRehabCost",
                    editedDetails.totalRehabCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Kick Start Funds",
                    "kickStartFunds",
                    editedDetails.kickStartFunds || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Lender Construction Draws Received",
                    "lenderConstructionDrawsReceived",
                    editedDetails.lenderConstructionDrawsReceived || "",
                    "number",
                    true
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Utilities Cost",
                    "utilitiesCost",
                    editedDetails.utilitiesCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Sewer Yearly Cost",
                    "sewer",
                    editedDetails.sewer || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Water Yearly Cost",
                    "water",
                    editedDetails.water || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Lawn Yearly Cost",
                    "lawn",
                    editedDetails.lawn || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Garbage Yearly Cost",
                    "garbage",
                    editedDetails.garbage || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Yearly Property Taxes",
                    "yearlyPropertyTaxes",
                    editedDetails.yearlyPropertyTaxes || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Mortgage Paid",
                    "mortgagePaid",
                    editedDetails.mortgagePaid || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Homeowners Insurance",
                    "homeownersInsurance",
                    editedDetails.homeownersInsurance || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Expected Yearly Rent",
                    "expectedYearlyRent",
                    editedDetails.expectedYearlyRent || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Rental Income Received",
                    "rentalIncomeReceived",
                    editedDetails.rentalIncomeReceived || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Number of Units",
                    "numUnits",
                    editedDetails.numUnits || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Vacancy Rate",
                    "vacancyRate",
                    editedDetails.vacancyRate || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Average Tenant Stay",
                    "avgTenantStay",
                    editedDetails.avgTenantStay || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Other Monthly Income",
                    "otherMonthlyIncome",
                    editedDetails.otherMonthlyIncome || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Vacancy Loss",
                    "vacancyLoss",
                    editedDetails.vacancyLoss || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Management Fees",
                    "managementFees",
                    editedDetails.managementFees || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Maintenance Costs",
                    "maintenanceCosts",
                    editedDetails.maintenanceCosts || "",
                    "number",
                    true
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Total Equity",
                    "totalEquity",
                    editedDetails.totalEquity || "",
                    "number",
                    true
                  )}
                </>
              )}
            </div>

            {/* Sale Projection Section */}
            <div className="propSaleProjection hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Sale Projection", "saleProjection")}
              {expandedSections.saleProjection && (
                <>
                  {renderEditableField(
                    "ARV Sale Price",
                    "arvSalePrice",
                    editedDetails.arvSalePrice || "",
                    "number",
                    true
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Realtor Fees",
                    "realtorFees",
                    editedDetails.realtorFees || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Remaining Property Tax",
                    "propTaxTillEndOfYear",
                    editedDetails.propTaxTillEndOfYear || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Lender Loan Balance",
                    "lenderLoanBalance",
                    editedDetails.lenderLoanBalance || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Pay Off Statement",
                    "payOffStatement",
                    editedDetails.payOffStatement || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Attorney Fees",
                    "attorneyFees",
                    editedDetails.attorneyFees || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Misc Fees",
                    "miscFees",
                    editedDetails.miscFees || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Utilities",
                    "utilities",
                    editedDetails.utilities || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Cash to Close from Purchase",
                    "cash2closeFromPurchase",
                    editedDetails.cash2closeFromPurchase || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Cash to Close from Refinance",
                    "cash2closeFromRefinance",
                    editedDetails.cash2closeFromRefinance || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Total Rehab Costs",
                    "totalRehabCosts",
                    editedDetails.totalRehabCost || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Expected Remaining Rent End To Year",
                    "expectedRemainingRentEndToYear",
                    editedDetails.expectedRemainingRentEndToYear || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Mortgage Paid",
                    "mortgagePaid",
                    editedDetails.mortgagePaid || "",
                    "number",
                    true
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Total Expenses",
                    "totalExpenses",
                    editedDetails.totalExpenses || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Total Expected Draws In",
                    "totalConstructionDrawsReceived",
                    editedDetails.totalConstructionDrawsReceived || "",
                    "number",
                    true
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Project Net Profit If Sold",
                    "projectNetProfitIfSold",
                    editedDetails.projectNetProfitIfSold || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Cash Flow",
                    "cashFlow",
                    editedDetails.cashFlow || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Cash ROI",
                    "cashRoi",
                    editedDetails.cashRoi || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Rule 2 Percent",
                    "rule2Percent",
                    editedDetails.rule2Percent || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Rule 50 Percent",
                    "rule50Percent",
                    editedDetails.rule50Percent || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Finance Amount",
                    "financeAmount",
                    editedDetails.financeAmount || "",
                    "number",
                    true
                  )}
                  {renderEditableField(
                    "Purchase Cap Rate",
                    "purchaseCapRate",
                    editedDetails.purchaseCapRate || "",
                    "number",
                    true
                  )}
                </>
              )}
            </div>

            {/* Utility Information Section */}
            <div className="propUtilityInformation hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Utility Information", "utilityInformation")}
              {expandedSections.utilityInformation && (
                <>
                  {renderEditableField(
                    "Type of Heating & Cooling",
                    "typeOfHeatingAndCooling",
                    editedDetails.typeOfHeatingAndCooling || ""
                  )}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderEditableField(
                    "Water Company",
                    "waterCompany",
                    editedDetails.waterCompany || ""
                  )}
                  {renderEditableField(
                    "Water Account Number",
                    "waterAccountNumber",
                    editedDetails.waterAccountNumber || ""
                  )}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderEditableField(
                    "Electric Company",
                    "electricCompany",
                    editedDetails.electricCompany || ""
                  )}
                  {renderEditableField(
                    "Electric Account Number",
                    "electricAccountNumber",
                    editedDetails.electricAccountNumber || ""
                  )}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderEditableField(
                    "Gas or Oil Company",
                    "gasOrOilCompany",
                    editedDetails.gasOrOilCompany || ""
                  )}
                  {renderEditableField(
                    "Gas or Oil Account Number",
                    "gasOrOilAccountNumber",
                    editedDetails.gasOrOilAccountNumber || ""
                  )}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderEditableField(
                    "Sewer Company",
                    "sewerCompany",
                    editedDetails.sewerCompany || ""
                  )}
                  {renderEditableField(
                    "Sewer Account Number",
                    "sewerAccountNumber",
                    editedDetails.sewerAccountNumber || ""
                  )}
                </>
              )}
            </div>

            {/* Lender Information Section */}
            <div className="propLenderInformation hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Lender", "lender")}
              {expandedSections.lender && (
                <>
                  {renderEditableField(
                    "Lender",
                    "lender",
                    editedDetails.lender || ""
                  )}
                  {renderEditableField(
                    "Lender Phone",
                    "lenderPhone",
                    editedDetails.lenderPhone || ""
                  )}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderEditableField(
                    "Refinance Lender",
                    "refinanceLender",
                    editedDetails.refinanceLender || ""
                  )}
                  {renderEditableField(
                    "Refinance Lender Phone",
                    "refinanceLenderPhone",
                    editedDetails.refinanceLenderPhone || ""
                  )}
                  <div className="border-t-2 border-transparent my-2"></div>
                  {renderEditableField(
                    "Loan Officer",
                    "loanOfficer",
                    editedDetails.loanOfficer || ""
                  )}
                  {renderEditableField(
                    "Loan Officer Phone",
                    "loanOfficerPhone",
                    editedDetails.loanOfficerPhone || ""
                  )}
                  {renderEditableField(
                    "Loan Number",
                    "loanNumber",
                    editedDetails.loanNumber || ""
                  )}
                  {renderEditableField(
                    "Down Payment Percentage",
                    "downPaymentPercentage",
                    editedDetails.downPaymentPercentage || "",
                    "number"
                  )}
                  {renderEditableField(
                    "Loan Interest Rate",
                    "loanInterestRate",
                    editedDetails.loanInterestRate || "",
                    "number"
                  )}
                  {renderEditableField(
                    "PMI Percentage",
                    "pmiPercentage",
                    editedDetails.pmiPercentage || "",
                    "number"
                  )}
                  {renderEditableField(
                    "Mortgage Years",
                    "mortgageYears",
                    editedDetails.mortgageYears || "",
                    "number"
                  )}
                  {renderEditableField(
                    "Lender Points Amount",
                    "lenderPointsAmount",
                    editedDetails.lenderPointsAmount || "",
                    "number"
                  )}
                  {renderEditableField(
                    "Other Fees",
                    "otherFees",
                    editedDetails.otherFees || "",
                    "number"
                  )}
                </>
              )}
            </div>

            {/* Key Players Section */}
            <div className="propKeyPlayers hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Key Players", "keyPlayers")}
              {expandedSections.keyPlayers && (
                <>
                  {renderEditableField(
                    "Seller's Agent",
                    "sellersAgent",
                    editedDetails.sellersAgent || ""
                  )}
                  {renderEditableField(
                    "Seller's Broker",
                    "sellersBroker",
                    editedDetails.sellersBroker || ""
                  )}
                  {renderEditableField(
                    "Seller's Agent Phone",
                    "sellersAgentPhone",
                    editedDetails.sellersAgentPhone || ""
                  )}
                  {renderEditableField(
                    "Seller's Attorney",
                    "sellersAttorney",
                    editedDetails.sellersAttorney || ""
                  )}
                  {renderEditableField(
                    "Seller's Attorney Phone",
                    "sellersAttorneyPhone",
                    editedDetails.sellersAttorneyPhone || ""
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Escrow Company",
                    "escrowCompany",
                    editedDetails.escrowCompany || ""
                  )}
                  {renderEditableField(
                    "Escrow Agent",
                    "escrowAgent",
                    editedDetails.escrowAgent || ""
                  )}
                  {renderEditableField(
                    "Escrow Agent Phone",
                    "escrowAgentPhone",
                    editedDetails.escrowAgentPhone || ""
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Buyer's Agent",
                    "buyersAgent",
                    editedDetails.buyersAgent || ""
                  )}
                  {renderEditableField(
                    "Buyer's Broker",
                    "buyersBroker",
                    editedDetails.buyersBroker || ""
                  )}
                  {renderEditableField(
                    "Buyer's Agent Phone",
                    "buyersAgentPhone",
                    editedDetails.buyersAgentPhone || ""
                  )}
                  {renderEditableField(
                    "Buyer's Attorney",
                    "buyersAttorney",
                    editedDetails.buyersAttorney || ""
                  )}
                  {renderEditableField(
                    "Buyer's Attorney Phone",
                    "buyersAttorneyPhone",
                    editedDetails.buyersAttorneyPhone || ""
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Title Insurance Company",
                    "titleInsuranceCompany",
                    editedDetails.titleInsuranceCompany || ""
                  )}
                  {renderEditableField(
                    "Title Agent",
                    "titleAgent",
                    editedDetails.titleAgent || ""
                  )}
                  {renderEditableField(
                    "Title Agent Phone",
                    "titleAgentPhone",
                    editedDetails.titleAgentPhone || ""
                  )}
                  {renderEditableField(
                    "Title Company Phone",
                    "titlePhone",
                    editedDetails.titlePhone || ""
                  )}
                </>
              )}
            </div>

            {/* Sales & Marketing Section */}
            <div className="propSalesAndMarketing hover:bg-gray-100 hover:scale-105 bg-gray-50 p-4 shadow-sm rounded-md">
              {renderSectionTitle("Sales & Marketing", "salesAndMarketing")}
              {expandedSections.salesAndMarketing && (
                <>
                  {renderEditableField(
                    "Property Manager",
                    "propertyManager",
                    editedDetails.propertyManager || ""
                  )}
                  {renderEditableField(
                    "Property Manager Phone",
                    "propertyManagerPhone",
                    editedDetails.propertyManagerPhone || ""
                  )}
                  {renderEditableField(
                    "Property Management Company",
                    "propertyManagementCompany",
                    editedDetails.propertyManagementCompany || ""
                  )}
                  {renderEditableField(
                    "Property Management Phone",
                    "propertyManagementPhone",
                    editedDetails.propertyManagementPhone || ""
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Photographer",
                    "photographer",
                    editedDetails.photographer || ""
                  )}
                  {renderEditableField(
                    "Photographer Phone",
                    "photographerPhone",
                    editedDetails.photographerPhone || ""
                  )}
                  {renderEditableField(
                    "Videographer",
                    "videographer",
                    editedDetails.videographer || ""
                  )}
                  {renderEditableField(
                    "Videographer Phone",
                    "videographerPhone",
                    editedDetails.videographerPhone || ""
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Appraisal Company",
                    "appraisalCompany",
                    editedDetails.appraisalCompany || ""
                  )}
                  {renderEditableField(
                    "Appraiser",
                    "appraiser",
                    editedDetails.appraiser || ""
                  )}
                  {renderEditableField(
                    "Appraiser Phone",
                    "appraiserPhone",
                    editedDetails.appraiserPhone || ""
                  )}
                  {renderEditableField(
                    "Surveyor",
                    "surveyor",
                    editedDetails.surveyor || ""
                  )}
                  {renderEditableField(
                    "Surveyor Phone",
                    "surveyorPhone",
                    editedDetails.surveyorPhone || ""
                  )}
                  {renderEditableField(
                    "Home Inspector",
                    "homeInspector",
                    editedDetails.homeInspector || ""
                  )}
                  {renderEditableField(
                    "Home Inspector Phone",
                    "homeInspectorPhone",
                    editedDetails.homeInspectorPhone || ""
                  )}
                  <div className="border-t-2 border-black border-solid my-4"></div>
                  {renderEditableField(
                    "Architect",
                    "architect",
                    editedDetails.architect || ""
                  )}
                  {renderEditableField(
                    "Architect Phone",
                    "architectPhone",
                    editedDetails.architectPhone || ""
                  )}
                </>
              )}
            </div>

            {/* Edit, Save, and Cancel Buttons */}
            {editMode ? (
              <div className="flex justify-between py-5">
                <button
                  onClick={cancelChanges}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={toggleEditMode}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded"
              >
                Edit
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Financial Analysis Section */}
      <section
        className="mb-12 p-6 bg-gray-50 rounded-lg shadow-lg"
        ref={financialsPrintRef}
      >
        <div className="flex justify-between items-center mb-6 border-b-2 border-blue-200 pb-2">
          <h2 className="text-2xl font-bold text-blue-600">
            Financial Analysis
          </h2>
          <button
            onClick={handlePrintFinancials}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            Print Financial Analysis
          </button>
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
            <ProfitAndLoss property={propertyDetails} />
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
            <OperatingExpense property={propertyDetails} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Rental Income
              </h3>
              <button
                onClick={() =>
                  exportToCSV(propertyDetails.rentalIncomeData, "rental-income")
                }
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
            <RentalIncome property={propertyDetails} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Capital Expenditure
              </h3>
              <button
                onClick={() =>
                  exportToCSV(propertyDetails.capExData, "capital-expenditure")
                }
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
            <CapitalExpenditure property={propertyDetails} />
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
            <RentalAnalysis property={propertyDetails} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetails;
