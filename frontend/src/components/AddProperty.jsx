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

  const [activeTab, setActiveTab] = useState("basic"); // Track active form section
  const [progress, setProgress] = useState(0); // Track form completion progress
  const [scrapedProperties, setScrapedProperties] = useState([]);
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

  // Helper function to render input field with improved styling
  const renderInputField = (label, name, type = "text", isNumber = false) => {
    return (
      <div className="form-group mb-4">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={name}
        >
          {label}
        </label>
        <input
          id={name}
          type={type}
          name={name}
          value={property[name]}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 rounded-lg border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-150 ease-in-out
            ${isNumber ? "text-right" : ""}
            ${errorMessage && !property[name] ? "border-red-500" : ""}
          `}
        />
      </div>
    );
  };

  // Define form sections/tabs
  const formSections = {
    basic: {
      title: "Basic Information",
      icon: "📋",
      fields: [
        "propertyName",
        "address",
        "city",
        "state",
        "zipCode",
        "county",
        "bedroomsDescription",
        "bathroomsDescription",
        "kitchenDescription",
        "amenitiesDescription",
      ],
    },
    foreclosure: {
      title: "Foreclosure Details",
      icon: "🏠",
      fields: [
        "detail_link",
        "property_id",
        "sheriff_number",
        "status_date",
        "plaintiff",
        "defendant",
        "zillow_url",
      ],
    },
    departments: {
      title: "Municipal Departments",
      icon: "🏛️",
      fields: [
        "municipalBuildingAddress",
        "buildingDepartmentContact",
        "electricDepartmentContact",
        "plumbingDepartmentContact",
        "fireDepartmentContact",
        "homeownersAssociationContact",
        "environmentalDepartmentContact",
      ],
    },
    financials: {
      title: "Financial Details",
      icon: "💰",
      fields: [
        "purchaseCost",
        "refinanceCosts",
        "totalRehabCost",
        "equipmentCost",
        "constructionCost",
        "largeRepairCost",
        "renovationCost",
        "kickStartFunds",
        "lenderConstructionDrawsReceived",
        "totalEquity",
      ],
    },
    expenses: {
      title: "Operating Expenses",
      icon: "💸",
      fields: [
        "utilitiesCost",
        "sewer",
        "water",
        "lawn",
        "garbage",
        "yearlyPropertyTaxes",
        "mortgagePaid",
        "homeownersInsurance",
        "vacancyLoss",
        "managementFees",
        "maintenanceCosts",
      ],
    },
    rental: {
      title: "Rental Information",
      icon: "🏘️",
      fields: [
        "expectedYearlyRent",
        "rentalIncomeReceived",
        "numUnits",
        "vacancyRate",
        "avgTenantStay",
        "otherMonthlyIncome",
      ],
    },
    projections: {
      title: "Sale Projections",
      icon: "📈",
      fields: [
        "arvSalePrice",
        "realtorFees",
        "propTaxtillEndOfYear",
        "lenderLoanBalance",
        "payOffStatement",
        "attorneyFees",
        "miscFees",
        "utilities",
        "cash2closeFromPurchase",
        "cash2closeFromRefinance",
        "totalRehabCosts",
        "expectedRemainingRentEndToYear",
        "totalExpenses",
        "totalConstructionDrawsReceived",
        "projectNetProfitIfSold",
        "cashFlow",
        "cashRoi",
        "rule2Percent",
        "rule50Percent",
        "financeAmount",
        "purchaseCapRate",
      ],
    },
    utilities: {
      title: "Utility Information",
      icon: "⚡",
      fields: [
        "typeOfHeatingAndCooling",
        "waterCompany",
        "waterAccountNumber",
        "electricCompany",
        "electricAccountNumber",
        "gasOrOilCompany",
        "gasOrOilAccountNumber",
        "sewerCompany",
        "sewerAccountNumber",
      ],
    },
    sellers: {
      title: "Seller Information",
      icon: "🤝",
      fields: [
        "sellersAgent",
        "sellersBroker",
        "sellersAgentPhone",
        "sellersAttorney",
        "sellersAttorneyPhone",
      ],
    },
    escrow: {
      title: "Escrow & Title",
      icon: "📑",
      fields: [
        "escrowCompany",
        "escrowAgent",
        "escrowAgentPhone",
        "titleInsuranceCompany",
        "titleAgent",
        "titleAgentPhone",
        "titlesPhone",
      ],
    },
    buyers: {
      title: "Buyer Information",
      icon: "🛍️",
      fields: [
        "buyersAgent",
        "buyersBroker",
        "buyersAgentPhone",
        "buyersAttorney",
        "buyersAttorneyPhone",
      ],
    },
    professionals: {
      title: "Professional Services",
      icon: "👥",
      fields: [
        "appraisalCompany",
        "appraiser",
        "appraiserPhone",
        "surveyor",
        "surveyorPhone",
        "homeInspector",
        "homeInspectorPhone",
        "architect",
        "architectPhone",
      ],
    },
    lending: {
      title: "Lending Details",
      icon: "🏦",
      fields: [
        "lender",
        "lenderPhone",
        "refinanceLender",
        "refinanceLenderPhone",
        "loanOfficer",
        "loanOfficerPhone",
        "loanNumber",
        "downPaymentPercentage",
        "loanInterestRate",
        "pmiPercentage",
        "mortgageYears",
        "lenderPointsAmount",
        "otherFees",
      ],
    },
    marketing: {
      title: "Property Management",
      icon: "📸",
      fields: [
        "propertyManager",
        "propertyManagerPhone",
        "propertyManagementCompany",
        "propertyManagementPhone",
        "photographer",
        "photographerPhone",
        "videographer",
        "videographerPhone",
      ],
    },
  };

  // Calculate and update progress whenever property or activeTab changes
  useEffect(() => {
    const calculateProgress = () => {
      const totalFields = Object.values(formSections).reduce(
        (acc, section) => acc + section.fields.length,
        0
      );

      const filledFields = Object.values(formSections).reduce(
        (acc, section) => {
          return (
            acc +
            section.fields.filter(
              (field) =>
                property[field] && property[field].toString().trim() !== ""
            ).length
          );
        },
        0
      );

      setProgress(Math.round((filledFields / totalFields) * 100));
    };

    calculateProgress();
  }, [property, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
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

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Add New Property</h1>
            <p className="text-gray-300 mt-1">
              Fill in the property details below
            </p>
          </div>

          {/* Research Tools Section */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Research Tools
            </h2>
            <ResearchDropdown />
          </div>

          {/* Scraped Data Section */}
          {scrapedProperties.length > 0 && (
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Quick Fill from Scraped Data
              </h2>
              <select
                onChange={(e) =>
                  handleUseScrapeData(scrapedProperties[e.target.value])
                }
                className="w-full p-2 border rounded-lg bg-white shadow-sm"
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

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="py-4 px-6 overflow-x-auto" aria-label="Tabs">
              <div className="inline-block min-w-full">
                {/* Property Details Row */}
                <div className="flex mb-3">
                  {Object.entries(formSections)
                    .slice(0, Math.ceil(Object.keys(formSections).length / 2))
                    .map(([key, section]) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`
                          whitespace-nowrap px-4 py-2 rounded-lg mr-4 flex items-center
                          ${
                            activeTab === key
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                          transition duration-150 ease-in-out min-w-fit
                        `}
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </button>
                    ))}
                </div>

                {/* Contact & Services Row */}
                <div className="flex">
                  {Object.entries(formSections)
                    .slice(Math.ceil(Object.keys(formSections).length / 2))
                    .map(([key, section]) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`
                          whitespace-nowrap px-4 py-2 rounded-lg mr-4 flex items-center
                          ${
                            activeTab === key
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                          transition duration-150 ease-in-out min-w-fit
                        `}
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </button>
                    ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Render fields based on active tab */}
              {formSections[activeTab].fields.map((fieldName) => (
                <div key={fieldName} className="col-span-1">
                  {renderInputField(
                    fieldName.split(/(?=[A-Z])/).join(" "), // Convert camelCase to spaces
                    fieldName,
                    typeof property[fieldName] === "number" ? "number" : "text",
                    typeof property[fieldName] === "number"
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  const sections = Object.keys(formSections);
                  const currentIndex = sections.indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(sections[currentIndex - 1]);
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={() => {
                  const sections = Object.keys(formSections);
                  const currentIndex = sections.indexOf(activeTab);
                  if (currentIndex < sections.length - 1) {
                    setActiveTab(sections[currentIndex + 1]);
                  }
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Next →
              </button>
            </div>

            {/* Submit Button */}
            <div className="mt-8 border-t pt-6">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg
                  transition duration-150 ease-in-out transform hover:scale-[1.02]
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add New Property
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
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
    </div>
  );
};

export default AddProperty;
