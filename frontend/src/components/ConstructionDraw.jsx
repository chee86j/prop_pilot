/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatting";
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
        // Sort draws by release date in ascending order
        const sortedDraws = data.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
        setDraws(sortedDraws);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDraws();
  }, [propertyId]);

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
    window.location.reload();
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

  // Calculate subtotal for Released Draws
  const subtotaldraws = draws.reduce(
    (acc, draw) => acc + parseFloat(draw.amount),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-lg rounded-lg text-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Construction Draws
      </h2>

      <button
        onClick={() => setShowAddDrawForm(!showAddDrawForm)}
        className="rounded-lg relative w-28 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
      >
        <span className="text-white font-semibold ml-6 transform group-hover:translate-x-10 transition-all duration-300">
          Draw
        </span>
        <span className="absolute right-0 h-full w-12 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
          <svg
            className="svg w-8 text-white"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" x2="12" y1="5" y2="19"></line>
            <line x1="5" x2="19" y1="12" y2="12"></line>
          </svg>
        </span>
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
            Submit New Draw
          </button>
        </form>
      )}

      {draws.length > 0 ? (
        draws.map((draw, index) => (
          <div
            key={draw.id}
            className="mb-4 bg-gray-50 p-4 shadow-sm rounded-md md:p-1"
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
                <div className="draw-card bg-gray-50 rounded-md mb-4 shadow-sm">
                  <h3 className="text-xl font-extrabold text-gray-700 mb-3">
                    Draw # {index + 1}
                  </h3>
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Release Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Account
                        </th>
                        <th
                          scope="col"
                          className="hidden md:table-cell px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Approved
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-gray-700">
                        <td className="border px-4 py-2 text-center">
                          {formatDate(draw.release_date)}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {formatCurrency(draw.amount)}
                        </td>
                        <td className="hidden md:table-cell border px-4 py-2 text-center">
                          x{draw.bank_account_number}
                        </td>
                        <td className="hidden md:table-cell border px-4 py-2 text-center">
                          {draw.is_approved ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                            <button
                              onClick={() => startEdit(draw)}
                              className="inline-block px-3 py-2 border text-blue-600 hover:bg-blue-100 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                              title="Edit Product"
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
                              onClick={() => handleDeleteDraw(draw.id)}
                              className="inline-block px-3 py-2 border text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring focus:border-red-300"
                              title="Delete Product"
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
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <Receipt drawId={draw.id} />
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="indent-2 text-red-500">No Construction Draws Found.</p>
      )}
      {/* Draws Released Section */}
      <h1 className="text-xl font-bold text-gray-700 mb-4">Draws Released</h1>
      <table className="w-full table-auto mb-4">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Draw #
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Release Date
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="hidden md:table-cell px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Account
            </th>
            <th
              scope="col"
              className="hidden md:table-cell px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Approved
            </th>
          </tr>
        </thead>
        <tbody>
          {draws.map((draw, index) => (
            <tr key={draw.id} className="text-gray-700 hover:bg-gray-100">
              <td className="border text-center px-4 py-2">{index + 1}</td>
              <td className="border text-center px-4 py-2">
                {formatDate(draw.release_date)}
              </td>
              <td className="border text-center px-4 py-2">
                {formatCurrency(draw.amount)}
              </td>
              <td className="hidden md:table-cell border text-center px-4 py-2">
                x{draw.bank_account_number}
              </td>
              <td className="hidden md:table-cell border text-center px-4 py-2">
                {draw.is_approved ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="indent-2 font-semibold text-gray-700 mt-3">
        Total Draws Released: {formatCurrency(subtotaldraws)}
      </p>
    </div>
  );
};

export default ConstructionDraw;
