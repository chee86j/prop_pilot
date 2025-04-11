import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { fetchUserProfile } from "./utils/fetchUserProfile";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Lazy load components
const PropertyDetails = lazy(() => import("./components/PropertyDetails"));
const Home = lazy(() => import("./components/Home"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const About = lazy(() => import("./components/About"));
const AuthForm = lazy(() => import("./components/AuthForm"));
const Contact = lazy(() => import("./components/Contact"));
const Faq = lazy(() => import("./components/FAQ"));
const Lender = lazy(() => import("./components/Lender"));
const Profile = lazy(() => import("./components/Profile"));
const PropertyList = lazy(() => import("./components/PropertyList"));
const AddProperty = lazy(() => import("./components/AddProperty"));
const ConstructionDraw = lazy(() => import("./components/ConstructionDraw"));
const Receipt = lazy(() => import("./components/Receipt"));

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserProfile().then((user) => {
        setAuth({
          isAuthenticated: true,
          user: user,
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
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile auth={auth} />} />
              <Route
                path="/propertylist"
                element={<PropertyList auth={auth} />}
              />
              <Route
                path="/addproperty"
                element={<AddProperty auth={auth} />}
              />
              <Route
                path="/property/:propertyId"
                element={<PropertyDetailsWrapper auth={auth} />}
              />
              <Route
                path="/constructiondraw/:propertyId"
                element={<ConstructionDrawWrapper />}
              />
              <Route path="/receipts/:drawId" element={<ReceiptsWrapper />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/about" element={<About />} />
              <Route path="/authform" element={<AuthForm />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/lender" element={<Lender />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
