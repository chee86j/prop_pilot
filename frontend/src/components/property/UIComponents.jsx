import { useState, useEffect } from "react";
import { Edit2, ChevronsUp, ChevronsDown, Printer, Save, X } from "lucide-react";

// Loading Skeleton Component
export const LoadingSkeleton = () => (
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
export const ErrorFallback = ({ error, resetError }) => (
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
export const FloatingActionButton = ({ onClick }) => (
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

// Offline Indicator Component
export const OfflineIndicator = () => {
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

// Sticky Action Bar Component
export const StickyActionBar = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onPrint,
  onToggleGroups,
  expandedGroups,
}) => {
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

  return (
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
};

// Export button styles for reuse
export const buttonStyles = {
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

// Card styles
export const cardStyles = `
  bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden
  transition-all duration-300 ease-in-out
  hover:shadow-xl transform hover:-translate-y-1
  focus-within:ring-2 focus-within:ring-blue-500
  p-4 sm:p-6 lg:p-8
  mx-4 sm:mx-0
`;

// Print Styles
export const printStyles = `
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