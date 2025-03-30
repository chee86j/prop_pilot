/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PREDEFINED_PHASES, PHASE_CATEGORIES } from "../constants/phases";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const initialFormState = {
  name: "",
  expectedStartDate: "",
  startDate: "",
  expectedEndDate: "",
  endDate: "",
  category: "",
  isCustomPhase: false,
};

const PhaseForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter phases based on search term
  const filteredPhases = PREDEFINED_PHASES.filter((phase) =>
    phase.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const predefinedPhase = PREDEFINED_PHASES.find(
        (p) => p.name === initialData.name
      );
      setFormData({
        ...initialData,
        category:
          initialData.category ||
          (predefinedPhase ? predefinedPhase.category : ""),
        isCustomPhase: !predefinedPhase,
      });
      setSearchTerm(initialData.name || "");
      setShowCustomInput(!predefinedPhase);
    } else {
      setFormData(initialFormState);
      setSearchTerm("");
      setShowCustomInput(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "name") {
      setSearchTerm(value);
    }
  };

  const handlePhaseSelect = (phase) => {
    setFormData({
      ...formData,
      name: phase.name,
      category: phase.category,
      isCustomPhase: false,
    });
    setSearchTerm(phase.name);
    setIsDropdownOpen(false);
    setShowCustomInput(false);
  };

  const handleCustomPhase = () => {
    setShowCustomInput(true);
    setIsDropdownOpen(false);
    setFormData({
      ...formData,
      name: searchTerm,
      isCustomPhase: true,
    });
  };

  const validateFormData = (data) => {
    if (!data.name) {
      toast.error("Please enter a phase name");
      return false;
    }
    if (!data.expectedStartDate) {
      toast.error("Please enter an expected start date");
      return false;
    }
    if (!data.expectedEndDate) {
      toast.error("Please enter an expected end date");
      return false;
    }
    if (!data.category) {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData(formData)) {
      onSave(formData);
      setFormData(initialFormState);
      setSearchTerm("");
      toast.success("Phase saved successfully!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <ToastContainer />

      {/* Phase Name Input/Selection */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phase Name
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name="name"
            value={searchTerm}
            onChange={(e) => {
              handleChange(e);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(true)}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type or select a phase name"
          />
          {!showCustomInput && (
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {isDropdownOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && !showCustomInput && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="sticky top-0 bg-white p-2 border-b">
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search phases..."
                />
              </div>
            </div>
            {filteredPhases.map((phase, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePhaseSelect(phase)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <span className="block font-medium">{phase.name}</span>
                <span className="text-sm text-gray-500">
                  {PHASE_CATEGORIES[phase.category].name}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleCustomPhase}
              className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none font-medium"
            >
              + Create Custom Phase
            </button>
          </div>
        )}
      </div>

      {/* Category Selection - Show only for custom phases or when editing */}
      {(showCustomInput || formData.isCustomPhase) && (
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
            <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {Object.entries(PHASE_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="expectedStartDate"
            className="block text-sm font-medium text-gray-700"
          >
            Expected Start Date
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="expectedStartDate"
            value={formData.expectedStartDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Actual Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="expectedEndDate"
            className="block text-sm font-medium text-gray-700"
          >
            Expected End Date
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="expectedEndDate"
            value={formData.expectedEndDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            Actual End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PhaseForm;
