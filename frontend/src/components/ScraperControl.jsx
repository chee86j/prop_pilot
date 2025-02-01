import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScraperControl = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const runScraper = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/run-scraper",
        { autoConfirm: true }
      );

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
        toast.success(
          "Scraper ran successfully! Files saved to Downloads folder."
        );
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to run scraper";
      toast.error(`Error: ${errorMessage}`);
      console.error("Scraper error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const saveData = async () => {
    try {
      await axios.post("http://localhost:5000/api/save-data", data);
      toast.success("Data saved successfully!");
    } catch (error) {
      toast.error("Failed to save data.");
      console.error(error);
    }
  };

  return (
    <div className="scraper-control">
      <ToastContainer position="top-left" autoClose={5000} />
      <button
        onClick={runScraper}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? "Running..." : "Run Scraper"}
      </button>
      {data.length > 0 && (
        <div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Detail Link</th>
                <th className="py-2">Sheriff Number</th>
                <th className="py-2">Status Date</th>
                <th className="py-2">Plaintiff</th>
                <th className="py-2">Defendant</th>
                <th className="py-2">Address</th>
                <th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.detail_link}
                      onChange={(e) =>
                        handleInputChange(index, "detail_link", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.sheriff_number}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "sheriff_number",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.status_date}
                      onChange={(e) =>
                        handleInputChange(index, "status_date", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.plaintiff}
                      onChange={(e) =>
                        handleInputChange(index, "plaintiff", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.defendant}
                      onChange={(e) =>
                        handleInputChange(index, "defendant", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.address}
                      onChange={(e) =>
                        handleInputChange(index, "address", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        handleInputChange(index, "price", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={saveData}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Save Data
          </button>
        </div>
      )}
    </div>
  );
};

export default ScraperControl;
