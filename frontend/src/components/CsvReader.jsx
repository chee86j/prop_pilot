/* eslint-disable react/prop-types */
import { useState } from "react";
import Papa from "papaparse";

const CsvReader = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      Papa.parse(file, {
        header: false, // To use the first row as headers
        complete: (result) => {
          setCsvData(result.data);

          if (onFileUpload) {
            onFileUpload(result.data);
          }
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {fileName && <p>Selected file: {fileName}</p>}
      {csvData && (
        <div>
          <h3>CSV Data:</h3>
          <pre>{JSON.stringify(csvData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CsvReader;
