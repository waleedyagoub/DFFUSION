import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ModelButton({ setShowButtons }) { // Receive the prop
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login/model'); // Navigate to the Model Login page
  };

  return (
    <Button 
      variant="contained" 
      sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgrey' } }} 
      onClick={handleClick}
    >
      Model
    </Button>
  );
}

export default ModelButton;


