/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Receipt from "./Receipt";

const ConstructionDraw = ({ propertyId }) => {
  const [draws, setDraws] = useState([]);
  const [error, setError] = useState(null);
  const [editDrawId, setEditDrawId] = useState(null);
  const [editedDraw, setEditedDraw] = useState({});
  const [newDraw, setNewDraw] = useState({
    release_date: "",
    amount: "",
    bank_account_number: "",
    is_approved: false,
  });
  const [showAddDrawForm, setShowAddDrawForm] = useState(false);

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
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDraws();
  }, [propertyId]);

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return parseFloat(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString();
  };

  const startEdit = (draw) => {
    setEditDrawId(draw.id);
    setEditedDraw({ ...draw });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedDraw({
      ...editedDraw,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/construction-draws/${editDrawId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editedDraw),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update draw");
      }

      const updatedDraw = await response.json();
      setDraws(
        draws.map((draw) => (draw.id === editDrawId ? updatedDraw : draw))
      );
      setEditDrawId(null);
      setEditedDraw({});
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  const cancelEdit = () => {
    setEditDrawId(null);
    setEditedDraw({});
  };

  const handleAddDrawChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDraw({
      ...newDraw,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddDraw = async (e) => {
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
      setNewDraw({
        release_date: "",
        amount: "",
        bank_account_number: "",
        is_approved: false,
      });
      setShowAddDrawForm(false);
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteDraw = async (drawId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/construction-draws/${drawId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete construction draw");
      }

      setDraws(draws.filter((draw) => draw.id !== drawId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-lg rounded-lg text-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Construction Draws
      </h2>

      <button
        onClick={() => setShowAddDrawForm(!showAddDrawForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
      >
        + New Draw
      </button>

      {showAddDrawForm && (
        <form onSubmit={handleAddDraw} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date Draw Released
              </label>
              <input
                type="date"
                name="release_date"
                value={newDraw.release_date}
                onChange={handleAddDrawChange}
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
                onChange={handleAddDrawChange}
                className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Bank Account Number (Last 4 Digits)
              </label>
              <input
                type="text"
                name="bank_account_number"
                placeholder="XXXX"
                value={newDraw.bank_account_number}
                onChange={handleAddDrawChange}
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
                onChange={handleAddDrawChange}
                className="mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add Draw
          </button>
        </form>
      )}

      {draws.length > 0 ? (
        draws.map((draw, index) => (
          <div
            key={draw.id}
            className="mb-4 bg-gray-50 p-4 shadow-sm rounded-md"
          >
            {/* Draw display logic */}
            {editDrawId === draw.id ? (
              <form onSubmit={saveEdit}>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    name="release_date"
                    value={editedDraw.release_date}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={editedDraw.amount}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={editedDraw.bank_account_number}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Approval Status
                  </label>
                  <input
                    type="checkbox"
                    name="is_approved"
                    checked={editedDraw.is_approved}
                    onChange={handleEditChange}
                    className="mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div className="draw-card bg-gray-50 p-4 rounded-md mb-4 shadow-sm">
                  <h3 className="text-xl font-extrabold text-gray-700 mb-3">
                    Draw #{index + 1}
                  </h3>
                  <div className="draw-details indent-2 text-gray-700 mb-4">
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        Release Date: {formatDate(draw.release_date)}
                      </p>
                    </div>
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        Amount: {formatCurrency(draw.amount)}
                      </p>
                    </div>
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        Account: x{draw.bank_account_number}
                      </p>
                    </div>
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        Approved: {draw.is_approved ? "Yes" : "No"}
                      </p>
                    </div>
                    {/* </div> */}

                    {/* <div className="flex justify-end space-x-2 mb-2"> */}

                    <div style={{ display: "inline-block", marginRight: "px" }}>
                      <button
                        onClick={() => startEdit(draw)}
                        className="mb-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded transition duration-300 ease-in-out"
                      >
                        Edit
                      </button>
                    </div>

                    <div style={{ display: "inline-block" }}>
                      <button
                        onClick={() => handleDeleteDraw(draw.id)}
                        className="mb-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition duration-300 ease-in-out"
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <Receipt drawId={draw.id} />
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-red-500">No Construction Draws Found.</p>
      )}
    </div>
  );
};

export default ConstructionDraw;
