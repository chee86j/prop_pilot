import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import PropertyForm from "./components/PropertyForm";
import Home from "./components/Home";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import AuthForm from "./components/AuthForm";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Lender from "./components/Lender";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/propertyform" element={<PropertyForm />} />
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
