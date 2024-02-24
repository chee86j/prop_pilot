/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ConstructionDraw = ({ propertyId }) => {
  const [draws, setDraws] = useState([]);
  const [error, setError] = useState(null);
  const [newDraw, setNewDraw] = useState({
    release_date: "",
    amount: "",
    bank_account_number: "",
  });

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

  const handleAddDraw = (e) => {
    setNewDraw({ ...newDraw, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/construction-draws",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ ...newDraw, property_id: propertyId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add construction draw");
      }

      const addedDraw = await response.json();
      setDraws([...draws, addedDraw]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Adjust error styling
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Construction Draws
      </h2>

      {draws.length > 0 ? (
        draws.map((draw) => (
          <div
            key={draw.id}
            className="mb-4 bg-gray-50 p-4 shadow-sm rounded-md"
          >
            <p className="text-gray-700">
              Release Date: {new Date(draw.release_date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">Amount: ${draw.amount}</p>
            <p className="text-gray-700">
              Bank Account: {draw.bank_account_number}
            </p>
            <p className="text-gray-700">
              Approved: {draw.is_approved ? "Yes" : "No"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-700">No Construction Draws Found.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Add a Construction Draw
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date Draw Released
            </label>
            <input
              type="date"
              name="release_date"
              value={newDraw.release_date}
              onChange={handleAddDraw}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount of Released Funds
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={newDraw.amount}
              onChange={handleAddDraw}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bank Acct. Number (Last 4 Digits)
            </label>
            <input
              type="text"
              name="bank_account_number"
              placeholder="XXXX"
              value={newDraw.bank_account_number}
              onChange={handleAddDraw}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Approval Status
            </label>
            <input
              type="checkbox"
              name="is_approved"
              checked={newDraw.is_approved}
              onChange={handleAddDraw}
              className="mt-1"
            />
            <span className="ml-2 text-gray-700 text-sm">Approved</span>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Draw
        </button>
      </form>
    </div>
  );
};

export default ConstructionDraw;
