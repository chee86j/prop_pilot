/**
 * Data utilities and constants
 * Contains static data and utilities for managing data
 */

/**
 * FAQ categories and questions/answers
 */
export const faqData = [
  {
    category: "General Questions",
    questions: [
      {
        id: "faq-1",
        question: "What is Property Pilot?",
        answer:
          "Property Pilot is a comprehensive property management platform designed to help real estate investors, property managers, and homeowners efficiently track, manage, and optimize their property investments and operations.",
      },
      {
        id: "faq-2",
        question: "How do I get started with Property Pilot?",
        answer:
          "Getting started is easy! Simply create an account, add your properties, and start using our powerful features to manage your real estate portfolio. Our intuitive dashboard provides a quick overview of your properties' performance.",
      },
      {
        id: "faq-3",
        question: "Is Property Pilot suitable for beginners?",
        answer:
          "Absolutely! Property Pilot is designed with both beginners and experienced property investors in mind. The platform offers an intuitive interface with helpful guides and tooltips to assist new users in navigating its features.",
      },
    ],
  },
  {
    category: "Account Management",
    questions: [
      {
        id: "faq-4",
        question: "How do I reset my password?",
        answer:
          "You can reset your password by clicking on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. For security reasons, password reset links expire after 24 hours.",
      },
      {
        id: "faq-5",
        question: "Can I have multiple users on my account?",
        answer:
          "Yes, our Professional and Enterprise plans support multiple user accounts with customizable permission levels. This allows property owners to give access to property managers, maintenance staff, or accountants as needed.",
      },
    ],
  },
  {
    category: "Features",
    questions: [
      {
        id: "faq-6",
        question: "Can I track expenses and income for my properties?",
        answer:
          "Yes, Property Pilot provides comprehensive financial tracking tools. You can record all property-related income and expenses, categorize transactions, and generate detailed financial reports for tax purposes or performance analysis.",
      },
      {
        id: "faq-7",
        question: "Does Property Pilot offer document storage?",
        answer:
          "Yes, we provide secure cloud-based document storage for all your important property-related documents. You can store leases, inspection reports, maintenance records, and other critical documents, making them easily accessible whenever you need them.",
      },
      {
        id: "faq-8",
        question: "Can I use Property Pilot on mobile devices?",
        answer:
          "Absolutely! Property Pilot is fully responsive and works on smartphones and tablets. We also offer dedicated mobile apps for iOS and Android devices, allowing you to manage your properties on the go.",
      },
    ],
  },
];

/**
 * Sample phase data
 */
export const phaseData = [
  {
    id: 1,
    name: "Discovery",
    description: "Initial research and property evaluation",
    days: 7,
  },
  {
    id: 2,
    name: "Negotiation",
    description: "Price negotiation and contract preparation",
    days: 14,
  },
  {
    id: 3,
    name: "Due Diligence",
    description: "Detailed property inspection and verification",
    days: 21,
  },
  {
    id: 4,
    name: "Closing",
    description: "Final paperwork and property transfer",
    days: 7,
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
    image: "/images/testimonials/testimonial1.jpg",
    quote:
      "Property Pilot transformed how I manage my real estate portfolio. The analytics dashboard gives me instant insights into property performance, helping me make data-driven decisions. I've increased my ROI by 12% in just six months!",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Property Manager",
    image: "/images/testimonials/testimonial2.jpg",
    quote:
      "As a property manager overseeing 35+ units, Property Pilot has been a game-changer. The maintenance tracking alone has saved us countless hours and improved tenant satisfaction. The interface is intuitive and the customer support is exceptional.",
    rating: 5,
  },
  {
    id: 3,
    name: "David Chen",
    role: "Real Estate Developer",
    image: "/images/testimonials/testimonial3.jpg",
    quote:
      "We've tried several property management platforms, but none compare to Property Pilot's comprehensive features. The development tracking tools help us monitor project milestones and costs with precision. It's become an essential part of our business.",
    rating: 4,
  },
  {
    id: 4,
    name: "Jennifer Martinez",
    role: "Rental Property Owner",
    image: "/images/testimonials/testimonial4.jpg",
    quote:
      "Property Pilot simplified my rental business operations. The automated rent collection and financial reporting features save me hours each month. I particularly love the tenant screening tools - they've helped me find reliable tenants consistently.",
    rating: 5,
  },
  {
    id: 5,
    name: "Robert Thompson",
    role: "Commercial Property Investor",
    image: "/images/testimonials/testimonial5.jpg",
    quote:
      "The commercial property analytics in Property Pilot have been crucial for optimizing our investment strategy. The platform's detailed reporting helps us identify opportunities and address issues before they impact our bottom line.",
    rating: 4,
  },
  {
    id: 6,
    name: "Amanda Lee",
    role: "HOA Manager",
    image: "/images/testimonials/testimonial6.jpg",
    quote:
      "Managing our community association became significantly easier with Property Pilot. The communication tools, maintenance scheduling, and financial tracking are all seamlessly integrated. It's helped us improve transparency with homeowners.",
    rating: 5,
  },
];

/**
 * County website data
 */
export const countyWebsites = [
  {
    county: "Alameda",
    state: "California",
    website: "https://www.acgov.org/assessor/",
    parcelSearch: "https://www.acgov.org/ptax_pub_app/RealSearch.do",
    notes:
      "Property assessment information available online with free registration",
  },
  {
    county: "Los Angeles",
    state: "California",
    website: "https://assessor.lacounty.gov/",
    parcelSearch: "https://portal.assessor.lacounty.gov/",
    notes: "Extensive property data available; some features require login",
  },
  {
    county: "Orange",
    state: "California",
    website: "https://www.ocgov.com/gov/assessor",
    parcelSearch: "http://www.ocgov.com/ocpublicportal/",
    notes: "User-friendly interface with property maps and assessment data",
  },
  {
    county: "San Diego",
    state: "California",
    website: "https://arcc.sdcounty.ca.gov/",
    parcelSearch:
      "https://arcc.sdcounty.ca.gov/Pages/PropertyAssessorValues.aspx",
    notes: "Provides assessment information and property characteristics",
  },
  {
    county: "Santa Clara",
    state: "California",
    website: "https://www.sccassessor.org/",
    parcelSearch: "https://www.sccassessor.org/property-search/",
    notes: "Detailed property information with historical assessment data",
  },
  {
    county: "Cook",
    state: "Illinois",
    website: "https://www.cookcountyassessor.com/",
    parcelSearch: "https://www.cookcountyassessor.com/address-search",
    notes: "Large county database with comprehensive property details",
  },
  {
    county: "Harris",
    state: "Texas",
    website: "https://hcad.org/",
    parcelSearch: "https://public.hcad.org/records/",
    notes: "Detailed search functionality with multiple filters available",
  },
  {
    county: "King",
    state: "Washington",
    website: "https://kingcounty.gov/depts/assessor.aspx",
    parcelSearch:
      "https://blue.kingcounty.com/Assessor/eRealProperty/default.aspx",
    notes: "Extensive property records with tax and appraisal history",
  },
  {
    county: "Miami-Dade",
    state: "Florida",
    website: "https://www.miamidade.gov/pa/",
    parcelSearch: "https://www.miamidade.gov/propertysearch/",
    notes: "Provides property records with sales history and tax information",
  },
  {
    county: "Maricopa",
    state: "Arizona",
    website: "https://mcassessor.maricopa.gov/",
    parcelSearch: "https://mcassessor.maricopa.gov/property-search/",
    notes: "User-friendly search with detailed property characteristics",
  },
];

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
