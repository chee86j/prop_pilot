/*
Provides a falback UI when the property list fails to load
*/
import { Link } from "react-router-dom";

const PropertyListFallback = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Property List Temporarily Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;re experiencing some technical difficulties loading the
            property list. Please try one of the options below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Link
              to="/home"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Return to Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
            <Link
              to="/addproperty"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors md:col-span-2"
            >
              Add New Property
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListFallback;
