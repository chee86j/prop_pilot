/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { formatCurrencyDetailed } from "../utils/format";
import {
  ChevronsDown,
  ChevronsUp,
  CreditCard,
  Edit,
  Trash2,
  Plus,
  Info,
  Printer,
  X,
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
    <div className="py-3">
      <div className="flex flex-wrap items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-700 mb-2 sm:mb-0">
          Receipts & Documentation
        </h3>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
            aria-label="Add receipt"
          >
            <Plus size={16} />
            <span>Add Receipt</span>
          </button>
          <button
            onClick={toggleReceiptsExpansion}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm"
            aria-label={
              expandedReceipts ? "Collapse receipts" : "Expand receipts"
            }
          >
            {expandedReceipts ? (
              <>
                <ChevronsUp size={16} />{" "}
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <ChevronsDown size={16} />{" "}
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Show add form */}
      {showAddForm && (
        <form
          onSubmit={handleAddReceipt}
          className="my-4 p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <h4 className="font-semibold text-gray-700 mb-3">Add New Receipt</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receipt-date"
              >
                Date
              </label>
              <input
                id="receipt-date"
                type="date"
                name="date"
                value={newReceipt.date}
                onChange={(e) =>
                  setNewReceipt({ ...newReceipt, date: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receipt-vendor"
              >
                Vendor
              </label>
              <input
                id="receipt-vendor"
                type="text"
                name="vendor"
                placeholder="Vendor name"
                value={newReceipt.vendor}
                onChange={(e) =>
                  setNewReceipt({ ...newReceipt, vendor: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receipt-amount"
              >
                Amount
              </label>
              <input
                id="receipt-amount"
                type="number"
                name="amount"
                placeholder="0.00"
                value={newReceipt.amount}
                onChange={(e) =>
                  setNewReceipt({ ...newReceipt, amount: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receipt-description"
              >
                Description
              </label>
              <input
                id="receipt-description"
                type="text"
                name="description"
                placeholder="Description"
                value={newReceipt.description}
                onChange={(e) =>
                  setNewReceipt({
                    ...newReceipt,
                    description: e.target.value,
                  })
                }
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receipt-contact"
              >
                Point of Contact
              </label>
              <input
                id="receipt-contact"
                type="text"
                name="pointofcontact"
                placeholder="Contact name"
                value={newReceipt.pointofcontact}
                onChange={(e) =>
                  setNewReceipt({
                    ...newReceipt,
                    pointofcontact: e.target.value,
                  })
                }
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receipt-ccnumber"
              >
                CC Number (Last 4)
              </label>
              <input
                id="receipt-ccnumber"
                type="text"
                name="ccnumber"
                placeholder="XXXX"
                value={newReceipt.ccnumber}
                onChange={(e) =>
                  setNewReceipt({ ...newReceipt, ccnumber: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="4"
                pattern="[0-9]{4}"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Saving..." : "Add Receipt"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Receipt selection and details */}
      {selectedReceipt && (
        <div className="my-4 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-800">Receipt Details</h3>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{formatDate(selectedReceipt.date)}</p>
            </div>
            <div>
              <p className="text-gray-500">Vendor</p>
              <p className="font-medium">{selectedReceipt.vendor}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">
                {formatCurrencyDetailed(selectedReceipt.amount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Description</p>
              <p className="font-medium">
                {selectedReceipt.description || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Point of Contact</p>
              <p className="font-medium">
                {selectedReceipt.pointofcontact || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">CC Number</p>
              <p className="font-medium">
                {selectedReceipt.ccnumber
                  ? `xxxx-xxxx-xxxx-${selectedReceipt.ccnumber}`
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => startEdit(selectedReceipt)}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={() => handleDeleteReceipt(selectedReceipt.id)}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Edit form */}
      {editReceiptId && (
        <form
          onSubmit={saveEdit}
          className="my-4 p-4 bg-gray-50 rounded-lg shadow-sm"
        >
          <h4 className="font-semibold text-gray-700 mb-3">Edit Receipt</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="edit-date"
              >
                Date
              </label>
              <input
                id="edit-date"
                type="date"
                name="date"
                value={editedReceipt.date}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="edit-vendor"
              >
                Vendor
              </label>
              <input
                id="edit-vendor"
                type="text"
                name="vendor"
                value={editedReceipt.vendor}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="edit-amount"
              >
                Amount
              </label>
              <input
                id="edit-amount"
                type="number"
                name="amount"
                value={editedReceipt.amount}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="edit-description"
              >
                Description
              </label>
              <input
                id="edit-description"
                type="text"
                name="description"
                value={editedReceipt.description}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="edit-contact"
              >
                Point of Contact
              </label>
              <input
                id="edit-contact"
                type="text"
                name="pointofcontact"
                value={editedReceipt.pointofcontact}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-2 sm:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="edit-ccnumber"
              >
                CC Number (Last 4)
              </label>
              <input
                id="edit-ccnumber"
                type="text"
                name="ccnumber"
                value={editedReceipt.ccnumber}
                onChange={handleEditChange}
                className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="4"
                pattern="[0-9]{4}"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditReceiptId(null);
                setEditedReceipt({});
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Receipt list */}
      {!isLoading && receipts.length > 0 ? (
        <div
          className={`mt-3 ${
            expandedReceipts ? "block" : "max-h-60 overflow-hidden"
          }`}
        >
          {/* Mobile view */}
          <div className="block sm:hidden space-y-3">
            {receipts.map((receipt) => (
              <div
                key={`mobile-receipt-${receipt.id}`}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => viewReceiptDetails(receipt)}
              >
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
                  <span className="font-medium text-gray-800">
                    {receipt.vendor}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrencyDetailed(receipt.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formatDate(receipt.date)}
                  </span>
                  <div className="flex items-center gap-1">
                    {receipt.ccnumber && (
                      <CreditCard size={14} className="text-gray-400" />
                    )}
                    <span className="text-gray-500">{receipt.description}</span>
                  </div>
                </div>
              </div>
            ))}

            {!expandedReceipts && receipts.length > 2 && (
              <button
                onClick={toggleReceiptsExpansion}
                className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-800"
              >
                Show all {receipts.length} receipts
              </button>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full table-auto bg-white">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-700 uppercase">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Vendor</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-sm">
                      {formatDate(receipt.date)}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      {receipt.vendor}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-semibold">
                      {formatCurrencyDetailed(receipt.amount)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 truncate max-w-[200px]">
                      {receipt.description || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => viewReceiptDetails(receipt)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          aria-label="View receipt details"
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={() => startEdit(receipt)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          aria-label="Edit receipt"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReceipt(receipt.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          aria-label="Delete receipt"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal section */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
            <span className="font-semibold text-gray-700">Subtotal:</span>
            <span className="font-bold text-blue-600">
              {formatCurrencyDetailed(calcSubtotal())}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg my-3">
          {isLoading ? (
            <p className="text-gray-500">Loading receipts...</p>
          ) : (
            <p className="text-gray-500">
              No receipts found. Add one to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Receipt;
