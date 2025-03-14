/* this component allows auth user to create a new single property */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearchDropdown from "./ResearchDropdown";

const AddProperty = () => {
  const [property, setProperty] = useState({
    // Foreclosure Information
    detail_link: "",
    property_id: "",
    sheriff_number: "",
    status_date: "",
    plaintiff: "",
    defendant: "",
    zillow_url: "",

    // Location Section
    propertyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    county: "",
    bedroomsDescription: "",
    bathroomsDescription: "",
    kitchenDescription: "",
    amenitiesDescription: "",
    // Departments Section
    municipalBuildingAddress: "",
    buildingDepartmentContact: "",
    electricDepartmentContact: "",
    plumbingDepartmentContact: "",
    fireDepartmentContact: "",
    homeownersAssociationContact: "",
    environmentalDepartmentContact: "",
    // Total Outlay To Date Section
    purchaseCost: 0,
    refinanceCosts: 0,
    totalRehabCost: 0,
    equipmentCost: 0,
    constructionCost: 0,
    largeRepairCost: 0,
    renovationCost: 0,
    kickStartFunds: 0,
    lenderConstructionDrawsReceived: 0,
    utilitiesCost: 0,
    sewer: 0,
    water: 0,
    lawn: 0,
    garbage: 0,
    yearlyPropertyTaxes: 0,
    mortgagePaid: 0,
    homeownersInsurance: 0,
    expectedYearlyRent: 0,
    rentalIncomeReceived: 0,
    numUnits: 0,
    vacancyRate: 0,
    avgTenantStay: 0,
    otherMonthlyIncome: 0,
    vacancyLoss: 0,
    managementFees: 0,
    maintenanceCosts: 0,
    totalEquity: 0,
    // Sale Projection Section
    arvSalePrice: 0,
    realtorFees: 0,
    propTaxtillEndOfYear: 0,
    lenderLoanBalance: 0,
    payOffStatement: 0,
    attorneyFees: 0,
    miscFees: 0,
    utilities: 0,
    cash2closeFromPurchase: 0,
    cash2closeFromRefinance: 0,
    totalRehabCosts: 0,
    expectedRemainingRentEndToYear: 0,
    totalExpenses: 0,
    totalConstructionDrawsReceived: 0,
    projectNetProfitIfSold: 0,
    cashFlow: 0,
    cashRoi: 0,
    rule2Percent: 0,
    rule50Percent: 0,
    financeAmount: 0,
    purchaseCapRate: 0,
    // Utility Information Section
    typeOfHeatingAndCooling: "",
    waterCompany: "",
    waterAccountNumber: "",
    electricCompany: "",
    electricAccountNumber: "",
    gasOrOilCompany: "",
    gasOrOilAccountNumber: "",
    sewerCompany: "",
    sewerAccountNumber: "",
    // Key Players Information Section
    sellersAgent: "",
    sellersBroker: "",
    sellersAgentPhone: "",
    sellersAttorney: "",
    sellersAttorneyPhone: "",
    escrowCompany: "",
    escrowAgent: "",
    escrowAgentPhone: "",
    buyersAgent: "",
    buyersBroker: "",
    buyersAgentPhone: "",
    buyersAttorney: "",
    buyersAttorneyPhone: "",
    titleInsuranceCompany: "",
    titleAgent: "",
    titleAgentPhone: "",
    titlesPhone: "",
    appraisalCompany: "",
    appraiser: "",
    appraiserPhone: "",
    surveyor: "",
    surveyorPhone: "",
    homeInspector: "",
    homeInspectorPhone: "",
    architect: "",
    architectPhone: "",
    // Lender Information Section
    lender: "",
    lenderPhone: "",
    refinanceLender: "",
    refinanceLenderPhone: "",
    loanOfficer: "",
    loanOfficerPhone: "",
    loanNumber: "",
    downPaymentPercentage: 0,
    loanInterestRate: 0,
    pmiPercentage: 0,
    mortgageYears: 0,
    lenderPointsAmount: 0,
    otherFees: 0,
    // Sales & Marketing Section
    propertyManager: "",
    propertyManagerPhone: "",
    propertyManagementCompany: "",
    propertyManagementPhone: "",
    photographer: "",
    photographerPhone: "",
    videographer: "",
    videographerPhone: "",
  });

  const [scrapedProperties, setScrapedProperties] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Load scraped data when component mounts
    fetchScrapedData();
  }, []);

  const fetchScrapedData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/scraped-properties",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        toast.info("No Scraped Data found. Run Foreclosure Scraper First.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setScrapedProperties(data);
    } catch (error) {
      console.error("Error fetching Scraped Data:", error);
      toast.error(`Failed to Load Scraped Properties: ${error.message}`);
    }
  };

  // Helper function to parse address into parts to fill form fields
  const parseAddress = (fullAddress) => {
    try {
      // Normalize the address string
      const normalizedAddress = fullAddress.trim().replace(/\s+/g, " ");

      // Common state abbreviations
      const stateAbbreviations = new Set([
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ]);

      // Northern New Jersey cities and neighborhoods
      const northernNJCities = new Set([
        // Bergen County
        "Allendale",
        "Alpine",
        "Bergenfield",
        "Bogota",
        "Carlstadt",
        "Cliffside Park",
        "Closter",
        "Cresskill",
        "Demarest",
        "Dumont",
        "East Rutherford",
        "Edgewater",
        "Elmwood Park",
        "Emerson",
        "Englewood",
        "Englewood Cliffs",
        "Fair Lawn",
        "Fairview",
        "Fort Lee",
        "Franklin Lakes",
        "Garfield",
        "Glen Rock",
        "Hackensack",
        "Harrington Park",
        "Hasbrouck Heights",
        "Haworth",
        "Hillsdale",
        "Ho-Ho-Kus",
        "Leonia",
        "Little Ferry",
        "Lodi",
        "Lyndhurst",
        "Mahwah",
        "Maywood",
        "Midland Park",
        "Montvale",
        "Moonachie",
        "New Milford",
        "North Arlington",
        "Northvale",
        "Norwood",
        "Oakland",
        "Old Tappan",
        "Oradell",
        "Palisades Park",
        "Paramus",
        "Park Ridge",
        "Ramsey",
        "Ridgefield",
        "Ridgefield Park",
        "Ridgewood",
        "River Edge",
        "River Vale",
        "Rochelle Park",
        "Rockleigh",
        "Rutherford",
        "Saddle Brook",
        "Saddle River",
        "South Hackensack",
        "Teaneck",
        "Tenafly",
        "Teterboro",
        "Upper Saddle River",
        "Waldwick",
        "Wallington",
        "Washington Township",
        "Westwood",
        "Wood-Ridge",
        "Woodcliff Lake",
        "Wyckoff",

        // Essex County
        "Belleville",
        "Bloomfield",
        "Caldwell",
        "Cedar Grove",
        "East Orange",
        "Essex Fells",
        "Fairfield",
        "Glen Ridge",
        "Irvington",
        "Livingston",
        "Maplewood",
        "Millburn",
        "Montclair",
        "Newark",
        "North Caldwell",
        "Nutley",
        "Orange",
        "Roseland",
        "South Orange",
        "Verona",
        "West Caldwell",
        "West Orange",

        // Hudson County
        "Bayonne",
        "East Newark",
        "Guttenberg",
        "Harrison",
        "Hoboken",
        "Jersey City",
        "Kearny",
        "North Bergen",
        "Secaucus",
        "Union City",
        "Weehawken",
        "West New York",

        // Morris County
        "Boonton",
        "Butler",
        "Chatham",
        "Chester",
        "Denville",
        "Dover",
        "East Hanover",
        "Florham Park",
        "Hanover",
        "Harding",
        "Jefferson",
        "Kinnelon",
        "Lincoln Park",
        "Madison",
        "Mendham",
        "Mine Hill",
        "Montville",
        "Morris Plains",
        "Morris Township",
        "Morristown",
        "Mountain Lakes",
        "Mount Arlington",
        "Mount Olive",
        "Netcong",
        "Parsippany-Troy Hills",
        "Pequannock",
        "Randolph",
        "Riverdale",
        "Rockaway",
        "Roxbury",
        "Victory Gardens",
        "Washington",
        "Wharton",

        // Passaic County
        "Bloomingdale",
        "Clifton",
        "Haledon",
        "Hawthorne",
        "Little Falls",
        "North Haledon",
        "Passaic",
        "Paterson",
        "Pompton Lakes",
        "Prospect Park",
        "Ringwood",
        "Totowa",
        "Wanaque",
        "Wayne",
        "West Milford",
        "Woodland Park",

        // Sussex County
        "Andover",
        "Franklin",
        "Hamburg",
        "Hopatcong",
        "Newton",
        "Ogdensburg",
        "Sparta",
        "Stanhope",
        "Sussex",
        "Vernon",
      ]);

      // Split the address into parts
      const parts = normalizedAddress.split(" ");

      // Extract ZIP code (looking for 5-digit number at the end)
      let zipCode = "";
      while (parts.length > 0 && !zipCode) {
        const lastPart = parts[parts.length - 1];
        if (/^\d{5}(-\d{4})?$/.test(lastPart)) {
          zipCode = parts.pop();
        } else {
          break;
        }
      }

      // Extract state
      let state = "";
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1].toUpperCase();
        if (stateAbbreviations.has(lastPart)) {
          state = parts.pop();
        }
      }

      // Extract city and county
      let city = "";
      let county = "";

      // Look for county indicators
      const countyIndex = parts.findIndex(
        (part, i) =>
          i < parts.length - 1 &&
          (parts[i + 1].toLowerCase() === "county" ||
            parts[i + 1].toLowerCase() === "co." ||
            parts[i + 1].toLowerCase() === "co")
      );

      if (countyIndex !== -1) {
        county = parts[countyIndex] + " County";
        // Remove county parts from the array
        parts.splice(countyIndex, 2);
      }

      // Common street suffixes to help identify the end of the street address
      const streetSuffixes = new Set([
        "street",
        "st",
        "avenue",
        "ave",
        "road",
        "rd",
        "lane",
        "ln",
        "drive",
        "dr",
        "circle",
        "cir",
        "court",
        "ct",
        "boulevard",
        "blvd",
        "way",
        "parkway",
        "pkwy",
        "place",
        "pl",
        "terrace",
        "ter",
        "terr",
        "trail",
        "trl",
        "highway",
        "hwy",
      ]);

      // Find the last occurrence of a street suffix
      let streetEndIndex = -1;
      for (let i = parts.length - 1; i >= 0; i--) {
        if (streetSuffixes.has(parts[i].toLowerCase())) {
          streetEndIndex = i;
          break;
        }
      }

      // Try to find a known city name in the remaining parts
      let cityStartIndex = -1;
      if (parts.length > 0) {
        for (let i = parts.length - 1; i >= 0; i--) {
          // Try combinations of words to match city names
          for (let j = 1; j <= 3 && i - j + 1 >= 0; j++) {
            const possibleCity = parts
              .slice(i - j + 1, i + 1)
              .join(" ")
              .replace(/,$/, ""); // Remove trailing comma if present
            if (northernNJCities.has(possibleCity)) {
              cityStartIndex = i - j + 1;
              city = possibleCity;
              break;
            }
          }
          if (cityStartIndex !== -1) break;
        }
      }

      // If we found both a street suffix and a city
      if (streetEndIndex !== -1 && cityStartIndex !== -1) {
        const streetAddress = parts.slice(0, streetEndIndex + 1).join(" ");
        return {
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          state,
          zipCode,
          county,
        };
      }

      // If we only found a street suffix
      if (streetEndIndex !== -1) {
        const streetAddress = parts.slice(0, streetEndIndex + 1).join(" ");
        city = parts.slice(streetEndIndex + 1).join(" ");
        return {
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          state,
          zipCode,
          county,
        };
      }

      // If we only found a city
      if (cityStartIndex !== -1) {
        const streetAddress = parts.slice(0, cityStartIndex).join(" ");
        return {
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          state,
          zipCode,
          county,
        };
      }

      // Fallback: if we can't find either, assume last part is city
      if (parts.length > 0) {
        city = parts.pop();
        const streetAddress = parts.join(" ");
        return {
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          state,
          zipCode,
          county,
        };
      }

      // If all else fails, return the original address as street address
      return {
        streetAddress: fullAddress.trim(),
        city,
        state,
        zipCode,
        county,
      };
    } catch (error) {
      console.error("Error parsing address:", error);
      return {
        streetAddress: fullAddress,
        city: "",
        state: "",
        zipCode: "",
        county: "",
      };
    }
  };

  const handleUseScrapeData = (scrapedProperty) => {
    const parsedAddress = parseAddress(scrapedProperty.address);

    setProperty((prev) => ({
      ...prev,
      // Foreclosure Information
      detail_link: scrapedProperty.detail_link || "",
      property_id: scrapedProperty.property_id || "",
      sheriff_number: scrapedProperty.sheriff_number || "",
      status_date: scrapedProperty.status_date || "",
      plaintiff: scrapedProperty.plaintiff || "",
      defendant: scrapedProperty.defendant || "",
      zillow_url: scrapedProperty["Zillow URL"] || "",
      // Address fields
      propertyName: parsedAddress.streetAddress,
      address: parsedAddress.streetAddress,
      city: parsedAddress.city,
      state: parsedAddress.state,
      zipCode: parsedAddress.zipCode,
      county: parsedAddress.county || "",

      // Financial data
      purchaseCost: parseFloat(scrapedProperty.price) || 0,
    }));

    toast.info("Property Details Pre-filled from Scraped Data");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if propertyName is empty, if not, proceed with saving the property
    if (!property.propertyName.trim()) {
      setErrorMessage("Property Name is required");
      toast.error("Property Name is required");
      return;
    }

    // API call to save the new property
    fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(property),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Property save failed");
        }
        return response.json();
      })
      .then(() => {
        // Handle successful property save
        console.log("Property added successfully");
        toast.success("Property added successfully!");
        setTimeout(() => {
          navigate("/propertylist");
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage("Failed to save property: " + error.message);
        toast.error(`Failed to save property: ${error.message}`);
      });
  };

  // Helper function to render input fields
  const renderInputField = (label, name, type = "text", isNumber = false) => {
    return (
      <label className="flex justify-between items-center mb-2">
        <span className="text-gray-700">{label}:</span>
        <input
          type={type}
          name={name}
          value={property[name]}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
            isNumber ? "text-right" : ""
          }`}
        />
      </label>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      {/* Add ToastContainer at the top level of your component */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Add New Property
      </h1>
      {scrapedProperties.length > 0 && (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Use Scraped Property Data:
          </label>
          <select
            onChange={(e) =>
              handleUseScrapeData(scrapedProperties[e.target.value])
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select a scraped property...</option>
            {scrapedProperties.map((prop, index) => (
              <option key={index} value={index}>
                {prop.address} - ${prop.price}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Due Diligence Dropdown */}
      <ResearchDropdown />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Foreclosure Information Section */}
        <div className="foreclosureInfo bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Foreclosure Information
          </h2>
          {renderInputField("Detail Link", "detail_link")}
          {renderInputField("Property ID", "property_id")}
          {renderInputField("Sheriff Number", "sheriff_number")}
          {renderInputField("Status Date", "status_date", "date")}
          {renderInputField("Plaintiff", "plaintiff")}
          {renderInputField("Defendant", "defendant")}
          {renderInputField("Zillow URL", "zillow_url")}
        </div>

        {/* Location Section */}
        <div className="propHeader bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Location</h2>
          {renderInputField("Property Name", "propertyName")}
          {renderInputField("Address", "address")}
          {renderInputField("City", "city")}
          {renderInputField("State", "state")}
          {renderInputField("Zip Code", "zipCode")}
          {renderInputField("County", "county")}
          {renderInputField("Bedrooms", "bedroomsDescription")}
          {renderInputField("Bathrooms", "bathroomsDescription")}
          {renderInputField("Kitchen", "kitchenDescription")}
          {renderInputField("Amenities", "amenitiesDescription")}
        </div>

        {/* Departments Section */}
        <div className="propDepartments bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Departments
          </h2>
          {renderInputField(
            "Municipal Building Address",
            "municipalBuildingAddress"
          )}
          {renderInputField("Building Dept", "buildingDepartmentContact")}
          {renderInputField("Electric Dept", "electricDepartmentContact")}
          {renderInputField("Plumbing Dept", "plumbingDepartmentContact")}
          {renderInputField("Fire Dept", "fireDepartmentContact")}
          {renderInputField("HOA", "homeownersAssociationContact")}
          {renderInputField(
            "Environmental Dept",
            "environmentalDepartmentContact"
          )}
        </div>

        {/* Total Outlay To Date Section */}
        <div className="totalOutlayToDate bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Outlay To Date
          </h2>
          {renderInputField("Purchase Cost", "purchaseCost", "number", true)}
          {renderInputField(
            "Refinance Costs",
            "refinanceCosts",
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
          {renderInputField("Utilities Cost", "utilitiesCost", "number", true)}
          {renderInputField("Sewer", "sewer", "number", true)}
          {renderInputField("Water", "water", "number", true)}
          {renderInputField("Lawn", "lawn", "number", true)}
          {renderInputField("Garbage", "garbage", "number", true)}
          {renderInputField(
            "Yearly Property Taxes",
            "yearlyPropertyTaxes",
            "number",
            true
          )}
          {renderInputField("Mortgage Paid", "mortgagePaid", "number", true)}
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
          {renderInputField("Avg Tenant Stay", "avgTenantStay", "number", true)}
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
          {renderInputField("Total Equity", "totalEquity", "number", true)}
        </div>

        {/* Sale Projection Section */}
        <div className="saleProjection bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sale Projection
          </h2>
          {renderInputField("ARV Sale Price", "arvSalePrice", "number", true)}
          {renderInputField("Realtor Fees", "realtorFees", "number", true)}
          {renderInputField(
            "Prop Tax till End of Year",
            "propTaxtillEndOfYear",
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
          {renderInputField("Attorney Fees", "attorneyFees", "number", true)}
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
          {renderInputField("Total Expenses", "totalExpenses", "number", true)}
          {renderInputField(
            "Total Construction Draws Received",
            "totalConstructionDrawsReceived",
            "number",
            true
          )}
          {renderInputField(
            "Project Net Profit If Sold",
            "projectNetProfitIfSold",
            "number",
            true
          )}
          {renderInputField("Cash Flow", "cashFlow", "number", true)}
          {renderInputField("Cash ROI", "cashRoi", "number", true)}
          {renderInputField("Rule 2 Percent", "rule2Percent", "number", true)}
          {renderInputField("Rule 50 Percent", "rule50Percent", "number", true)}
          {renderInputField("Finance Amount", "financeAmount", "number", true)}
          {renderInputField(
            "Purchase Cap Rate",
            "purchaseCapRate",
            "number",
            true
          )}
        </div>

        {/* Utility Information Section */}
        <div className="utilityInformation bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Utility Information
          </h2>
          {renderInputField(
            "Type of Heating & Cooling",
            "typeOfHeatingAndCooling"
          )}
          {renderInputField("Water Company", "waterCompany")}
          {renderInputField(
            "Water Account Number",
            "waterAccountNumber",
            "number",
            true
          )}
          {renderInputField("Electric Company", "electricCompany")}
          {renderInputField(
            "Electric Account Number",
            "electricAccountNumber",
            "number",
            true
          )}
          {renderInputField("Gas or Oil Company", "gasOrOilCompany")}
          {renderInputField(
            "Gas or Oil Account Number",
            "gasOrOilAccountNumber",
            "number",
            true
          )}
          {renderInputField("Sewer Company", "sewerCompany")}
          {renderInputField(
            "Sewer Account Number",
            "sewerAccountNumber",
            "number",
            true
          )}
        </div>

        {/* Key Players Information Section */}
        <div className="keyPlayersInformation bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Key Players
          </h2>
          {renderInputField("Seller's Agent", "sellersAgent")}
          {renderInputField("Seller's Broker", "sellersBroker")}
          {renderInputField(
            "Seller's Agent Phone",
            "sellersAgentPhone",
            "number",
            true
          )}
          {renderInputField("Seller's Attorney", "sellersAttorney")}
          {renderInputField(
            "Seller's Attorney Phone",
            "sellersAttorneyPhone",
            "number",
            true
          )}
          {renderInputField("Escrow Company", "escrowCompany")}
          {renderInputField("Escrow Agent", "escrowAgent")}
          {renderInputField(
            "Escrow Agent Phone",
            "escrowAgentPhone",
            "number",
            true
          )}
          {renderInputField("Buyer's Agent", "buyersAgent")}
          {renderInputField("Buyer's Broker", "buyersBroker")}
          {renderInputField(
            "Buyer's Agent Phone",
            "buyersAgentPhone",
            "number",
            true
          )}
          {renderInputField("Buyer's Attorney", "buyersAttorney")}
          {renderInputField(
            "Buyer's Attorney Phone",
            "buyersAttorneyPhone",
            "number",
            true
          )}
          {renderInputField("Title Insurance Company", "titleInsuranceCompany")}
          {renderInputField("Title Agent", "titleAgent")}
          {renderInputField(
            "Title Agent Phone",
            "titleAgentPhone",
            "number",
            true
          )}
          {renderInputField("Titles Phone", "titlesPhone", "number", true)}
          {renderInputField("Appraisal Company", "appraisalCompany")}
          {renderInputField("Appraiser", "appraiser")}
          {renderInputField(
            "Appraiser Phone",
            "appraiserPhone",
            "number",
            true
          )}
          {renderInputField("Surveyor", "surveyor")}
          {renderInputField("Surveyor Phone", "surveyorPhone", "number", true)}
          {renderInputField("Home Inspector", "homeInspector")}
          {renderInputField(
            "Home Inspector Phone",
            "homeInspectorPhone",
            "number",
            true
          )}
          {renderInputField("Architect", "architect")}
          {renderInputField(
            "Architect Phone",
            "architectPhone",
            "number",
            true
          )}
        </div>

        {/* Lender Information Section */}
        <div className="lenderInformation bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Lender</h2>
          {renderInputField("Lender", "lender")}
          {renderInputField("Lender Phone", "lenderPhone", "number", true)}
          {renderInputField("Refinance Lender", "refinanceLender")}
          {renderInputField(
            "Refinance Lender Phone",
            "refinanceLenderPhone",
            "number",
            true
          )}
          {renderInputField("Loan Officer", "loanOfficer")}
          {renderInputField(
            "Loan Officer Phone",
            "loanOfficerPhone",
            "number",
            true
          )}
          {renderInputField("Loan Number", "loanNumber")}
          {renderInputField(
            "Down Payment Percentage",
            "downPaymentPercentage",
            "number",
            true
          )}
          {renderInputField(
            "Loan Interest Rate",
            "loanInterestRate",
            "number",
            true
          )}
          {renderInputField("PMI Percentage", "pmiPercentage", "number", true)}
          {renderInputField("Mortgage Years", "mortgageYears", "number", true)}
          {renderInputField(
            "Lender Points Amount",
            "lenderPointsAmount",
            "number",
            true
          )}
          {renderInputField("Other Fees", "otherFees", "number", true)}
        </div>

        {/* Sales & Marketing Section */}
        <div className="salesAndmarketing bg-gray-50 p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sales & Marketing
          </h2>
          {renderInputField("Property Manager", "propertyManager")}
          {renderInputField(
            "Property Manager Phone",
            "propertyManagerPhone",
            "number",
            true
          )}
          {renderInputField(
            "Property Management Company",
            "propertyManagementCompany"
          )}
          {renderInputField(
            "Property Management Phone",
            "propertyManagementPhone",
            "number",
            true
          )}
          {renderInputField("Photographer", "photographer")}
          {renderInputField(
            "Photographer Phone",
            "photographerPhone",
            "number",
            true
          )}
          {renderInputField("Videographer", "videographer")}
          {renderInputField(
            "Videographer Phone",
            "videographerPhone",
            "number",
            true
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add New Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
