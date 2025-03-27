/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "../utils/formatting";
import Receipt from "./Receipt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    property_id: propertyId,
  });
  const [showAddDrawForm, setShowAddDrawForm] = useState(false);
  const [drawStats, setDrawStats] = useState({
    totalDraws: 0,
    totalReceipts: 0,
    completionPercentage: 0,
    remainingBalance: 0,
  });
  const [validationErrors, setValidationErrors] = useState({
    draw: null,
    receipt: null,
  });

  // Add toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

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
        console.error("Failed to fetch construction draws:", error);
      }
    };

    fetchDraws();
  }, [propertyId]);

  // Separate useEffect to fetch receipts and calculate totals
  useEffect(() => {
    const fetchReceiptsAndCalculate = async () => {
      if (!draws.length) return;

      try {
        // Fetch receipts for each draw
        const drawsWithReceipts = await Promise.all(
          draws.map(async (draw) => {
            const response = await fetch(
              `http://localhost:5000/api/receipts/${draw.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            if (!response.ok)
              throw new Error(`Failed to fetch receipts for draw ${draw.id}`);
            const receipts = await response.json();
            return { ...draw, receipts };
          })
        );

        // Calculate totals
        const totalDrawAmount = drawsWithReceipts.reduce(
          (sum, draw) => sum + Number(draw.amount),
          0
        );

        let totalReceiptAmount = 0;
        drawsWithReceipts.forEach((draw) => {
          if (Array.isArray(draw.receipts)) {
            draw.receipts.forEach((receipt) => {
              const amount = Number(receipt.amount);
              if (!isNaN(amount)) {
                totalReceiptAmount += amount;
              }
            });
          }
        });

        const completionPercentage =
          (totalReceiptAmount / totalDrawAmount) * 100;
        const remainingBalance = totalDrawAmount - totalReceiptAmount;

        setDrawStats({
          totalDraws: totalDrawAmount,
          totalReceipts: totalReceiptAmount,
          completionPercentage: Math.min(completionPercentage, 100),
          remainingBalance: Math.max(remainingBalance, 0),
        });

        // Update draws with receipts
        setDraws(drawsWithReceipts);
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
        setError("Failed to fetch receipts");
      }
    };

    fetchReceiptsAndCalculate();
  }, [draws.length]); // Only re-run when the number of draws changes

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
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
      toast.success("Draw updated successfully", toastConfig);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to update draw", toastConfig);
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
    setValidationErrors((prev) => ({ ...prev, draw: null }));

    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = new Date(newDraw.release_date)
        .toISOString()
        .split('T')[0];

      const requestData = {
        ...newDraw,
        release_date: formattedDate,
        property_id: parseInt(propertyId, 10),
        amount: parseFloat(newDraw.amount),
      };
      
      console.log('Sending construction draw data:', requestData);

      const response = await fetch(
        "http://localhost:5000/api/construction-draws",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add construction draw");
      }

      // Update the draws state with the new draw data
      setDraws((prevDraws) => {
        const newDraws = [
          ...prevDraws,
          data.draw // Use data.draw since that's how the backend sends it
        ].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        return newDraws;
      });

      setNewDraw({
        release_date: "",
        amount: "",
        bank_account_number: "",
        is_approved: false,
        property_id: propertyId,
      });
      setShowAddDrawForm(false);
      toast.success("Construction draw added successfully", toastConfig);
    } catch (error) {
      console.error('Error adding construction draw:', error);
      console.error('Error details:', error.message);
      toast.error(error.message || "Failed to add construction draw", toastConfig);
      setValidationErrors((prev) => ({ ...prev, draw: error.message }));
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

      const data = await response.json();
      console.log('Delete response:', data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete construction draw");
      }

      setDraws(draws.filter((draw) => draw.id !== drawId));
      toast.success(data.message || "Construction draw deleted successfully", toastConfig);
    } catch (error) {
      console.error('Error deleting draw:', error);
      toast.error(error.message || "Failed to delete construction draw", toastConfig);
      setValidationErrors((prev) => ({ ...prev, draw: error.message }));
    }
  };

  const handleReceiptChange = useCallback(() => {
    // Trigger a refresh of receipts and recalculation of totals
    const fetchReceiptsAndCalculate = async () => {
      if (!draws.length) return;

      try {
        // Fetch receipts for each draw
        const drawsWithReceipts = await Promise.all(
          draws.map(async (draw) => {
            const response = await fetch(
              `http://localhost:5000/api/receipts/${draw.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );
            if (!response.ok)
              throw new Error(`Failed to fetch receipts for draw ${draw.id}`);
            const receipts = await response.json();
            return { ...draw, receipts };
          })
        );

        // Calculate totals
        const totalDrawAmount = drawsWithReceipts.reduce(
          (sum, draw) => sum + Number(draw.amount),
          0
        );

        let totalReceiptAmount = 0;
        drawsWithReceipts.forEach((draw) => {
          if (Array.isArray(draw.receipts)) {
            draw.receipts.forEach((receipt) => {
              const amount = Number(receipt.amount);
              if (!isNaN(amount)) {
                totalReceiptAmount += amount;
              }
            });
          }
        });

        const completionPercentage =
          (totalReceiptAmount / totalDrawAmount) * 100;
        const remainingBalance = totalDrawAmount - totalReceiptAmount;

        setDrawStats({
          totalDraws: totalDrawAmount,
          totalReceipts: totalReceiptAmount,
          completionPercentage: Math.min(completionPercentage, 100),
          remainingBalance: Math.max(remainingBalance, 0),
        });

        // Update draws with receipts
        setDraws(drawsWithReceipts);
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
        setError("Failed to fetch receipts");
      }
    };

    fetchReceiptsAndCalculate();
  }, [draws]);

  const ValidationError = ({ error }) => {
    if (!error) return null;

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  const ProgressIndicator = ({ percentage }) => {
    const getColorClass = (percent) => {
      if (percent < 33) return "bg-red-500";
      if (percent < 66) return "bg-yellow-500";
      return "bg-green-500";
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
        <div
          className={`h-2.5 rounded-full ${getColorClass(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    );
  };

  const DrawStatistics = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Draws</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {formatCurrency(stats.totalDraws)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Receipts</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {formatCurrency(stats.totalReceipts)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Draw % Used</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {stats.completionPercentage.toFixed(1)}%
        </p>
        <ProgressIndicator percentage={stats.completionPercentage} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Remaining Balance</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {formatCurrency(stats.remainingBalance)}
        </p>
      </div>
    </div>
  );

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Calculate subtotal for Released Draws
  const subtotaldraws =
    draws?.reduce((acc, draw) => acc + parseFloat(draw.amount || 0), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-lg rounded-lg text-sm">
      <ToastContainer autoClose={3000} />
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
        Construction Draws
      </h2>

      <DrawStatistics stats={drawStats} />

      <ValidationError error={validationErrors.draw} />
      <ValidationError error={validationErrors.receipt} />

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

                  <Receipt
                    drawId={draw.id}
                    onReceiptChange={handleReceiptChange}
                  />
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
