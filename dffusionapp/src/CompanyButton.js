import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CompanyButton({ setShowButtons }) { // Receive the prop
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login/company'); // Navigate to the Company Login page
  };

  return (
    <Button 
      variant="contained" 
      sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgrey' } }} 
      onClick={handleClick}
    >
      Company
    </Button>
  );
}

export default CompanyButton;
