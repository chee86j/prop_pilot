/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

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
  });

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
        setReceipts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReceipts();
  }, [drawId]);

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

  return (
    <div className="max-w-4xl mx-auto p-3 bg-transparent rounded-lg text-sm">
      <h1 className="text-xl md:text-xl font-bold text-gray-700 mb-6">
        Receipts
      </h1>
      {error && <div className="text-red-600">Error: {error}</div>}
      <div className="flex justify-center gap-6">
        {receipts.length > 0 ? (
          receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="receipt bg-gray-50 p-4 shadow-sm rounded-md"
              style={{ width: "100%" }}
            >
              {editReceiptId === receipt.id ? (
                <form onSubmit={saveEdit} className="flex flex-wrap gap-2">
                  <div className="flex flex-wrap w-full">
                    <div className="flex flex-wrap w-1/2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={editedReceipt.date}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div className="flex flex-wrap w-1/2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Vendor
                      </label>
                      <input
                        type="text"
                        name="vendor"
                        value={editedReceipt.vendor}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div className="flex flex-wrap w-full">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={editedReceipt.amount}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div className="flex flex-wrap w-full">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editedReceipt.description}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end w-full">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap w-full">
                  <div className="flex flex-wrap">
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        <strong>Date:</strong>{" "}
                        {new Date(receipt.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        <strong>Vendor:</strong> {receipt.vendor}
                      </p>
                    </div>
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        <strong>Amount:</strong> ${receipt.amount}
                      </p>
                    </div>
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <p className="mb-2">
                        <strong>Description:</strong> {receipt.description}
                      </p>
                    </div>

                    <div
                      style={{ display: "inline-block", marginRight: "10px" }}
                    >
                      <button
                        onClick={() => startEdit(receipt)}
                        className="mb-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded transition duration-300 ease-in-out"
                      >
                        Edit
                      </button>
                    </div>

                    <div style={{ display: "inline-block" }}>
                      <button
                        onClick={() => handleDeleteReceipt(receipt.id)}
                        className="mb-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition duration-300 ease-in-out"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No Receipts Found.</p>
        )}
      </div>

      <form onSubmit={handleAddReceipt} className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Add a Receipt
        </h3>
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Receipt
        </button>
      </form>
    </div>
  );
};

export default Receipt;
