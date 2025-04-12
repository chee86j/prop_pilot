/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "../utils/format";
import Receipt from "./Receipt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Edit2, Trash } from "lucide-react";

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
            try {
              if (!draw || !draw.id) {
                console.warn("Draw is missing or has no ID:", draw);
                return { ...draw, receipts: [] };
              }

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
            } catch (err) {
              console.error(
                `Error fetching receipts for draw ${draw?.id}:`,
                err
              );
              return { ...draw, receipts: [] };
            }
          })
        );

        // Calculate totals
        const totalDrawAmount = drawsWithReceipts.reduce(
          (sum, draw) => sum + (Number(draw?.amount) || 0),
          0
        );

        let totalReceiptAmount = 0;
        drawsWithReceipts.forEach((draw) => {
          if (draw && Array.isArray(draw.receipts)) {
            draw.receipts.forEach((receipt) => {
              const amount = Number(receipt?.amount || 0);
              if (!isNaN(amount)) {
                totalReceiptAmount += amount;
              }
            });
          }
        });

        const completionPercentage =
          totalDrawAmount > 0
            ? (totalReceiptAmount / totalDrawAmount) * 100
            : 0;
        const remainingBalance = totalDrawAmount - totalReceiptAmount;

        setDrawStats({
          totalDraws: totalDrawAmount,
          totalReceipts: totalReceiptAmount,
          completionPercentage: Math.min(completionPercentage, 100),
          remainingBalance: Math.max(remainingBalance, 0),
        });

        // Update draws with receipts - but keep the same reference if nothing changed
        const drawsChanged =
          JSON.stringify(drawsWithReceipts) !== JSON.stringify(draws);
        if (drawsChanged) {
          setDraws(drawsWithReceipts);
        }
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
        setError("Failed to fetch receipts");
      }
    };

    // Use a tracked flag to prevent multiple fetch operations
    let isMounted = true;
    if (isMounted) {
      fetchReceiptsAndCalculate();
    }

    return () => {
      isMounted = false;
    };
  }, [draws]); // Update dependency to track changes to draws array

  // Function to calculate financial summary from draws data
  const calculateFinancialSummary = useCallback((drawsData) => {
    if (!drawsData || !drawsData.length) {
      setDrawStats({
        totalDraws: 0,
        totalReceipts: 0,
        completionPercentage: 0,
        remainingBalance: 0,
      });
      return;
    }

    const totalDrawAmount = drawsData.reduce(
      (sum, draw) => sum + (Number(draw?.amount) || 0),
      0
    );

    let totalReceiptAmount = 0;
    drawsData.forEach((draw) => {
      if (draw && Array.isArray(draw.receipts)) {
        draw.receipts.forEach((receipt) => {
          const amount = Number(receipt?.amount || 0);
          if (!isNaN(amount)) {
            totalReceiptAmount += amount;
          }
        });
      }
    });

    const completionPercentage =
      totalDrawAmount > 0 ? (totalReceiptAmount / totalDrawAmount) * 100 : 0;
    const remainingBalance = totalDrawAmount - totalReceiptAmount;

    setDrawStats({
      totalDraws: totalDrawAmount,
      totalReceipts: totalReceiptAmount,
      completionPercentage: Math.min(completionPercentage, 100),
      remainingBalance: Math.max(remainingBalance, 0),
    });
  }, []);

  // Use the reusable calculation function in the useEffect
  useEffect(() => {
    calculateFinancialSummary(draws);
  }, [draws, calculateFinancialSummary]);

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
    setValidationErrors((prev) => ({ ...prev, draw: null }));

    // Client-side validation so that we don't send empty data to the server
    if (!editedDraw.release_date) {
      setValidationErrors((prev) => ({
        ...prev,
        draw: "Release date is required",
      }));
      toast.error("Release date is required", toastConfig);
      return;
    }

    if (!editedDraw.amount || parseFloat(editedDraw.amount) <= 0) {
      setValidationErrors((prev) => ({
        ...prev,
        draw: "Amount must be greater than 0",
      }));
      toast.error("Amount must be greater than 0", toastConfig);
      return;
    }

    if (
      !editedDraw.bank_account_number ||
      editedDraw.bank_account_number.length < 4
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        draw: "Bank account number must be at least 4 digits",
      }));
      toast.error("Bank account number must be at least 4 digits", toastConfig);
      return;
    }

    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = new Date(editedDraw.release_date)
        .toISOString()
        .split("T")[0];

      const requestData = {
        ...editedDraw,
        release_date: formattedDate,
        property_id: parseInt(propertyId, 10),
        amount: parseFloat(editedDraw.amount),
      };

      console.log("Sending update request with data:", requestData);

      const response = await fetch(
        `http://localhost:5000/api/construction-draws/${editDrawId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("Update response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update draw");
      }

      // Fetch all draws to ensure we have the latest data including receipts
      const drawsResponse = await fetch(
        `http://localhost:5000/api/construction-draws/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!drawsResponse.ok) {
        throw new Error("Failed to refresh construction draws");
      }

      const drawsData = await drawsResponse.json();
      // Sort draws by release date in ascending order
      const sortedDraws = drawsData.sort(
        (a, b) => new Date(a.release_date) - new Date(b.release_date)
      );

      // Now fetch receipts for each draw to ensure we have complete data
      const drawsWithReceipts = await Promise.all(
        sortedDraws.map(async (draw) => {
          try {
            if (!draw || !draw.id) {
              return { ...draw, receipts: [] };
            }

            const receiptResponse = await fetch(
              `http://localhost:5000/api/receipts/${draw.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );

            if (!receiptResponse.ok) {
              return { ...draw, receipts: [] };
            }

            const receipts = await receiptResponse.json();
            return { ...draw, receipts };
          } catch (err) {
            console.error(`Error fetching receipts for draw ${draw?.id}:`, err);
            return { ...draw, receipts: [] };
          }
        })
      );

      // Update the state with the complete data
      setDraws(drawsWithReceipts);

      // Recalculate financial summary with updated data
      calculateFinancialSummary(drawsWithReceipts);

      setEditDrawId(null);
      setEditedDraw({});
      toast.success("Draw updated successfully", toastConfig);
    } catch (error) {
      console.error("Error updating draw:", error);
      console.error("Error details:", error.message);
      toast.error(error.message || "Failed to update draw", toastConfig);
      setValidationErrors((prev) => ({ ...prev, draw: error.message }));
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
    setValidationErrors((prev) => ({ ...prev, draw: null }));

    // Client-side validation so that we don't send empty data to the server
    if (!newDraw.release_date) {
      setValidationErrors((prev) => ({
        ...prev,
        draw: "Release date is required",
      }));
      toast.error("Release date is required", toastConfig);
      return;
    }

    if (!newDraw.amount || parseFloat(newDraw.amount) <= 0) {
      setValidationErrors((prev) => ({
        ...prev,
        draw: "Amount must be greater than 0",
      }));
      toast.error("Amount must be greater than 0", toastConfig);
      return;
    }

    if (
      !newDraw.bank_account_number ||
      newDraw.bank_account_number.length < 4
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        draw: "Bank account number must be at least 4 digits",
      }));
      toast.error("Bank account number must be at least 4 digits", toastConfig);
      return;
    }

    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = new Date(newDraw.release_date)
        .toISOString()
        .split("T")[0];

      const requestData = {
        ...newDraw,
        release_date: formattedDate,
        property_id: parseInt(propertyId, 10),
        amount: parseFloat(newDraw.amount),
      };

      console.log("Sending construction draw data:", requestData);

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
      console.log("Response from server:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add construction draw");
      }

      // Reload all draws to get fresh data rather than updating state directly
      const drawsResponse = await fetch(
        `http://localhost:5000/api/construction-draws/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!drawsResponse.ok) {
        throw new Error("Failed to refresh construction draws");
      }

      const drawsData = await drawsResponse.json();
      // Sort draws by release date in ascending order
      const sortedDraws = drawsData.sort(
        (a, b) => new Date(a.release_date) - new Date(b.release_date)
      );

      // Update the state with the complete sorted list from the server
      setDraws(sortedDraws);

      // Calculate financial summary with the new data
      calculateFinancialSummary(sortedDraws);

      // Reset form
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
      console.error("Error adding construction draw:", error);
      console.error("Error details:", error.message);
      toast.error(
        error.message || "Failed to add construction draw",
        toastConfig
      );
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
      console.log("Delete response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete construction draw");
      }

      const updatedDraws = draws.filter((draw) => draw.id !== drawId);
      setDraws(updatedDraws);

      // Recalculate financial summary after deletion
      calculateFinancialSummary(updatedDraws);

      toast.success(
        data.message || "Construction draw deleted successfully",
        toastConfig
      );
    } catch (error) {
      console.error("Error deleting draw:", error);
      toast.error(
        error.message || "Failed to delete construction draw",
        toastConfig
      );
      setValidationErrors((prev) => ({ ...prev, draw: error.message }));
    }
  };

  const handleReceiptChange = useCallback(() => {
    // Trigger a fresh fetch of all data
    const fetchAllData = async () => {
      try {
        // Fetch all draws fresh
        const drawsResponse = await fetch(
          `http://localhost:5000/api/construction-draws/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!drawsResponse.ok) {
          throw new Error("Failed to refresh construction draws");
        }

        const drawsData = await drawsResponse.json();

        // Sort and update draws first
        const sortedDraws = drawsData.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );

        // Now fetch receipts for each draw
        const drawsWithReceipts = await Promise.all(
          sortedDraws.map(async (draw) => {
            try {
              if (!draw || !draw.id) {
                return { ...draw, receipts: [] };
              }

              const receiptResponse = await fetch(
                `http://localhost:5000/api/receipts/${draw.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );

              if (!receiptResponse.ok) {
                return { ...draw, receipts: [] };
              }

              const receipts = await receiptResponse.json();
              return { ...draw, receipts };
            } catch (err) {
              console.error(
                `Error fetching receipts for draw ${draw?.id}:`,
                err
              );
              return { ...draw, receipts: [] };
            }
          })
        );

        // Calculate totals using the fetched data
        const totalDrawAmount = drawsWithReceipts.reduce(
          (sum, draw) => sum + (Number(draw?.amount) || 0),
          0
        );

        let totalReceiptAmount = 0;
        drawsWithReceipts.forEach((draw) => {
          if (draw && Array.isArray(draw.receipts)) {
            draw.receipts.forEach((receipt) => {
              const amount = Number(receipt?.amount || 0);
              if (!isNaN(amount)) {
                totalReceiptAmount += amount;
              }
            });
          }
        });

        const completionPercentage =
          totalDrawAmount > 0
            ? (totalReceiptAmount / totalDrawAmount) * 100
            : 0;
        const remainingBalance = totalDrawAmount - totalReceiptAmount;

        // Update stats
        setDrawStats({
          totalDraws: totalDrawAmount,
          totalReceipts: totalReceiptAmount,
          completionPercentage: Math.min(completionPercentage, 100),
          remainingBalance: Math.max(remainingBalance, 0),
        });

        // Update draws with the complete data
        setDraws(drawsWithReceipts);

        // Log successful update for debugging
        console.log("Financial summary updated:", {
          draws: totalDrawAmount,
          receipts: totalReceiptAmount,
          completion: completionPercentage.toFixed(1) + "%",
          remaining: remainingBalance,
        });
      } catch (error) {
        console.error("Failed to refresh data:", error);
        setError("Failed to refresh data");
      }
    };

    fetchAllData();
  }, [propertyId]);

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
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
        <div
          className={`h-2.5 rounded-full ${getColorClass(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    );
  };

  const DrawStatistics = ({ stats }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Financial Summary
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Total Draws
          </h4>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {formatCurrency(stats.totalDraws)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Total Receipts
          </h4>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {formatCurrency(stats.totalReceipts)}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Draw % Used
          </h4>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {stats.completionPercentage.toFixed(1)}%
          </p>
          <ProgressIndicator percentage={stats.completionPercentage} />
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Remaining Balance
          </h4>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900">
            {formatCurrency(stats.remainingBalance)}
          </p>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Calculate subtotal for Released Draws
  const subtotaldraws =
    draws?.reduce((acc, draw) => acc + parseFloat(draw?.amount || 0), 0) || 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-5 bg-white shadow-lg rounded-lg text-sm">
      <ToastContainer autoClose={3000} />
      <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4 sm:mb-6">
        Construction Draws
      </h2>

      {/* Debug output - comment out in production */}
      <div className="text-xs text-gray-500 mb-2" style={{ display: "none" }}>
        Draws: {draws.length} | Draw Stats: Draw Amount:{" "}
        {formatCurrency(drawStats.totalDraws)} | Receipt Amount:{" "}
        {formatCurrency(drawStats.totalReceipts)} | Completion:{" "}
        {drawStats.completionPercentage.toFixed(1)}%
      </div>

      <DrawStatistics stats={drawStats} />

      <ValidationError error={validationErrors.draw} />
      <ValidationError error={validationErrors.receipt} />

      <button
        onClick={() => setShowAddDrawForm(!showAddDrawForm)}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors w-full sm:w-auto"
        aria-label="Add construction draw"
      >
        <Plus size={18} />
        <span>Add New Draw</span>
      </button>

      {showAddDrawForm && (
        <form
          onSubmit={handleAddDraw}
          className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="release_date"
              >
                Date Draw Released
              </label>
              <input
                id="release_date"
                type="date"
                name="release_date"
                value={newDraw.release_date}
                onChange={handleAddDrawChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="amount"
              >
                Amount of Released Funds
              </label>
              <input
                id="amount"
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={newDraw.amount}
                onChange={handleAddDrawChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="bank_account_number"
              >
                Bank Account Number (Last 4 Digits)
              </label>
              <input
                id="bank_account_number"
                type="text"
                name="bank_account_number"
                placeholder="XXXX"
                value={newDraw.bank_account_number}
                onChange={handleAddDrawChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength="4"
                pattern="[0-9]{4}"
              />
            </div>
            <div className="flex items-center">
              <label
                className="flex items-center text-gray-700 text-sm font-bold"
                htmlFor="is_approved"
              >
                <input
                  id="is_approved"
                  type="checkbox"
                  name="is_approved"
                  checked={newDraw.is_approved}
                  onChange={handleAddDrawChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-2"
                />
                Approval Status
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Submit New Draw
            </button>
            <button
              type="button"
              onClick={() => setShowAddDrawForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {draws.length > 0 ? (
        draws.map((draw, index) => (
          <div
            key={draw.id}
            className="mt-6 bg-gray-50 p-4 shadow-sm rounded-lg transition-all"
          >
            {/* Draw display logic */}
            {editDrawId === draw.id ? (
              <form onSubmit={saveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="edit_release_date"
                    >
                      Release Date
                    </label>
                    <input
                      id="edit_release_date"
                      type="date"
                      name="release_date"
                      value={editedDraw.release_date}
                      onChange={handleEditChange}
                      className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="edit_amount"
                    >
                      Amount
                    </label>
                    <input
                      id="edit_amount"
                      type="number"
                      name="amount"
                      value={editedDraw.amount}
                      onChange={handleEditChange}
                      className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="edit_bank_account"
                    >
                      Bank Account Number
                    </label>
                    <input
                      id="edit_bank_account"
                      type="text"
                      name="bank_account_number"
                      value={editedDraw.bank_account_number}
                      onChange={handleEditChange}
                      className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength="4"
                      pattern="[0-9]{4}"
                    />
                  </div>
                  <div className="flex items-center">
                    <label
                      className="flex items-center text-gray-700 text-sm font-bold"
                      htmlFor="edit_is_approved"
                    >
                      <input
                        id="edit_is_approved"
                        type="checkbox"
                        name="is_approved"
                        checked={editedDraw.is_approved}
                        onChange={handleEditChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-2"
                      />
                      Approval Status
                    </label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="draw-card rounded-lg mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="text-lg font-extrabold text-gray-700">
                      Draw #{index + 1}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(draw)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        aria-label="Edit Draw"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteDraw(draw.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring focus:border-red-300"
                        aria-label="Delete Draw"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile-friendly card layout */}
                  <div className="block sm:hidden space-y-3 bg-white p-3 rounded-lg mb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">
                        Release Date:
                      </span>
                      <span>{formatDate(draw.release_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">
                        Amount:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(draw.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">
                        Account:
                      </span>
                      <span>x{draw.bank_account_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-600">
                        Approved:
                      </span>
                      <span>{draw.is_approved ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  {/* Table layout for larger screens */}
                  <div className="hidden sm:block">
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
                            className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Account
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            Approved
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          key={`draw-row-${draw.id}`}
                          className="text-gray-700"
                        >
                          <td className="border px-4 py-2 text-center">
                            {formatDate(draw.release_date)}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {formatCurrency(draw.amount)}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            x{draw.bank_account_number}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {draw.is_approved ? "Yes" : "No"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
        <div className="p-4 mt-6 bg-gray-50 rounded-lg flex justify-center items-center">
          <p className="text-red-500">No Construction Draws Found.</p>
        </div>
      )}

      {/* Draws Released Section - Mobile-friendly version */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Draws Released</h2>

        {/* Mobile view */}
        <div className="block sm:hidden space-y-4">
          {draws.map((draw, index) => (
            <div
              key={`mobile-draw-${draw.id}`}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                <span className="font-bold text-gray-800">
                  Draw #{index + 1}
                </span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(draw.amount)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-600">Release Date:</span>
                <span className="text-right">
                  {formatDate(draw.release_date)}
                </span>

                <span className="text-gray-600">Account:</span>
                <span className="text-right">x{draw.bank_account_number}</span>

                <span className="text-gray-600">Approved:</span>
                <span className="text-right">
                  {draw.is_approved ? "Yes" : "No"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Table for larger screens */}
        <div className="hidden sm:block overflow-x-auto">
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
                  className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Account
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
                  <td className="border text-center px-4 py-2">
                    x{draw.bank_account_number}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {draw.is_approved ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="font-semibold text-gray-700">
          Total Draws Released: {formatCurrency(subtotaldraws)}
        </p>
      </div>
    </div>
  );
};

export default ConstructionDraw;
