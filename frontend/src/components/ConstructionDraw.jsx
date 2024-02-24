/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ConstructionDraw = ({ propertyId }) => {
  const [draws, setDraws] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/construction-draws/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch construction draws");
        }

        const data = await response.json();
        setDraws(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDraws();
  }, [propertyId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Construction Draws</h2>
      {draws.length > 0 ? (
        draws.map((draw) => (
          <div key={draw.id}>
            <p>
              Release Date: {new Date(draw.release_date).toLocaleDateString()}
            </p>
            <p>Amount: ${draw.amount}</p>
            <p>Bank Account: {draw.bank_account_number}</p>
            <p>Approved: {draw.is_approved ? "Yes" : "No"}</p>
          </div>
        ))
      ) : (
        <p>No Construction Draws Found.</p>
      )}
    </div>
  );
};

export default ConstructionDraw;
