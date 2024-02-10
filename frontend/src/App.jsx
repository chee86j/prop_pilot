import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyForm from './components/PropertyForm';
import PropertyDetails from './components/PropertyDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PropertyForm />} />
                <Route path="/property-details" element={<PropertyDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
