import React from 'react';
import { Button } from '@mui/material';

const Payment = ({ modelId }) => {
  const handlePayment = () => {
    // Placeholder for payment logic
    alert(`Initiate payment to access contact info for model ID: ${modelId}`);
  };

  return (
    <Button variant="contained" color="primary" onClick={handlePayment}>
      Access Contact Info
    </Button>
  );
};

export default Payment;
