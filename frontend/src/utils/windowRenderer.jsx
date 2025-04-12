import React from "react";
import { createRoot } from "react-dom/client";
import DSCRCalculator from "../components/RealEstateTools/DSCRCalculator";
import AmortizationCalculator from "../components/RealEstateTools/AmortizationCalculator";
import RehabEstimator from "../components/RealEstateTools/RehabEstimator";

/**
 * Renders the DSCR Calculator component in an external window
 * @param {Window} targetWindow - The window object where the calculator will be rendered
 */
export const renderDSCRCalculatorInWindow = (targetWindow) => {
  // Create a container for the React app
  const container = targetWindow.document.getElementById("root");

  // Create a custom close handler
  const handleClose = () => {
    targetWindow.close();
  };

  // Create a root and render the DSCRCalculator component
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <DSCRCalculator
        isOpen={true}
        onClose={handleClose}
        isExternalWindow={true}
      />
    </React.StrictMode>
  );

  // Set window title
  targetWindow.document.title = "DSCR Calculator - Prop Pilot";
};

/**
 * Renders the Amortization Calculator component in an external window
 * @param {Window} targetWindow - The window object where the calculator will be rendered
 */
export const renderAmortizationCalculatorInWindow = (targetWindow) => {
  // Create a container for the React app
  const container = targetWindow.document.getElementById("root");

  // Create a custom close handler
  const handleClose = () => {
    targetWindow.close();
  };

  // Create a root and render the AmortizationCalculator component
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AmortizationCalculator
        isOpen={true}
        onClose={handleClose}
        isExternalWindow={true}
      />
    </React.StrictMode>
  );

  // Set window title
  targetWindow.document.title = "Amortization Calculator - Prop Pilot";
};

/**
 * Renders the Rehab Estimator component in an external window
 * @param {Window} targetWindow - The window object where the estimator will be rendered
 */
export const renderRehabEstimatorInWindow = (targetWindow) => {
  // Create a container for the React app
  const container = targetWindow.document.getElementById("root");

  // Create a custom close handler
  const handleClose = () => {
    targetWindow.close();
  };

  // Create a root and render the RehabEstimator component
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <RehabEstimator
        isOpen={true}
        onClose={handleClose}
        isExternalWindow={true}
      />
    </React.StrictMode>
  );

  // Set window title
  targetWindow.document.title = "Rehab Cost Estimator - Prop Pilot";
};
