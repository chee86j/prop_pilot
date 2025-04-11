import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { fetchUserProfile } from "./utils/user";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/core/ErrorBoundary";
import PropertyListFallback from "./components/core/PropertyListFallback";

// Only try to import PropertyList dynamically if it exists, otherwise use the fallback
let PropertyList = PropertyListFallback; // Default to fallback

// Helper function for lazy loading components with better error handling
const lazyWithRetry = (componentImport) => {
  return lazy(() => {
    const handleError = (error) => {
      // Log error but don't retry immediately to avoid infinite loops
      console.error(`Error loading component: ${error}`);

      // Return a custom error component
      return import("./components/core/ErrorFallback").catch(() => {
        // If even the error fallback fails, return a minimal component
        return {
          default: () => (
            <div className="p-4 bg-red-50 rounded-lg text-red-700">
              Failed to load component. Please refresh the page.
            </div>
          ),
        };
      });
    };

    return componentImport().catch(handleError);
  });
};

// Lazy load components with retry and better error handling
const PropertyDetails = lazyWithRetry(() =>
  import("./components/PropertyDetails")
);
const Home = lazyWithRetry(() => import("./components/Home"));
const Testimonials = lazyWithRetry(() => import("./components/Testimonials"));
const About = lazyWithRetry(() => import("./components/About"));
const AuthForm = lazyWithRetry(() => import("./components/AuthForm"));
const Contact = lazyWithRetry(() => import("./components/Contact"));
const Faq = lazyWithRetry(() => import("./components/FAQ"));
const Lender = lazyWithRetry(() => import("./components/Lender"));
const Profile = lazyWithRetry(() => import("./components/Profile"));
const AddProperty = lazyWithRetry(() => import("./components/AddProperty"));
const ConstructionDraw = lazyWithRetry(() =>
  import("./components/ConstructionDraw")
);
const Receipt = lazyWithRetry(() => import("./components/Receipt"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [propertyListLoaded, setPropertyListLoaded] = useState(false);

  const PropertyDetailsWrapper = () => {
    const { propertyId } = useParams();
    return <PropertyDetails propertyId={propertyId} auth={auth} />;
  };

  const ConstructionDrawWrapper = () => {
    const { propertyId } = useParams();
    return <ConstructionDraw propertyId={propertyId} auth={auth} />;
  };

  const ReceiptsWrapper = () => {
    const { drawId } = useParams();
    return <Receipt drawId={drawId} auth={auth} />;
  };

  // Load PropertyList component and manage auth
  useEffect(() => {
    // Try to load PropertyList component
    import("./components/PropertyList")
      .then((module) => {
        PropertyList = module.default;
        setPropertyListLoaded(true);
        console.log("PropertyList component loaded successfully");
      })
      .catch((error) => {
        console.error("Failed to import PropertyList component:", error);
        setPropertyListLoaded(true); // Set to true anyway so we use the fallback
      });

    // Check authentication
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserProfile()
        .then((user) => {
          setAuth({
            isAuthenticated: true,
            user: user,
          });
        })
        .catch(() => {
          // Handle authentication error silently
          localStorage.removeItem("accessToken");
          setAuth({
            isAuthenticated: false,
            user: null,
          });
        });
    }
  }, []);

  // Get the Google Client ID from environment variables
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error(
      "Google Client ID is not configured. Please check your .env file."
    );
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div>
          <Navbar auth={auth} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            limit={3}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
            containerId="root-toast"
          />
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile auth={auth} />} />
                <Route
                  path="/propertylist"
                  element={
                    <ErrorBoundary>
                      {propertyListLoaded ? (
                        <PropertyList auth={auth} />
                      ) : (
                        <LoadingFallback />
                      )}
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/addproperty"
                  element={
                    <ErrorBoundary>
                      <AddProperty auth={auth} />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/property/:propertyId"
                  element={
                    <ErrorBoundary>
                      <PropertyDetailsWrapper auth={auth} />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/constructiondraw/:propertyId"
                  element={
                    <ErrorBoundary>
                      <ConstructionDrawWrapper />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/receipts/:drawId"
                  element={
                    <ErrorBoundary>
                      <ReceiptsWrapper />
                    </ErrorBoundary>
                  }
                />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/about" element={<About />} />
                <Route path="/authform" element={<AuthForm />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/lender" element={<Lender />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
