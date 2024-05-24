import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const ExcelStyleGrid = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetch("path_to_your_data_source")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact onGridReady={onGridReady} rowData={rowData}>
        {/* column definitions */}
      </AgGridReact>
    </div>
  );
};

export default ExcelStyleGrid;
