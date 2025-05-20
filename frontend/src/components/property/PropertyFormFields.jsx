import { toast } from "react-toastify";

const PropertyFormFields = ({ 
  label, 
  name, 
  type = "text", 
  isNumber = false, 
  isEditing, 
  editedDetails,
  propertyDetails,
  handleInputChange,
  error,
  isRequired = false
}) => {
  // If isRequired is not explicitly passed, determine based on field name
  if (isRequired === undefined) {
    isRequired = [
      "propertyName",
      "address",
      "city",
      "state",
      "zipCode",
    ].includes(name);
  }

  const value = isEditing ? editedDetails[name] : propertyDetails?.[name];
  const hasError = error && isRequired && !value && type !== "number";

  return (
    <div className="form-group mb-4">
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor={name}
      >
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value || ""}
        onChange={handleInputChange}
        disabled={!isEditing}
        required={isRequired}
        className={`
          w-full px-3 py-2 rounded-lg border
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition duration-150 ease-in-out
          ${isNumber ? "text-right" : ""}
          ${hasError ? "border-red-500" : "border-gray-300"}
          ${isRequired ? "bg-gray-50" : ""}
          ${!isEditing ? "bg-gray-50 text-gray-700" : ""}
        `}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-500">{`${label} is required`}</p>
      )}
    </div>
  );
};

export default PropertyFormFields; 