import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { fetchUserProfile } from "../utils/fetchUserProfile";
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
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/properties", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRowData(data))
      .catch((error) => console.error("Error fetching properties:", error));
    fetchUserProfile(setUser);
  }, []);

  const goToAddPropertyPage = () => {
    navigate("/addproperty");
  };

  const handleDetails = (propertyId) => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    } else {
      console.error("PropertyId is undefined");
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
        })
        .catch((error) => console.error("Error deleting property:", error));
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

  const columns = [
    {
      headerName: "Property Name",
      field: "propertyName",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Address",
      field: "address",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "City",
      field: "city",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Purchase Cost",
      field: "purchaseCost",
      filter: false,
      floatingFilter: false,
      valueFormatter: (params) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      headerName: "Total Rehab Cost",
      field: "totalRehabCost",
      filter: false,
      floatingFilter: false,
      valueFormatter: (params) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      headerName: "ARV Sale Price",
      field: "arvSalePrice",
      filter: false,
      floatingFilter: false,
      valueFormatter: (params) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(params.value);
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="flex flex-wrap space-x-2">
          <button
            className="flex items-center justify-center bg-blue-500 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => handleDetails(params.data.id)}
            aria-label="View Property Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            className="flex items-center justify-center bg-red-500 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={() => handleDelete(params.data.id)}
            aria-label="Delete Property"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
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
      filter: false, // Disable filter for actions column
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
          <button
            onClick={goToAddPropertyPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:ring-2 focus:ring-blue-300"
          >
            Add New Property
          </button>
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

      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        defaultColDef={{
          filter: true,
          floatingFilter: true, // Enable quick filters
          sortable: true,
          resizable: true,
          minWidth: 100,
        }}
        pagination={true}
        paginationPageSize={25}
        paginationPageSizeSelector={[10, 25, 50, 100]}
        domLayout="autoHeight"
        aria-label="Property Data Grid"
        onGridReady={(params) => setGridApi(params.api)}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
      />
    </div>
  );
};

export default PropertyList;
