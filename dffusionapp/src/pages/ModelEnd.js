import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function ModelEnd() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for submitting your DFFUSION profile.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/profile-view"
          sx={{ mt: 2 }}
          style = {{backgroundColor: 'black'}}
        >
          View Your Profile
        </Button>
      </Box>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
         variant="contained"
         color="primary"
         component={Link}
         to="/"
         sx={{mt: 2}}
         style = {{backgroundColor: 'black'}}
         >
            Log Out
         </Button>
        </Box>
    </Container>
  );
}

export default ModelEnd;


