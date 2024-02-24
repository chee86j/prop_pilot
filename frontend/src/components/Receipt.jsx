/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Receipt = ({ drawId }) => {
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/receipts/${drawId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch receipts");
        }

        const data = await response.json();
        setReceipts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReceipts();
  }, [drawId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Receipts
      </h1>
      {error && <div className="text-red-600">Error: {error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {receipts.length > 0 ? (
          receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="receipt bg-gray-50 p-4 shadow-sm rounded-md"
            >
              <p>
                <strong>Date:</strong>{" "}
                {new Date(receipt.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Vendor:</strong> {receipt.vendor}
              </p>
              <p>
                <strong>Amount:</strong> ${receipt.amount}
              </p>
              <p>
                <strong>Description:</strong> {receipt.description}
              </p>
            </div>
          ))
        ) : (
          <p>No Receipts Found.</p>
        )}
      </div>
    </div>
  );
};

export default Receipt;
