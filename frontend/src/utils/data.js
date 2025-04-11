/*
 * Data utilities and constants
 * Contains static data and utilities for managing data
 * FAQ categories and questions/answers
 */
export const faqData = [
  {
    category: "General Questions",
    questions: [
      {
        id: "faq-1",
        question: "How does the Property Lifecycle Management feature work?",
        answer:
          "Our Property Lifecycle Management feature allows you to track every stage of a property's lifecycle, from purchase and renovation to sale or rental. It integrates financial calculators, document management, and timeline tracking for comprehensive management.",
      },
      {
        id: "faq-2",
        question:
          "Can I manage multiple properties simultaneously with this app?",
        answer:
          "Yes, our app is designed to handle multiple properties efficiently. You can track and analyze data for each property individually or view aggregated data for overall insights.",
      },
      {
        id: "faq-3",
        question:
          "Is your app accessible on mobile devices for on-the-go management?",
        answer:
          "Yes, our app features a Mobile Responsive Design, ensuring a seamless experience across all devices. You can manage your flipping projects anytime, anywhere, which is crucial for staying on top of fast-paced property investments.",
      },
      {
        id: "faq-4",
        question: "Can I access foreclosure listings through your app?",
        answer:
          "Definitely! Our Foreclosure Listings Scraper provides up-to-date access to foreclosure listings, collecting information from various real estate and auction sites. This feature aids in finding undervalued properties with high potential for flipping.",
      },
    ],
  },
  {
    category: "Features",
    questions: [
      {
        id: "faq-5",
        question: "What are the benefits of using the Scope of Work component?",
        answer:
          "The Scope of Work component helps you manage renovation projects effectively. You can track contractor assignments, cost estimations, and project timelines, ensuring that every renovation phase is completed on time and within budget.",
      },
      {
        id: "faq-6",
        question:
          "What tools does your app provide for financial management during a flip?",
        answer:
          "With our Financial Management feature, you can effortlessly manage rent, expenses, and revenue. Generate comprehensive financial reports with just a few clicks to keep track of your budget and cash flow throughout the flipping process.",
      },
      {
        id: "faq-7",
        question:
          "Can your app assist in communicating with tenants during renovations?",
        answer:
          "Absolutely! Our Tenant Communication tool enables you to directly interact with tenants through the platform for any maintenance requests and notifications, ensuring smooth communication and efficient management during renovations.",
      },
      {
        id: "faq-8",
        question:
          "How does the Scope of Work Management feature streamline renovation projects?",
        answer:
          "Our Scope of Work Management feature helps you track renovation projects in detail, including assigning tasks to contractors and estimating costs. This ensures that every renovation phase is efficiently managed, staying on time and within budget.",
      },
      {
        id: "faq-9",
        question:
          "Does your app offer support for inspection tracking during property flipping?",
        answer:
          "Yes, our Inspection Tracking feature helps manage critical inspection phases during renovations. It ensures compliance with standards and that the property is ready for sale or rent, avoiding any unexpected hurdles in your flipping process.",
      },
      {
        id: "faq-10",
        question:
          "How does HUD-1 and GFE Integration enhance the flipping process?",
        answer:
          "Our app streamlines the generation and management of HUD-1 Settlement Statements and Good Faith Estimates, making the financial and legal aspects of property flipping more manageable and less time-consuming.",
      },
      {
        id: "faq-11",
        question: "How does API Data Integration benefit my flipping projects?",
        answer:
          "Our API Data Integration allows for efficient collection of data from multiple sources, ensuring you have the most current information for making informed decisions. This feature streamlines your workflow and enhances your ability to analyze potential flips.",
      },
    ],
  },
  {
    category: "Financing",
    questions: [
      {
        id: "faq-12",
        question: "How do private money loans work in property flipping?",
        answer:
          "Private money loans provide quick, flexible financing for property flipping. They are ideal for covering both the purchase and rehabilitation costs of a property, with faster approval times compared to traditional loans.",
      },
      {
        id: "faq-13",
        question:
          "What should I consider when applying for a fix-and-flip loan?",
        answer:
          "When applying for a fix-and-flip loan, consider the loan-to-value ratio, interest rates, repayment terms, and the lender's reputation. Ensure the loan aligns with your project's budget and timeline.",
      },
    ],
  },
];

