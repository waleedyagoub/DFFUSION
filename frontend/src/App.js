import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Home from './components/Home';
import ModelProfile from './components/ModelProfile';
import CompanyDashboard from './components/CompanyDashboard';
import BrowseModels from './components/BrowseModels';
import { Button, TextField } from '@mui/material';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/model-profile" element={<ModelProfile />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/browse-models" element={<BrowseModels />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
