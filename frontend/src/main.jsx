import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializePerformanceMonitoring } from "./utils/performance";

// Initialize performance monitoring
initializePerformanceMonitoring();

// The service worker is a production optimization. Keeping it active during
// development can serve stale Vite assets and obscure useful network errors.
if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
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
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
