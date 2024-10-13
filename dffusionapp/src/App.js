import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelSignup from './pages/ModelSignup';
import CompanySignup from './pages/CompanySignup';
import ModelDashboard from './pages/ModelDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import ModelLogin from './pages/ModelLogin';
import PrivateRoute from './PrivateRoute';
import CompanyButton from './CompanyButton';
import ModelButton from './ModelButton';
import CompanyLogin from './pages/CompanyLogin';
import ModelEnd from './pages/ModelEnd';
import ProfileView from './pages/ProfileView';
import { Container, Typography, Box } from '@mui/material';

// Component to manage button visibility based on current location
function ButtonVisibility() {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // Check if the current path is the homepage
  const isSignupPage = location.pathname === '/signup/company'; // Check for CompanySignup

  return (
    <>
      {(isHomePage || isSignupPage) && ( // Render buttons on homepage and signup page
        <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
          <CompanyButton />
          <ModelButton />
        </Box>
      )}
    </>
  );
}


function App() {
  return (
    <Router>
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h4" gutterBottom>
          DFFUSION
        </Typography>

        {/* Render ButtonVisibility to manage button rendering */}
        <ButtonVisibility />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login/model" element={<ModelLogin />} />
          <Route path="/login/company" element={<CompanyLogin />} />
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
          path="/model-dashboard"
          element={
            <PrivateRoute>
              <ModelDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/model-end"
          element={
            <PrivateRoute>
              <ModelEnd />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-view"
          element={
            <PrivateRoute>
              <ProfileView />
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
          <Route
            path="/model-end"
            element={
              <PrivateRoute>
                <ModelEnd />
              </PrivateRoute>
            }
            />
          {/* Add more routes as needed */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
