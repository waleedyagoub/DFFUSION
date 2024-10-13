import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const CompanyDashboard = () => {
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Company Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/browse-models"
        style={{ margin: '10px' }}
      >
        Browse Models
      </Button>
      {/* Add more dashboard features as needed */}
    </Container>
  );
};

export default CompanyDashboard;
