import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyForm from './components/PropertyForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PropertyForm />} />
            </Routes>
        </Router>
    );
}

export default App;