/**
 * Phase categories mapping
 */
// export const PHASE_CATEGORIES = {
//   acquisition: { name: "Acquisition", color: "#3B82F6" },
//   renovation: { name: "Renovation", color: "#10B981" },
//   marketing: { name: "Marketing & Sale", color: "#F59E0B" },
//   legal: { name: "Legal", color: "#EF4444" },
//   financing: { name: "Financing", color: "#8B5CF6" },
//   other: { name: "Other", color: "#6B7280" },
// };

/**
 * Sample phase data
 */
export const phaseData = [
  {
    id: 1,
    name: "Finding the Deal",
    description: "Identifying potential property investments",
    days: 14,
    category: "acquisition",
  },
  {
    id: 2,
    name: "Understanding Financials",
    description: "Analyzing financial aspects of the investment",
    days: 7,
    category: "acquisition",
  },
  {
    id: 3,
    name: "Loan and Lender Consideration",
    description: "Exploring financing options and lenders",
    days: 10,
    category: "acquisition",
  },
  {
    id: 4,
    name: "Purchase and Renovation Costs",
    description: "Budgeting for acquisition and improvements",
    days: 7,
    category: "acquisition",
  },
  {
    id: 5,
    name: "Due Diligence",
    description: "Detailed property inspection and verification",
    days: 21,
    category: "acquisition",
  },
  {
    id: 6,
    name: "Contract Negotiations",
    description: "Finalizing purchase terms and agreements",
    days: 14,
    category: "acquisition",
  },
  {
    id: 7,
    name: "Legal and Compliance Steps",
    description: "Ensuring legal requirements are met",
    days: 10,
    category: "acquisition",
  },
  {
    id: 8,
    name: "Renovation Preparation",
    description: "Planning and organizing renovation activities",
    days: 14,
    category: "renovation",
  },
  {
    id: 9,
    name: "Closing and Renovations",
    description: "Finalizing purchase and beginning renovations",
    days: 7,
    category: "renovation",
  },
  {
    id: 10,
    name: "Demolition (Operator)",
    description: "Removing existing structures as needed",
    days: 10,
    category: "renovation",
  },
  {
    id: 11,
    name: "Rough-In (Operator)",
    description: "Installing basic systems infrastructure",
    days: 14,
    category: "renovation",
  },
  {
    id: 12,
    name: "Rough-In Inspections (Municipal)",
    description: "Municipal verification of rough-in work",
    days: 5,
    category: "inspection",
  },
  {
    id: 13,
    name: "Utility Setup",
    description: "Connecting essential utilities",
    days: 7,
    category: "renovation",
  },
  {
    id: 14,
    name: "Finals (Operator)",
    description: "Completing construction and finishing work",
    days: 14,
    category: "renovation",
  },
  {
    id: 15,
    name: "Final Inspections (Municipal)",
    description: "Final compliance verification by authorities",
    days: 5,
    category: "inspection",
  },
  {
    id: 16,
    name: "Listing and Marketing",
    description: "Preparing and marketing property for sale",
    days: 30,
    category: "sale",
  },
];

/**
 * Testimonial data from clients
 */
