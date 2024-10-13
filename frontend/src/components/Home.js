import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Modeling Platform
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/model-profile" style={{ margin: '10px' }}>
        Create Model Profile
      </Button>
      <Button variant="contained" color="secondary" component={Link} to="/company-dashboard" style={{ margin: '10px' }}>
        Company Dashboard
      </Button>
    </Container>
  );
};

export default Home;
