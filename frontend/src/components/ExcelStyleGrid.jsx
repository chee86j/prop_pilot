import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatFullCurrency,
} from "../utils/formatting";
import SkyScrapers from "../assets/icons/skyscrapers.png";

const ExcelStyleGrid = () => {
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const columns = [
    { headerName: "Property Name", field: "propertyName" },
    { headerName: "Address", field: "address" },
    { headerName: "City", field: "city" },
    {
      headerName: "Purchase Cost",
      field: "purchaseCost",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      headerName: "Total Rehab Cost",
      field: "totalRehabCost",
      valueFormatter: (params) => formatCurrencyDetailed(params.value),
    },
    {
      headerName: "ARV Sale Price",
      field: "arvSalePrice",
      valueFormatter: (params) => formatFullCurrency(params.value),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="flex space-x-2">
          <button
            className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => handleDetails(params.data.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
          <button
            className="flex items-center justify-center bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => handleDelete(params.data.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4"
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
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "100vh", width: "100%", padding: "1rem" }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={SkyScrapers} alt="SkyScrapers" className="w-24 h-24" />
            <div>
              <h1 className="text-xl font-semibold text-gray-700">
                Displaying Properties
              </h1>
              {user && (
                <h2 className="text-lg font-medium text-green-500">
                  {`for ${user.first_name} ${user.last_name}`}
                </h2>
              )}
            </div>
            <img src={SkyScrapers} alt="SkyScrapers" className="w-24 h-24" />
          </div>
          <button
            onClick={goToAddPropertyPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300"
          >
            Add New Property
          </button>
        </div>
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
      />
    </div>
  );
};

export default ExcelStyleGrid;
