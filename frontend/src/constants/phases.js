// Predefined phases for property management lifecycle with weights and dependencies
export const PREDEFINED_PHASES = [
  {
    name: "Finding the Deal",
    weight: 0.1, // 10% of total project
    dependencies: [],
    category: "acquisition",
  },
  {
    name: "Understanding Financials",
    weight: 0.08,
    dependencies: ["Finding the Deal"],
    category: "acquisition",
  },
  {
    name: "Loan and Lender Consideration",
    weight: 0.07,
    dependencies: ["Understanding Financials"],
    category: "acquisition",
  },
  {
    name: "Purchase and Renovation Costs",
    weight: 0.08,
    dependencies: ["Understanding Financials"],
    category: "acquisition",
  },
  {
    name: "Due Diligence",
    weight: 0.1,
    dependencies: ["Finding the Deal"],
    category: "acquisition",
  },
  {
    name: "Contract Negotiations",
    weight: 0.07,
    dependencies: ["Due Diligence"],
    category: "acquisition",
  },
  {
    name: "Legal and Compliance Steps",
    weight: 0.06,
    dependencies: ["Contract Negotiations"],
    category: "acquisition",
  },
  {
    name: "Renovation Preparation",
    weight: 0.08,
    dependencies: ["Purchase and Renovation Costs"],
    category: "renovation",
  },
  {
    name: "Closing and Renovations",
    weight: 0.07,
    dependencies: ["Legal and Compliance Steps", "Renovation Preparation"],
    category: "renovation",
  },
  {
    name: "Demolition (Operator)",
    weight: 0.05,
    dependencies: ["Closing and Renovations"],
    category: "renovation",
  },
  {
    name: "Rough-In (Operator)",
    weight: 0.06,
    dependencies: ["Demolition (Operator)"],
    category: "renovation",
  },
  {
    name: "Rough-In Inspections (Municipal)",
    weight: 0.03,
    dependencies: ["Rough-In (Operator)"],
    category: "inspection",
  },
  {
    name: "Utility Setup",
    weight: 0.05,
    dependencies: ["Rough-In (Operator)"],
    category: "renovation",
  },
  {
    name: "Finals (Operator)",
    weight: 0.04,
    dependencies: ["Utility Setup", "Rough-In Inspections (Municipal)"],
    category: "renovation",
  },
  {
    name: "Final Inspections (Municipal)",
    weight: 0.03,
    dependencies: ["Finals (Operator)"],
    category: "inspection",
  },
  {
    name: "Listing and Marketing",
    weight: 0.03,
    dependencies: ["Final Inspections (Municipal)"],
    category: "sale",
  },
];

// Categories and their descriptions
export const PHASE_CATEGORIES = {
  acquisition: {
    name: "Property Acquisition",
    color: "blue",
    description: "Steps involved in finding and purchasing the property",
  },
  renovation: {
    name: "Renovation & Construction",
    color: "green",
    description: "Physical work and improvements to the property",
  },
  inspection: {
    name: "Inspections & Compliance",
    color: "green",
    description: "Municipal inspections and regulatory compliance",
  },
  sale: {
    name: "Sale & Marketing",
    color: "purple",
    description: "Preparing and marketing the property for sale",
  },
};

// Helper function to calculate weighted progress
export const calculateProgress = (phases) => {
  if (!phases || phases.length === 0) return 0;

  let totalProgress = 0;
  const phaseMap = new Map(PREDEFINED_PHASES.map((p) => [p.name, p]));

  // Check for special completion cases
  const hasClosingAndRenovations = phases.some(
    (p) => p.name === "Closing and Renovations" && p.endDate
  );
  const hasFinalsAndFinalInspections =
    phases.some((p) => p.name === "Finals (Operator)" && p.endDate) &&
    phases.some((p) => p.name === "Final Inspections (Municipal)" && p.endDate);

  phases.forEach((phase) => {
    const phaseInfo = phaseMap.get(phase.name);
    if (!phaseInfo) return;

    // Calculate phase completion
    if (phase.endDate) {
      // Completed phase
      totalProgress += phaseInfo.weight;
    } else if (phase.startDate) {
      // In-progress phase - count as 50% complete
      totalProgress += phaseInfo.weight * 0.5;
    }

    // Check dependencies
    const unmetDependencies = phaseInfo.dependencies.some((dep) => {
      const dependentPhase = phases.find((p) => p.name === dep);
      return !dependentPhase || !dependentPhase.endDate;
    });

    // If dependencies aren't met, reduce the progress
    if (unmetDependencies && phase.startDate) {
      totalProgress -= phaseInfo.weight * 0.25;
    }
  });

  // Apply special completion rules
  if (hasClosingAndRenovations) {
    // Set Property Acquisition category to 100%
    const acquisitionPhases = phases.filter((p) => {
      const phaseInfo = phaseMap.get(p.name);
      return phaseInfo && phaseInfo.category === "acquisition";
    });
    acquisitionPhases.forEach((p) => {
      if (!p.endDate) {
        totalProgress += phaseMap.get(p.name).weight;
      }
    });
  }

  if (hasFinalsAndFinalInspections) {
    // Set both Renovation & Construction and Inspections & Compliance categories to 100%
    const renovationAndInspectionPhases = phases.filter((p) => {
      const phaseInfo = phaseMap.get(p.name);
      return (
        phaseInfo &&
        (phaseInfo.category === "renovation" ||
          phaseInfo.category === "inspection")
      );
    });
    renovationAndInspectionPhases.forEach((p) => {
      if (!p.endDate) {
        totalProgress += phaseMap.get(p.name).weight;
      }
    });
  }

  return Math.min(Math.max(Math.round(totalProgress * 100), 0), 100);
};

