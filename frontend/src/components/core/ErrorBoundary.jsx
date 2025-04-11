/*
This file helps gracefully handle errors in React components to prevent crashes
*/
import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-4">
            Something went wrong!
          </h2>
          <details className="border p-3 bg-white rounded-md">
            <summary className="font-medium cursor-pointer">
              Show error details
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-red-600">
              {this.state.error && this.state.error.toString()}
            </pre>
            <div className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-40">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
