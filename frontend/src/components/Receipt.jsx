/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Settings, ChevronsLeft, ChevronsRight } from "lucide-react";

const Receipt = ({ drawId }) => {
  const [receipts, setReceipts] = useState([]);
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
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

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
        // Sort receipts by date in ascending order
        const sortedReceipts = data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setReceipts(sortedReceipts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReceipts();
  }, [drawId]);

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "";
    return parseFloat(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedReceipt({ ...editedReceipt, [name]: value });
  };

  const startEdit = (receipt) => {
    setEditReceiptId(receipt.id);
    setEditedReceipt({ ...receipt });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/receipts/${editReceiptId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(editedReceipt),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update receipt");
      }

      const updatedReceipt = await response.json();
      setReceipts(
        receipts.map((receipt) =>
          receipt.id === editReceiptId ? updatedReceipt : receipt
        )
      );
      setEditReceiptId(null);
      setEditedReceipt({});
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditReceiptId(null);
    setEditedReceipt({});
  };

  const handleAddReceipt = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ ...newReceipt, construction_draw_id: drawId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add receipt");
      }

      const addedReceipt = await response.json();
      setReceipts([...receipts, addedReceipt]);
      setNewReceipt({ date: "", vendor: "", amount: "", description: "" });
      setShowAddForm(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReceipt = async (receiptId) => {
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

      setReceipts(receipts.filter((receipt) => receipt.id !== receiptId));
    } catch (err) {
      setError(err.message);
    }
  };

  const calcSubtotal = () => {
    let subtotal = 0;
    receipts.forEach((receipt) => {
      subtotal += parseFloat(receipt.amount);
    });
    return subtotal.toFixed(2); // Format subtotal to two decimal places
  };

  const toggleDescriptionExpansion = (receiptId) => {
    setExpandedDescriptions((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(receiptId)) {
        newExpanded.delete(receiptId);
      } else {
        newExpanded.add(receiptId);
      }
      return newExpanded;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-2 bg-transparent rounded-lg text-sm">
      <h1 className="text-lg md:text-md font-bold text-gray-700 mb-2">
        Receipts
      </h1>
      {error && <div className="text-red-600">Error: {error}</div>}
      <div>
        {receipts.length > 0 ? (
          <table className="w-full table-auto mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  POC
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Card Used
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="text-gray-700">
                  <td className="border px-4 py-2">
                    {new Date(receipt.date).toLocaleDateString(undefined, {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td className="border px-4 py-2">{receipt.vendor}</td>
                  <td className="border px-4 py-2">
                    {formatCurrency(receipt.amount)}
                  </td>
                  <td className="border px-4 py-2">
                    {expandedDescriptions.has(receipt.id) ? (
                      <span>{receipt.description}</span>
                    ) : (
                      <span>
                        {receipt.description.length > 10
                          ? receipt.description.substring(0, 10) + "..."
                          : receipt.description}
                      </span>
                    )}
                    {receipt.description.length > 10 && (
                      <button
                        onClick={() => toggleDescriptionExpansion(receipt.id)}
                        className="text-blue-500 hover:underline focus:outline-none ml-2"
                      >
                        {expandedDescriptions.has(receipt.id) ? (
                          <>
                            <ChevronsLeft size={20} />
                            {/* <span>Read Less</span> */}
                          </>
                        ) : (
                          <>
                            {/* <span>Read More</span> */}
                            <ChevronsRight size={20} />
                          </>
                        )}
                      </button>
                    )}
                  </td>
                  <td className="border px-4 py-2">{receipt.pointofcontact}</td>
                  <td className="border px-4 py-2">x{receipt.ccnumber}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => startEdit(receipt)}
                      className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out"
                    >
                      <Settings size={24} className="text-black" />
                    </button>
                    <button
                      onClick={() => handleDeleteReceipt(receipt.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="indent-2 text-red-500">No Receipts Found.</p>
        )}
        {/* Display subtotal */}
        <div className="mb-4">
          <p className="indent-2 font-semibold text-gray-700">
            Subtotal: {formatCurrency(calcSubtotal())}
          </p>
        </div>
      </div>

      {/* Button to toggle visibility of add receipt form */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="rounded-lg relative w-32 h-10 cursor-pointer flex items-center border border-blue-500 bg-blue-500 group hover:bg-blue-500 active:bg-blue-500 active:border-blue-500"
      >
        <span className="text-gray-200 font-semibold ml-5 transform group-hover:translate-x-10 transition-all duration-300">
          Receipt
        </span>
        <span className="absolute right-0 h-full w-12 rounded-lg bg-blue-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
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

      {/* Add receipt form */}
      {showAddForm && (
        <form onSubmit={handleAddReceipt} className="mt-6">
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
                className="border rounded px-2 py-1 w-full"
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
                className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={newReceipt.amount}
                onChange={(e) =>
                  setNewReceipt({ ...newReceipt, amount: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={newReceipt.description}
              onChange={(e) =>
                setNewReceipt({ ...newReceipt, description: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Point of Contact
            </label>
            <textarea
              name="pointofcontact"
              value={newReceipt.pointofcontact}
              onChange={(e) =>
                setNewReceipt({ ...newReceipt, description: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Credit Card Used
            </label>
            <textarea
              name="ccnumber"
              value={newReceipt.ccnumber}
              onChange={(e) =>
                setNewReceipt({ ...newReceipt, description: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Receipt
          </button>
        </form>
      )}

      {editReceiptId && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Edit Receipt
          </h3>
          <form onSubmit={saveEdit} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={editedReceipt.date}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
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
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={editedReceipt.amount}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1 w-full"
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
                className="border rounded px-2 py-1 w-full"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Point of Contact
              </label>
              <textarea
                name="pointofcontact"
                value={editedReceipt.pointofcontact}
                onChange={handleEditChange}
                className="border rounded px-2 py-1 w-full"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Credit Card Used
              </label>
              <textarea
                name="description"
                value={editedReceipt.ccnumber}
                onChange={handleEditChange}
                className="border rounded px-2 py-1 w-full"
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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
