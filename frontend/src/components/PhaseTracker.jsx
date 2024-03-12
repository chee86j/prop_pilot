import { useState } from "react";

import { BadgePlus, BadgeMinus } from "lucide-react";

const PhaseTracker = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const phases = [
    {
      name: "Finding the Deal",
      tasks: [
        "Identify potential properties using various online platforms and resources.",
        "Understand the financial viability of deals by assessing potential returns.",
        "Determine the type of loan (e.g., hard money, commercial, bridge) and ensure access to lenders.",
        "Ensure total costs (purchase, renovation, closing costs) do not exceed 70% of the After-Repair-Value (ARV).",
        "Conduct thorough due diligence on the property, including inspections and legal review.",
        "Negotiate contracts and terms, considering any issues discovered during due diligence.",
      ],
    },
    {
      name: "Understanding Financials",
      tasks: [
        "Assessing the financial viability of potential deals.",
        "Running financial analyses on potential investments, including calculating returns on investment.",
        "Evaluating risks and returns associated with different financing options.",
        "Ensuring financial projections align with investment goals and risk tolerance.",
      ],
    },
    {
      name: "Loan and Lender Consideration",
      tasks: [
        "Determining the type of loan needed for the property acquisition.",
        "Researching and selecting potential lenders, including evaluating terms and interest rates.",
        "Gathering necessary documentation for loan applications and underwriting processes.",
        "Securing financing and finalizing loan agreements.",
      ],
    },
    {
      name: "Purchase and Renovation Costs",
      tasks: [
        "Calculating total costs for property purchase, renovation, and closing.",
        "Ensuring total costs do not exceed the budgeted amount or a certain percentage of the After-Repair-Value (ARV).",
        "Estimating renovation costs accurately, including materials, labor, and unforeseen expenses.",
        "Managing renovation budget to optimize return on investment.",
      ],
    },
    {
      name: "Due Diligence",
      tasks: [
        "Conducting thorough investigation of the property and its potential risks and opportunities.",
        "Engaging experts such as inspectors, appraisers, and attorneys to assess property condition and legal aspects.",
        "Reviewing property documents, including titles, surveys, and inspection reports.",
        "Identifying potential issues or red flags that may affect the investment decision.",
      ],
    },
    {
      name: "Contract Negotiations",
      tasks: [
        "Negotiating terms and conditions of the property purchase agreement.",
        "Addressing any contingencies or clauses to protect the investor's interests.",
        "Seeking favorable terms on price, financing, and timeline for closing.",
        "Ensuring all parties involved agree to the finalized contract before proceeding with the purchase.",
      ],
    },
    {
      name: "Legal and Compliance Steps",
      tasks: [
        "Engaging attorneys for legal review and guidance throughout the transaction process.",
        "Addressing inspections and compliance issues, including permits, zoning regulations, and property taxes.",
        "Resolving any outstanding violations or liens on the property.",
        "Filing necessary paperwork and documentation with relevant authorities.",
      ],
    },
    {
      name: "Renovation Preparation",
      tasks: [
        "Soliciting bids from contractors and suppliers for renovation work and materials.",
        "Securing necessary permits and approvals for renovation plans.",
        "Organizing logistics for renovation, including scheduling, materials delivery, and site preparation.",
        "Preparing a detailed scope of work and timeline for renovation activities.",
      ],
    },
    {
      name: "Closing and Renovations",
      tasks: [
        "Finalizing the property purchase transaction, including signing closing documents and transferring ownership.",
        "Initiating renovation work according to the agreed-upon scope and timeline.",
        "Monitoring renovation progress and addressing any issues or changes as needed.",
        "Ensuring all renovation work complies with building codes and quality standards.",
      ],
    },
    {
      name: "Demolition (Operator)",
      tasks: [
        "Overseeing the removal of existing structures or materials to prepare the site for renovation.",
        "Ensuring compliance with safety regulations and environmental considerations during demolition activities.",
      ],
    },
    {
      name: "Rough-In (Operator)",
      tasks: [
        "Installing basic systems and infrastructure, including plumbing, electrical, HVAC, and structural elements.",
        "Coordinating rough-in work to accommodate future renovations and meet building code requirements.",
      ],
    },
    {
      name: "Rough-In Inspections (Municipal)",
      tasks: [
        "Scheduling inspections with municipal authorities to verify compliance with building codes and regulations.",
        "Addressing any deficiencies or issues identified during inspections to ensure timely resolution.",
      ],
    },
    {
      name: "Finals (Operator)",
      tasks: [
        "Completing construction and installation work, including finishing touches and cosmetic improvements.",
        "Conducting final checks to ensure all work meets project specifications and quality standards.",
      ],
    },
    {
      name: "Final Inspections (Municipal)",
      tasks: [
        "Scheduling final inspections with municipal authorities to obtain necessary permits and approvals for occupancy.",
        "Addressing any outstanding issues or deficiencies identified during inspections.",
        "Obtaining a Certificate of Occupancy (CO) or equivalent documentation to legally occupy the property.",
      ],
    },
    {
      name: "Listing and Marketing",
      tasks: [
        "Preparing the property for sale or rental, including staging, photography, and marketing materials.",
        "Listing the property on various platforms, including online listings, social media, and real estate agencies.",
        "Conducting open houses and showings to attract potential buyers or tenants.",
        "Negotiating offers and finalizing sale or rental agreements.",
      ],
    },
  ];

  const nextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
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
            <h3 className="my-2 mx-8 text-bold text-lg">
              {phases[currentPhaseIndex].name}
            </h3>
            <ol className="text-md mx-8 ">
              {phases[currentPhaseIndex].tasks.map((task, index) => (
                <li key={index}>
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
              disabled={currentPhaseIndex === phases.length - 1}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                currentPhaseIndex === phases.length - 1 ? "hidden" : ""
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

export default PhaseTracker;
