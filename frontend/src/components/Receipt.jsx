/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { formatCurrencyDetailed } from "../utils/formatting";
import {
  ChevronsDown,
  ChevronsUp,
  CreditCard,
  Edit,
  Trash2,
  Plus,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Receipt = ({ drawId, onReceiptChange }) => {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editReceiptId, setEditReceiptId] = useState(null);
  const [editedReceipt, setEditedReceipt] = useState({});
  const [newReceipt, setNewReceipt] = useState({
    date: "",
    vendor: "",
    amount: "",
    description: "",
    pointofcontact: "",
    ccnumber: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedReceipts, setReceiptsExpanded] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    const toastConfig = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      containerId: "root-toast",
    };

    if (type === "success") {
      toast.success(message, toastConfig);
    } else if (type === "error") {
      toast.error(message, toastConfig);
    }
  }, []);

  const fetchReceipts = useCallback(async () => {
    setIsLoading(true);
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
      // Sort by date in descending order (newest first)
      const sortedReceipts = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setReceipts(sortedReceipts);
    } catch (err) {
      setError(err.message);
      showToast("Failed to fetch receipts", "error");
    } finally {
      setIsLoading(false);
    }
  }, [drawId, showToast]);

  useEffect(() => {
    let mounted = true;

    if (drawId && mounted) {
      fetchReceipts();
    }

    return () => {
      mounted = false;
    };
  }, [drawId, fetchReceipts]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (receipt) => {
    setEditReceiptId(receipt.id);
    setEditedReceipt({ ...receipt });
    setSelectedReceipt(null);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Format the date properly
      const formattedDate = new Date(editedReceipt.date)
        .toISOString()
        .split("T")[0];

      const requestData = {
        ...editedReceipt,
        date: formattedDate,
        amount: parseFloat(editedReceipt.amount),
        construction_draw_id: drawId,
      };

      const response = await fetch(
        `http://localhost:5000/api/receipts/${editReceiptId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update receipt");
      }

      await fetchReceipts();
      setEditReceiptId(null);
      setEditedReceipt({});
      showToast("Receipt updated successfully");
      // Notify parent component of the change
      if (onReceiptChange) {
        onReceiptChange();
      }
    } catch (err) {
      setError(err.message);
      showToast("Failed to update receipt", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReceipt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!newReceipt.date) {
        throw new Error("Date is required");
      }
      if (!newReceipt.vendor) {
        throw new Error("Vendor is required");
      }
      if (!newReceipt.amount || parseFloat(newReceipt.amount) <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      if (!drawId) {
        throw new Error("Construction draw ID is missing");
      }

      // Format the date to ISO format - only the date part
      const formattedDate = new Date(newReceipt.date)
        .toISOString()
        .split("T")[0];
      const amount = parseFloat(newReceipt.amount);

      const response = await fetch("http://localhost:5000/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...newReceipt,
          date: formattedDate,
          construction_draw_id: drawId,
          amount: amount,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add receipt");
      }

      await fetchReceipts();
      setNewReceipt({
        date: "",
        vendor: "",
        amount: "",
        description: "",
        pointofcontact: "",
        ccnumber: "",
      });
      setShowAddForm(false);
      showToast("Receipt added successfully");
      // Notify parent component of the change
      if (onReceiptChange) {
        onReceiptChange();
      }
    } catch (err) {
      console.error("Error adding receipt:", err);
      setError(err.message);
      showToast("Failed to add receipt: " + err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReceipt = async (receiptId) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/receipts/${receiptId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete receipt");
      }

      await fetchReceipts();
      showToast("Receipt deleted successfully");
      // Notify parent component of the change
      if (onReceiptChange) {
        onReceiptChange();
      }
      setSelectedReceipt(null);
    } catch (err) {
      setError(err.message);
      showToast("Failed to delete receipt", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calcSubtotal = () => {
    if (!Array.isArray(receipts) || receipts.length === 0) return 0;
    return receipts
      .reduce((sum, receipt) => sum + parseFloat(receipt.amount || 0), 0)
      .toFixed(2);
  };

  const toggleReceiptsExpansion = () => {
    setReceiptsExpanded((prevExpanded) => !prevExpanded);
    setSelectedReceipt(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const viewReceiptDetails = (receipt) => {
    setSelectedReceipt(receipt);
    setEditReceiptId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && (!Array.isArray(receipts) || receipts.length === 0)) {
    return (
      <div className="text-red-500 p-4">Error loading receipts: {error}</div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">Recent transactions</span>
          {isSubmitting && (
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleReceiptsExpansion}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            title={expandedReceipts ? "Collapse" : "Expand"}
          >
            {expandedReceipts ? (
              <ChevronsUp size={20} />
            ) : (
              <ChevronsDown size={20} />
            )}
          </button>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedReceipt(null);
              setEditReceiptId(null);
            }}
            className="p-1.5 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
            title="Add Receipt"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Banking-style receipt list */}
      {expandedReceipts && (
        <div className="divide-y divide-gray-100">
          {receipts.length > 0 ? (
            receipts.map((receipt) => (
              <div
                key={receipt.id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                  selectedReceipt?.id === receipt.id ? "bg-blue-50" : ""
                }`}
                onClick={() => viewReceiptDetails(receipt)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-600 min-w-16 text-center">
                      {formatDate(receipt.date)}
                    </div>
                    <div className="text-gray-800 font-medium">
                      {receipt.vendor}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-800 font-semibold">
                      {formatCurrencyDetailed(receipt.amount)}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(receipt);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReceipt(receipt.id);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex justify-between items-center text-sm">
                  <div className="text-gray-500 truncate max-w-xs">
                    {receipt.description || "No description"}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <CreditCard size={14} className="mr-1" />
                    <span>••{receipt.ccnumber || "XXXX"}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      )}

      {/* Receipt details panel - shown when a receipt is selected */}
      {selectedReceipt && expandedReceipts && (
        <div className="p-5 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {formatCurrencyDetailed(selectedReceipt.amount)}
            </h3>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-700">
              {selectedReceipt.vendor}
            </h4>
            <p className="text-gray-500">
              {new Date(selectedReceipt.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" at "}
              {new Date(selectedReceipt.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Payment method</p>
              <p className="font-medium flex items-center">
                <CreditCard size={16} className="mr-2" />
                {selectedReceipt.ccnumber
                  ? `Card ••${selectedReceipt.ccnumber}`
                  : "Card (no number provided)"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Point of contact</p>
              <p className="font-medium">
                {selectedReceipt.pointofcontact || "None"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedReceipt.description || "No description provided"}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => startEdit(selectedReceipt)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
            >
              <Edit size={16} className="mr-1" /> Edit
            </button>
            <button
              onClick={() => handleDeleteReceipt(selectedReceipt.id)}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center"
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Subtotal information - always visible */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="font-semibold text-gray-700 flex justify-between">
          <span>Total Receipts:</span>
          <span>{formatCurrencyDetailed(calcSubtotal())}</span>
        </div>
      </div>

      {/* Add receipt form */}
      {showAddForm && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add Receipt</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddReceipt}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newReceipt.date}
                  onChange={(e) =>
                    setNewReceipt({ ...newReceipt, date: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Vendor
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={newReceipt.vendor}
                  onChange={(e) =>
                    setNewReceipt({ ...newReceipt, vendor: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={newReceipt.amount}
                  onChange={(e) =>
                    setNewReceipt({ ...newReceipt, amount: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newReceipt.description}
                onChange={(e) =>
                  setNewReceipt({ ...newReceipt, description: e.target.value })
                }
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Point of Contact
                </label>
                <input
                  type="text"
                  name="pointofcontact"
                  value={newReceipt.pointofcontact}
                  onChange={(e) =>
                    setNewReceipt({
                      ...newReceipt,
                      pointofcontact: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Card Number (last 4 digits)
                </label>
                <input
                  type="text"
                  maxLength="4"
                  name="ccnumber"
                  value={newReceipt.ccnumber}
                  onChange={(e) =>
                    setNewReceipt({ ...newReceipt, ccnumber: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="XXXX"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
              ) : (
                <Plus size={16} className="mr-1" />
              )}
              Add Receipt
            </button>
          </form>
        </div>
      )}

      {/* Edit receipt form */}
      {editReceiptId && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Edit Receipt
            </h3>
            <button
              onClick={() => setEditReceiptId(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={saveEdit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={editedReceipt.date}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Vendor
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={editedReceipt.vendor}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={editedReceipt.amount}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={editedReceipt.description}
                onChange={handleEditChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Point of Contact
                </label>
                <input
                  type="text"
                  name="pointofcontact"
                  value={editedReceipt.pointofcontact}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Card Number (last 4 digits)
                </label>
                <input
                  type="text"
                  maxLength="4"
                  name="ccnumber"
                  value={editedReceipt.ccnumber}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="XXXX"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                ) : (
                  <Edit size={16} className="mr-1" />
                )}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditReceiptId(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Receipt;