export const testimonials = [
  {
    id: 1,
    name: "Michael Johnson",
    role: "Property Investor",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Property Pilot transformed how I manage my real estate portfolio. The analytics dashboard gives me instant insights into property performance, helping me make data-driven decisions. I've increased my ROI by 12% in just six months!",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Property Manager",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "As a property manager overseeing 35+ units, Property Pilot has been a game-changer. The maintenance tracking alone has saved us countless hours and improved tenant satisfaction. The interface is intuitive and the customer support is exceptional.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Chen",
    role: "Real Estate Developer",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    quote:
      "We've tried several property management platforms, but none compare to Property Pilot's comprehensive features. The development tracking tools help us monitor project milestones and costs with precision. It's become an essential part of our business.",
    rating: 4,
  },
  {
    id: 4,
    name: "Jennifer Martinez",
    role: "Rental Property Owner",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    quote:
      "Property Pilot simplified my rental business operations. The automated rent collection and financial reporting features save me hours each month. I particularly love the tenant screening tools - they've helped me find reliable tenants consistently.",
    rating: 5,
  },
  {
    id: 5,
    name: "Robert Thompson",
    role: "Commercial Property Investor",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    quote:
      "The commercial property analytics in Property Pilot have been crucial for optimizing our investment strategy. The platform's detailed reporting helps us identify opportunities and address issues before they impact our bottom line.",
    rating: 4,
  },
  {
    id: 6,
    name: "Amanda Lee",
    role: "HOA Manager",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote:
      "Managing our community association became significantly easier with Property Pilot. The communication tools, maintenance scheduling, and financial tracking are all seamlessly integrated. It's helped us improve transparency with homeowners.",
    rating: 5,
  },
  {
    id: 7,
    name: "Carlos Rodriguez",
    role: "Multi-Family Property Owner",
    image: "https://randomuser.me/api/portraits/men/73.jpg",
    quote:
      "Since implementing Property Pilot across my 12 multi-family properties, tenant satisfaction has increased by 30%. The maintenance request system and automated communication tools have dramatically improved our response times.",
    rating: 5,
  },
  {
    id: 8,
    name: "Emily Patel",
    role: "Real Estate Agent",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote:
      "Property Pilot gives me a competitive edge when working with property investors. The comprehensive analytics and forecasting tools help my clients make informed decisions, and the property comparison features are invaluable during the acquisition phase.",
    rating: 4,
  },
  {
    id: 9,
    name: "Marcus Wilson",
    role: "Vacation Rental Manager",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    quote:
      "The seasonal pricing optimization in Property Pilot has increased our vacation rental revenue by 22% year-over-year. The integration with booking platforms and automated guest communication has streamlined our entire operation.",
    rating: 5,
  },
  {
    id: 10,
    name: "Sophia Kim",
    role: "Property Portfolio Analyst",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    quote:
      "The data visualization tools in Property Pilot have revolutionized how we present performance metrics to our investors. The custom reporting features allow us to highlight key metrics for different stakeholder groups effectively.",
    rating: 4,
  },
  {
    id: 11,
    name: "James Nguyen",
    role: "Student Housing Manager",
    image: "https://randomuser.me/api/portraits/men/26.jpg",
    quote:
      "Managing student housing comes with unique challenges, and Property Pilot handles them all brilliantly. The lease term flexibility and mass communication features are perfect for our academic-year cycles and resident updates.",
    rating: 5,
  },
  {
    id: 12,
    name: "Olivia Blackwell",
    role: "Fix and Flip Investor",
    image: "https://randomuser.me/api/portraits/women/59.jpg",
    quote:
      "The renovation tracking and budget management tools in Property Pilot have kept our projects on schedule and within budget. The contractor management features have improved coordination and accountability throughout our flips.",
    rating: 4,
  },
  {
    id: 13,
    name: "Daniel Washington",
    role: "Residential Property Manager",
    image: "https://randomuser.me/api/portraits/men/82.jpg",
    quote:
      "Property Pilot's tenant screening and background check integration has reduced our eviction rate by 60%. The automated lease renewal process and digital signature capabilities have eliminated paperwork headaches completely.",
    rating: 5,
  },
  {
    id: 14,
    name: "Grace Fernandez",
    role: "Affordable Housing Director",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
    quote:
      "Property Pilot's compliance tracking tools have been essential for managing our affordable housing portfolio. The system automatically flags units that need recertification, and the reporting features simplify our government submissions.",
    rating: 4,
  },
  {
    id: 15,
    name: "William Parker",
    role: "Senior Living Facility Owner",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    quote:
      "The specialized features for senior living facilities in Property Pilot have improved both our operational efficiency and resident satisfaction. The maintenance prioritization system ensures urgent issues affecting our elderly residents are addressed immediately.",
    rating: 5,
  },
  {
    id: 16,
    name: "Natalie Foster",
    role: "Real Estate Investment Trust Manager",
    image: "https://randomuser.me/api/portraits/women/91.jpg",
    quote:
      "Property Pilot's portfolio analysis tools provide the comprehensive insights our REIT investors expect. The platform's ability to segment performance by property type, location, and investment strategy has been invaluable for our quarterly reporting.",
    rating: 4,
  },
  {
    id: 17,
    name: "Thomas Bennett",
    role: "Mixed-Use Development Manager",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote:
      "Managing mixed-use properties requires juggling commercial and residential tenants with different needs. Property Pilot's flexible configuration allows us to customize workflows and reporting for each property type within a single development.",
    rating: 5,
  },
  {
    id: 18,
    name: "Lisa Montgomery",
    role: "Property Technology Consultant",
    image: "https://randomuser.me/api/portraits/women/37.jpg",
    quote:
      "After evaluating dozens of property management platforms for my clients, Property Pilot consistently ranks at the top. Its intuitive interface, comprehensive feature set, and excellent support make it my go-to recommendation for property managers of all sizes.",
    rating: 5,
  },
  {
    id: 19,
    name: "Kevin Zhao",
    role: "International Property Investor",
    image: "https://randomuser.me/api/portraits/men/94.jpg",
    quote:
      "The multi-currency and time zone features in Property Pilot make managing my international property portfolio seamless. The localization options and tax calculation tools for different jurisdictions have simplified what was once an accounting nightmare.",
    rating: 4,
  },
];

