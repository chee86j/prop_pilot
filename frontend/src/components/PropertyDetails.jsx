/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ConstructionDraw from "./ConstructionDraw";
import PhaseTimeline from "./PhaseTimeline";
import PhaseForm from "./PhaseForm";
import ProfitAndLoss from "./ProfitAndLoss";
import OperatingExpense from "./OperatingExpense";
import RentalIncome from "./RentalIncome";
import CapitalExpenditure from "./CapitalExpenditure";
import CsvDisplay from "./CsvDisplay";
import CsvReader from "./CsvReader";
import { formatFullCurrency } from "../../../util";
import { ChevronsUp, ChevronsDown } from "lucide-react";

const PropertyDetails = ({ propertyId }) => {
  const printRef = useRef(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [phases, setPhases] = useState([]);
  const [isEditingPhase, setIsEditingPhase] = useState(false);
  const [currentPhase, setCurrentPhase] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    location: false,
    departments: false,
    outlayToDate: true,
    saleProjection: true,
    utilityInformation: false,
    keyPlayers: false,
    lender: false,
    salesAndMarketing: false,
  });
  const [csvData, setCsvData] = useState(null);

  const handleFileUpload = (data) => {
    setCsvData(data); // Store the parsed CSV data
  };

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
    } catch (error) {
      console.error("Error saving property details:", error);
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

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Property Details",
    onAfterPrint: () => console.log("Printed Property Details"),
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const renderSectionTitle = (title, sectionName) => (
    <div
      className="flex justify-between items-center mb-2 cursor-pointer"
      onClick={() => toggleSection(sectionName)}
    >
      <h2 className="text-lg font-bold text-blue-700 cursor-pointer">
        {title}
      </h2>
      <button className="focus:outline-none">
        {expandedSections[sectionName] ? (
          <ChevronsUp size={24} className="text-gray-700" />
        ) : (
          <ChevronsDown size={24} className="text-gray-700" />
        )}
      </button>
    </div>
  );

  const handleEditPhase = (phase) => {
    setCurrentPhase(phase);
    setIsEditingPhase(true);
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
    // Include propertyId in the formData
    const phaseData = {
      ...formData,
      property_id: propertyId, // Add property_id to formData
    };

    const method = phaseData.id ? "PUT" : "POST";
    const url = phaseData.id
      ? `http://localhost:5000/api/phases/${phaseData.id}`
      : "http://localhost:5000/api/phases";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(phaseData), // Send phaseData with property_id
      });

      // Fetch phases to update the state after saving
      if (response.ok) {
        fetchPhases(); // Make sure fetchPhases() is defined to update the phases state
      } else {
        // If the request was not successful, throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || "Error saving phase");
      }

      setIsEditingPhase(false); // Close the editing form after saving
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error saving phase");
    }
  };

  // Ensure fetchPhases function is defined and correctly fetches phases for the property
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

  const handleCancelEditPhase = () => {
    setIsEditingPhase(false);
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="property-details-container bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto"
      ref={printRef}
    >
      <button
        onClick={handlePrint}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Print Property Details
      </button>
      <ConstructionDraw propertyId={propertyId} />
      <h1 className="text-center text-blue-500 text-xl md:text-2xl font-bold my-6">
        {editedDetails.address} - Property Details
      </h1>
      <PhaseTimeline
        phases={phases}
        onEdit={handleEditPhase}
        onDelete={handleDeletePhase}
      />

      {isEditingPhase && (
        <PhaseForm
          initialData={currentPhase}
          onSave={handleSavePhase}
          onCancel={handleCancelEditPhase}
        />
      )}
      {/* Add a button to trigger adding a new phase */}
      <button
        onClick={() => handleEditPhase(null)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {renderEditableField("City", "city", editedDetails.city || "")}
              {renderEditableField("State", "state", editedDetails.state || "")}
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
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mt-8">
          Profit & Loss Analysis
        </h2>
        <ProfitAndLoss property={propertyDetails} />
        <OperatingExpense property={propertyDetails} />
        <RentalIncome property={propertyDetails} />
        <CapitalExpenditure property={propertyDetails} />
        <div>
          <CsvReader onFileUpload={handleFileUpload} />
          {csvData && <CsvDisplay data={csvData} />}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
