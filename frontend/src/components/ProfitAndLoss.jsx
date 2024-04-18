/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ProfitAndLoss = ({ propertyId }) => {
  const [profitLossData, setProfitLossData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfitLoss = async () => {
      try {
        const response = await fetch(
          `/api/properties/${propertyId}/profit_loss`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, ${errorText}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received content is not JSON");
        }

        const data = await response.json();
        setProfitLossData(data);
      } catch (error) {
        console.error("Error fetching profit and loss data:", error);
        setError(`Error: ${error.message}`);
      }
    };

    fetchProfitLoss();
  }, [propertyId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profitLossData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto mt-5">
      <h2 className="text-xl font-semibold text-gray-800">
        Profit and Loss Statement for Property ID: {propertyId}
      </h2>
      <ul className="list-disc pl-5 mt-4">
        <li>
          Total Expected Rent:{" "}
          <span className="font-bold">
            ${profitLossData.total_expected_rent.toFixed(2)}
          </span>
        </li>
        <li>
          Total Rent Received:{" "}
          <span className="font-bold">
            ${profitLossData.total_rent_received.toFixed(2)}
          </span>
        </li>
        <li>
          Total Expenses:{" "}
          <span className="font-bold">
            ${profitLossData.total_expenses.toFixed(2)}
          </span>
        </li>
        <li>
          Net Profit:{" "}
          <span className="font-bold text-green-500">
            ${profitLossData.net_profit.toFixed(2)}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default ProfitAndLoss;
