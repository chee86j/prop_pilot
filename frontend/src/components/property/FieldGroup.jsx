import { ChevronDown } from "lucide-react";

// Field Group Component - This groups the sections together
const FieldGroup = ({
  title,
  children,
  isExpanded,
  onToggle,
  icon = null,
  importance = "normal",
  "data-field-group": dataFieldGroup,
}) => {
  // Color themes based on importance
  const importanceStyles = {
    high: "border-l-4 border-blue-500",
    normal: "border-l-4 border-gray-300",
    low: "border-l-4 border-gray-200",
  };

  return (
    <div
      className={`mb-6 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${importanceStyles[importance]}`}
      data-field-group={dataFieldGroup}
      id={`section-${dataFieldGroup}`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          {title}
        </h3>
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
};

export default FieldGroup; 