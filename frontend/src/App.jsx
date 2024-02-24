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

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAuth({
          isAuthenticated: true,
          user: data,
        });
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserProfile();
    }
  }, []);

  return (
    <Router>
      <Navbar auth={auth} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile auth={auth} />} />
        <Route path="/propertylist" element={<PropertyList auth={auth} />} />
        <Route path="/addproperty" element={<AddProperty auth={auth} />} />
        <Route
          path="/property/:propertyId"
          element={<PropertyDetailsWrapper auth={auth} />}
        />
        <Route
          path="/constructiondraw/:propertyId"
          element={<ConstructionDrawWrapper />}
        />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/about" element={<About />} />
        <Route path="/authform" element={<AuthForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/lender" element={<Lender />} />
      </Routes>
    </Router>
  );
}

export default App;
