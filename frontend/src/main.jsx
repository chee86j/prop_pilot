import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializePerformanceMonitoring } from "./utils/performance";

// Initialize performance monitoring
initializePerformanceMonitoring();

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "✅ Service Worker registered successfully:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