/**
 * County website data
 */
export const countyWebsites = [
  {
    county: "General Statistics",
    state: "New Jersey",
    website: "https://www.propertyshark.com/mason/info/Property-Records/NJ/",
    parcelSearch: "https://www.city-data.com/",
    notes: "Statewide property data and demographic information available",
    otherLinks: [
      {
        name: "Northern & Central NJ Assessment Records",
        url: "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=1400&ms_user=ctb00",
      },
      {
        name: "Foreclosure Listings",
        url: "https://salesweb.civilview.com/",
      },
    ],
  },
  {
    county: "Morris",
    state: "New Jersey",
    website: "https://mcclerksng.co.morris.nj.us/publicsearch/",
    parcelSearch:
      "https://mcweb1.co.morris.nj.us/MCTaxBoard/SearchTaxRecords.aspx",
    notes: "Comprehensive property records with detailed tax information",
    otherLinks: [
      {
        name: "Assessment Records",
        url: "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=1400&ms_user=ctb14",
      },
      {
        name: "Foreclosure Listings",
        url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=9",
      },
    ],
  },
  {
    county: "Sussex",
    state: "New Jersey",
    website: "https://cefile.sussex.nj.us/publicsearch/",
    parcelSearch:
      "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=1901&ms_user=ctb19",
    notes: "County records available with property assessment history",
    otherLinks: [
      {
        name: "Foreclosure Listings",
        url: "https://www.sussexcountysheriff.com/foreclosure-listings",
      },
    ],
  },
  {
    county: "Bergen",
    state: "New Jersey",
    website: "https://bclrs.co.bergen.nj.us/browserview/",
    parcelSearch:
      "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=0200&ms_user=ctb02",
    notes: "Detailed property data with ownership and assessment information",
    otherLinks: [
      {
        name: "Foreclosure Listings",
        url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=7",
      },
    ],
  },
  {
    county: "Essex",
    state: "New Jersey",
    website:
      "https://press.essexregister.com/prodpress/clerk/ClerkHome.aspx?op=basic",
    parcelSearch:
      "https://www.taxdatahub.com/6229fbf0ce4aef911f9de7bc/Essex%20County",
    notes: "Extensive property records with tax and assessment history",
    otherLinks: [
      {
        name: "Assessment Records",
        url: "https://www.essexcountynj.gov/clerk/",
      },
      {
        name: "Foreclosure Listings",
        url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=2",
      },
    ],
  },
  {
    county: "Hudson",
    state: "New Jersey",
    website: "https://acclaim.hcnj.us/AcclaimWeb/#",
    parcelSearch:
      "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=0901&ms_user=ctb09",
    notes: "Property assessment data with historical values available",
    otherLinks: [
      {
        name: "Foreclosure Listings",
        url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=10",
      },
    ],
  },
  {
    county: "Union",
    state: "New Jersey",
    website: "https://clerk.ucnj.org/UCPA/DocIndex",
    parcelSearch:
      "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=2001&ms_user=ctb20",
    notes: "Comprehensive property search with deed records available",
    otherLinks: [
      {
        name: "Foreclosure Listings",
        url: "https://salesweb.civilview.com/Sales/SalesSearch?countyId=15",
      },
    ],
  },
  {
    county: "Warren",
    state: "New Jersey",
    website: "https://www.warrencountynj.gov/clerk/",
    parcelSearch:
      "https://taxrecords-nj.com/pub/cgi/prc6.cgi?district=2101&ms_user=ctb21",
    notes: "Property assessment records with detailed ownership history",
    otherLinks: [
      {
        name: "Foreclosure Listings (Not Currently Functional)",
        url: "https://www.wcsheriff-nj.us/foreclosures/index.shtml",
      },
    ],
  },
];

