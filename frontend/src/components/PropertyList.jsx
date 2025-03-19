import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
// eslint-disable-next-line no-unused-vars
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import { formatCurrency } from "../utils/formatting";
import SkyScrapers from "../assets/icons/skyscrapers.png";

const PropertyList = () => {
  const [rowData, setRowData] = useState([]);
  const [user, setUser] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [filterValues, setFilterValues] = useState({
    purchaseCost: { min: "", max: "" },
    totalRehabCost: { min: "", max: "" },
    arvSalePrice: { min: "", max: "" },
  });
  const [isScrapingData, setIsScrapingData] = useState(false);
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    fetch("http://localhost:5000/api/properties", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRowData(data))
      .catch((error) => console.error("🚫 Error fetching properties:", error));
    fetchUserProfile(setUser);
  }, []);

  const goToAddPropertyPage = () => {
    navigate("/addproperty");
  };

  const handleDetails = (propertyId) => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    } else {
      console.error("🚫 PropertyId is undefined");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      fetch(`http://localhost:5000/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete property");
          setRowData((prevData) => prevData.filter((row) => row.id !== id));
          toast.success("🗑️ Property deleted successfully!");
        })
        .catch((error) => {
          console.error("🚫 Error deleting property:", error);
          toast.error("❌ Failed to delete property: " + error.message);
        });
    }
  };

  const handleFilterChange = (field, type, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [field]: { ...prev[field], [type]: value },
    }));
  };

  const applyFilters = () => {
    if (gridApi) {
      gridApi.setFilterModel({}); // Clear existing filters
      gridApi.onFilterChanged(); // Force refresh
    }
  };

  const resetFilters = () => {
    setFilterValues({
      purchaseCost: { min: "", max: "" },
      totalRehabCost: { min: "", max: "" },
      arvSalePrice: { min: "", max: "" },
    });
    if (gridApi) {
      gridApi.setFilterModel({});
      gridApi.onFilterChanged();
    }
  };

  const isExternalFilterPresent = () => {
    return Object.values(filterValues).some(
      (filter) => filter.min !== "" || filter.max !== ""
    );
  };

  const doesExternalFilterPass = (node) => {
    const data = node.data;

    const inRange = (value, min, max) => {
      const numValue = Number(value);
      const numMin = Number(min);
      const numMax = Number(max);

      if (min && max) return numValue >= numMin && numValue <= numMax;
      if (min) return numValue >= numMin;
      if (max) return numValue <= numMax;
      return true;
    };

    return (
      inRange(
        data.purchaseCost,
        filterValues.purchaseCost.min,
        filterValues.purchaseCost.max
      ) &&
      inRange(
        data.totalRehabCost,
        filterValues.totalRehabCost.min,
        filterValues.totalRehabCost.max
      ) &&
      inRange(
        data.arvSalePrice,
        filterValues.arvSalePrice.min,
        filterValues.arvSalePrice.max
      )
    );
  };

  const handleRunScraper = async () => {
    setIsScrapingData(true);
    try {
      console.log("🤖 Starting Scraper...");
      const response = await fetch("http://localhost:5000/api/run-scraper", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to Run Foreclosure Scraper"
        );
      }

      console.log("✅ Scraper Completed Successfully:", data);
      toast.success("🏠 Foreclosure List Scraped Successfully!");
    } catch (error) {
      console.error("🚫 Scraper Error:", error);
      toast.error("❌ Failed to Run Foreclosure Scraper: " + error.message);
    } finally {
      setIsScrapingData(false);
    }
  };

  const columns = [
    {
      headerName: "Actions",
      field: "actions",
      pinned: 'left', // Pin to left for better mobile experience
      width: 120,
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
      filter: false,
      suppressMovable: true, // Prevent column from being moved
      cellClass: 'action-cell',
      cellStyle: { 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.5rem'
      },
      cellRenderer: (params) => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
            onClick={() => handleDetails(params.data.id)}
            aria-label="View Property Details"
            title="View Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-colors duration-200"
            onClick={() => handleDelete(params.data.id)}
            aria-label="Delete Property"
            title="Delete Property"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      ),
    },
    {
      headerName: "Property Name",
      field: "propertyName",
      filter: "agTextColumnFilter",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Address",
      field: "address",
      filter: "agTextColumnFilter",
      minWidth: 200,
      flex: 1,
      hide: isMobile, // Hide on mobile to save space
    },
    {
      headerName: "City",
      field: "city",
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 1,
    },
    {
      headerName: "Purchase Cost",
      field: "purchaseCost",
      filter: false,
      floatingFilter: false,
      minWidth: 150,
      flex: 1,
      valueFormatter: (params) => formatCurrency(params.value),
      hide: isMobile, // Hide on mobile to save space
    },
    {
      headerName: "Total Rehab Cost",
      field: "totalRehabCost",
      filter: false,
      floatingFilter: false,
      minWidth: 150,
      flex: 1,
      valueFormatter: (params) => formatCurrency(params.value),
      hide: isMobile, // Hide on mobile to save space
    },
    {
      headerName: "ARV Sale Price",
      field: "arvSalePrice",
      filter: false,
      floatingFilter: false,
      minWidth: 150,
      flex: 1,
      valueFormatter: (params) => formatCurrency(params.value),
      hide: isMobile, // Hide on mobile to save space
    },
  ];

  return (
    <div
      className="ag-theme-alpine max-w-full mx-auto p-4"
      style={{ height: "100vh", willChange: "transform" }} // will-change error boundary fix
    >
      <header className="mb-6" style={{ willChange: "transform" }}>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={SkyScrapers}
              alt="SkyScrapers"
              className="w-16 h-16 sm:w-24 sm:h-24"
              aria-hidden="true"
              style={{ willChange: "transform" }}
            />
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-700">
                Displaying Properties
              </h1>
              {user && (
                <h2 className="text-sm sm:text-lg font-medium text-green-500">
                  {`for ${user.first_name} ${user.last_name}`}
                </h2>
              )}
            </div>
            <img src={SkyScrapers} alt="SkyScrapers" className="w-24 h-24" />
          </div>
          {/* <button
            onClick={goToAddPropertyPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:ring-2 focus:ring-blue-300"
          >
            Add New Property
          </button> */}
        </div>
      </header>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Purchase Cost Filter
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded"
              value={filterValues.purchaseCost.min}
              onChange={(e) =>
                handleFilterChange("purchaseCost", "min", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded"
              value={filterValues.purchaseCost.max}
              onChange={(e) =>
                handleFilterChange("purchaseCost", "max", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rehab Cost Filter
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded"
              value={filterValues.totalRehabCost.min}
              onChange={(e) =>
                handleFilterChange("totalRehabCost", "min", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded"
              value={filterValues.totalRehabCost.max}
              onChange={(e) =>
                handleFilterChange("totalRehabCost", "max", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ARV Sale Price Filter
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded"
              value={filterValues.arvSalePrice.min}
              onChange={(e) =>
                handleFilterChange("arvSalePrice", "min", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded"
              value={filterValues.arvSalePrice.max}
              onChange={(e) =>
                handleFilterChange("arvSalePrice", "max", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={applyFilters}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset Filters
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={goToAddPropertyPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:ring-2 focus:ring-blue-300"
        >
          Add New Property
        </button>
        <button
          onClick={handleRunScraper}
          disabled={isScrapingData}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {isScrapingData ? "Scraping..." : "Run Foreclosure Scraper"}
        </button>
      </div>

      <div className="ag-theme-alpine w-full" style={{ height: "calc(100vh - 300px)" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={{
            filter: true,
            floatingFilter: true,
            sortable: true,
            resizable: true,
            suppressMovable: false,
            flex: 1,
            minWidth: 100,
            cellStyle: { fontSize: isMobile ? "12px" : "14px" },
          }}
          pagination={true}
          paginationPageSize={25}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          domLayout="autoHeight"
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          rowSelection="multiple"
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          animateRows={true}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onGridReady={(params) => {
            setGridApi(params.api);
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </div>
  );
};

export default PropertyList;
