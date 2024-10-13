// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelSignup from './pages/ModelSignup';
import CompanySignup from './pages/CompanySignup';
import ModelDashboard from './pages/ModelDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './PrivateRoute'; // Ensure PrivateRoute.js exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/model" element={<ModelSignup />} />
        <Route path="/signup/company" element={<CompanySignup />} />
        <Route
          path="/model-dashboard"
          element={
            <PrivateRoute>
              <ModelDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/company-dashboard"
          element={
            <PrivateRoute>
              <CompanyDashboard />
            </PrivateRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
