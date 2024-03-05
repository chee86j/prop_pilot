/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";

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
  const [expandedReceipts, setReceiptsExpanded] = useState(false);

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
        // Sort receipts by Ascending date
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

  const toggleReceiptsExpansion = () => {
    setReceiptsExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div className="max-w-4xl mx-auto p-2 bg-transparent rounded-lg text-sm">
      <h1 className="text-lg md:text-md font-bold text-gray-700 mb-2">
        Receipts
      </h1>
      <button
        onClick={toggleReceiptsExpansion}
        className="cursor-pointer mb-2 transition-all bg-blue-500 text-white px-3 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[4px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
      >
        <span>
          {expandedReceipts ? (
            <ChevronsUp size={24} className="text-white" />
          ) : (
            <ChevronsDown size={24} className="text-white" />
          )}
        </span>
      </button>
      <div>
        {expandedReceipts && receipts.length > 0 ? (
          <table className="w-full table-auto mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  POC
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Card Used
                </th>
                <th className="px-4 py-2 text-center border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="text-gray-700 hover:bg-gray-100"
                >
                  <td className="border px-4 py-2 text-center">
                    {new Date(receipt.date).toLocaleDateString(undefined, {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td className="border px-4 py-2">{receipt.vendor}</td>
                  <td className="border px-4 py-2 text-center">
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
                  <td className="border px-4 py-2 text-center">
                    {receipt.pointofcontact}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    x{receipt.ccnumber}
                  </td>

                  <td className="px-4 py-2 border">
                    <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                      <button
                        onClick={() => startEdit(receipt)}
                        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
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
                        onClick={() => handleDeleteReceipt(receipt.id)}
                        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
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
              ))}
            </tbody>
          </table>
        ) : expandedReceipts && receipts.length < 1 ? (
          <p className="indent-2 text-lg text-red-500 my-3">
            No Receipts Added.
          </p>
        ) : null}

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
        <span className="text-white font-semibold ml-5 transform group-hover:translate-x-10 transition-all duration-300">
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
                setNewReceipt({ ...newReceipt, pointofcontact: e.target.value })
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
                setNewReceipt({ ...newReceipt, ccnumber: e.target.value })
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
