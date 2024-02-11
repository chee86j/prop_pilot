import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyForm from './components/PropertyForm';
import Home from './components/Home';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Register from './components/Register';
import Contact from './components/Contact';
import Faq from './components/Faq';
import Lender from './components/Lender';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PropertyForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/about" element={<About />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/lender" element={<Lender />} />
            </Routes>
        </Router>
    );
}

export default App;