// Phase tasks mapping - only used in FAQ
export const PHASE_TASKS = {
  "Finding the Deal": [
    "Identify potential properties using various online platforms and resources.",
    "Understand the financial viability of deals by assessing potential returns.",
    "Determine the type of loan (e.g., hard money, commercial, bridge) and ensure access to lenders.",
    "Ensure total costs (purchase, renovation, closing costs) do not exceed 70% of the After-Repair-Value (ARV).",
    "Conduct thorough due diligence on the property, including inspections and legal review.",
    "Negotiate contracts and terms, considering any issues discovered during due diligence.",
  ],
  "Understanding Financials": [
    "Assessing the financial viability of potential deals.",
    "Running financial analyses on potential investments, including calculating returns on investment.",
    "Evaluating risks and returns associated with different financing options.",
    "Ensuring financial projections align with investment goals and risk tolerance.",
  ],
  "Loan and Lender Consideration": [
    "Determining the type of loan needed for the property acquisition.",
    "Researching and selecting potential lenders, including evaluating terms and interest rates.",
    "Gathering necessary documentation for loan applications and underwriting processes.",
    "Securing financing and finalizing loan agreements.",
  ],
  "Purchase and Renovation Costs": [
    "Calculating total costs for property purchase, renovation, and closing.",
    "Ensuring total costs do not exceed the budgeted amount or a certain percentage of the After-Repair-Value (ARV).",
    "Estimating renovation costs accurately, including materials, labor, and unforeseen expenses.",
    "Managing renovation budget to optimize return on investment.",
  ],
  "Due Diligence": [
    "Conducting thorough investigation of the property and its potential risks and opportunities.",
    "Determine types of utilities available and costs associated with connecting to them.",
    "Engaging experts such as inspectors, appraisers, and attorneys to assess property condition and legal aspects.",
    "Reviewing property documents, including titles, surveys, and inspection reports.",
    "Identifying potential issues or red flags that may affect the investment decision.",
  ],
  "Contract Negotiations": [
    "Negotiating terms and conditions of the property purchase agreement.",
    "Addressing any contingencies or clauses to protect the investor's interests.",
    "Seeking favorable terms on price, financing, and timeline for closing.",
    "Ensuring all parties involved agree to the finalized contract before proceeding with the purchase.",
  ],
  "Legal and Compliance Steps": [
    "Engaging attorneys for legal review and guidance throughout the transaction process.",
    "Addressing inspections and compliance issues, including permits, zoning regulations, and property taxes.",
    "Resolving any outstanding violations or liens on the property.",
    "Filing necessary paperwork and documentation with relevant authorities.",
  ],
  "Renovation Preparation": [
    "Soliciting bids from contractors and suppliers for renovation work and materials.",
    "Securing necessary permits and approvals for renovation plans.",
    "Organizing logistics for renovation, including scheduling, materials delivery, and site preparation.",
    "Preparing a detailed scope of work and timeline for renovation activities.",
  ],
  "Closing and Renovations": [
    "Finalizing the property purchase transaction, including signing closing documents and transferring ownership.",
    "Initiating renovation work according to the agreed-upon scope and timeline.",
    "Monitoring renovation progress and addressing any issues or changes as needed.",
    "Ensuring all renovation work complies with building codes and quality standards.",
  ],
  "Demolition (Operator)": [
    "Overseeing the removal of existing structures or materials to prepare the site for renovation.",
    "Ensuring compliance with safety regulations and environmental considerations during demolition activities.",
  ],
  "Rough-In (Operator)": [
    "Installing basic systems and infrastructure, including plumbing, electrical, HVAC, and structural elements.",
    "Coordinating rough-in work to accommodate future renovations and meet building code requirements.",
  ],
  "Rough-In Inspections (Municipal)": [
    "Scheduling inspections with municipal authorities to verify compliance with building codes and regulations.",
    "Addressing any deficiencies or issues identified during inspections to ensure timely resolution.",
  ],
  "Utility Setup": [
    "Check availability and set up city water or well water systems.",
    "Connect to city sewer or install a septic tank system, including permits.",
    "Select and install a heating system: gas, oil, electric, or central air.",
    "Arrange electrical utility connections and ensure compliance with city codes.",
    "Install natural gas service, if applicable.",
    "Consider energy-efficient options like solar panels or geothermal systems.",
    "Schedule inspections to comply with safety and regulatory standards.",
    "Coordinate with contractors and utilities for installation timelines.",
  ],
  "Finals (Operator)": [
    "Completing construction and installation work, including finishing touches and cosmetic improvements.",
    "Conducting final checks to ensure all work meets project specifications and quality standards.",
  ],
  "Final Inspections (Municipal)": [
    "Scheduling final inspections with municipal authorities to obtain necessary permits and approvals for occupancy.",
    "Addressing any outstanding issues or deficiencies identified during inspections.",
    "Obtaining a Certificate of Occupancy (CO) or equivalent documentation to legally occupy the property.",
  ],
  "Listing and Marketing": [
    "Preparing the property for sale or rental, including staging, photography, and marketing materials.",
    "Listing the property on various platforms, including online listings, social media, and real estate agencies.",
    "Conducting open houses and showings to attract potential buyers or tenants.",
    "Negotiating offers and finalizing sale or rental agreements.",
  ],
};
