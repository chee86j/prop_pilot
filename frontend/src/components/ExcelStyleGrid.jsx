import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatFullCurrency,
} from "../utils/formatting";

const ExcelStyleGrid = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/properties", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRowData(data))
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  const columns = [
    { headerName: "Property Name", field: "propertyName" },
    { headerName: "Address", field: "address" },
    { headerName: "City", field: "city" },
    { headerName: "State", field: "state" },
    { headerName: "Zip Code", field: "zipCode" },
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
  ];

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: "100vh", width: "100%", padding: "1rem" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        domLayout="autoHeight"
        aria-label="Property Data Grid"
      />
    </div>
  );
};

export default ExcelStyleGrid;