/**
 * Predefined phases for property management lifecycle with weights and dependencies
 */
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

/**
 * Categories and their descriptions
 */
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

/**
 * Helper function to calculate weighted progress
 */
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

/**
 * Phase tasks mapping - only used in FAQ
 */
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

/**
 * Helper to filter and sort FAQs
 * @param {string} category - Category to filter by, or 'all'
 * @param {string} searchTerm - Search term to filter questions
 * @returns {Array} - Filtered and sorted FAQs
 */
export const filterFAQs = (category = "all", searchTerm = "") => {
  let filteredFAQs = [...faqData];

  // Filter by category if not 'all'
  if (category !== "all") {
    filteredFAQs = filteredFAQs.filter((faq) => faq.category === category);
  }

  // Filter by search term if provided
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();

    filteredFAQs = filteredFAQs
      .map((category) => {
        return {
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(term) ||
              q.answer.toLowerCase().includes(term)
          ),
        };
      })
      .filter((category) => category.questions.length > 0);
  }

  return filteredFAQs;
};

/**
 * Filter testimonials by rating
 * @param {Array} testimonialsList - List of testimonials
 * @param {number} minRating - Minimum rating to filter by
 * @returns {Array} - Filtered testimonials
 */
export const filterTestimonials = (
  testimonialsList = testimonials,
  minRating = 0
) => {
  return testimonialsList.filter(
    (testimonial) => testimonial.rating >= minRating
  );
};

/**
 * Get random testimonials
 * @param {number} count - Number of testimonials to return
 * @param {number} minRating - Minimum rating to include
 * @returns {Array} - Random testimonials
 */
export const getRandomTestimonials = (count = 3, minRating = 0) => {
  const filtered = filterTestimonials(testimonials, minRating);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Calculate average rating from testimonials
 * @param {Array} testimonialsList - List of testimonials
 * @returns {number} - Average rating
 */
export const calculateAverageRating = (testimonialsList = testimonials) => {
  if (!testimonialsList || testimonialsList.length === 0) return 0;

  const sum = testimonialsList.reduce(
    (total, testimonial) => total + testimonial.rating,
    0
  );
  return (sum / testimonialsList.length).toFixed(1);
};

/**
 * Check if current page is the home page
 * @returns {boolean} - True if current page is home
 */
export const isHomePage = () => {
  const path = window.location.pathname;
  return path === "/" || path === "/home" || path.endsWith("index.html");
};
