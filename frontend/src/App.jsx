import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PropertyDetails from "./components/PropertyDetails";
import Home from "./components/Home";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import AuthForm from "./components/AuthForm";
import Contact from "./components/Contact";
import Faq from "./components/FAQ";
import Lender from "./components/Lender";
import Profile from "./components/Profile";
import PropertyList from "./components/PropertyList";
import AddProperty from "./components/AddProperty";
import ConstructionDraw from "./components/ConstructionDraw";
import Receipt from "./components/Receipt";
import ExcelStyleGrid from "./components/ExcelStyleGrid";
import ScraperControl from "./components/ScraperControl";
import { fetchUserProfile } from "./utils/fetchUserProfile";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const PropertyDetailsWrapper = () => {
    const { propertyId } = useParams(); // Access propertyId from the URL
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

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile auth={auth} />} />
            <Route
              path="/propertylist"
              element={<PropertyList auth={auth} />}
            />
            <Route path="/addproperty" element={<AddProperty auth={auth} />} />
            <Route
              path="/property/:propertyId"
              element={<PropertyDetailsWrapper auth={auth} />}
            />
            <Route
              path="/constructiondraw/:propertyId"
              element={<ConstructionDrawWrapper />}
            />
            <Route path="/excelstylegrid" element={<ExcelStyleGrid />} />
            <Route path="/receipts/:drawId" element={<ReceiptsWrapper />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/about" element={<About />} />
            <Route path="/authform" element={<AuthForm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/lender" element={<Lender />} />
            <Route path="/scraper-control" element={<ScraperControl />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
