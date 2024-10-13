import React, { useState } from 'react';
import { auth } from '../firebase'; // Ensure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography} from '@mui/material';
import { Link } from 'react-router-dom';

function ModelSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login/model'); // Redirect to login after signup
    } catch (error) {
      setError(error.message); // Set the error message to display
    }
  };

  return (
    <Container>
      <Typography variant="h4">Model Sign Up</Typography>
      <form onSubmit={handleSignup}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                },
                mt: 1, // Added margin top for spacing
              }}
              fullWidth
            >
              Sign Up
            </Button>
      </form>

      {/* Error message display */}
      {error && (
        <Typography color="error" style={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}

      {/* Link to Login Page */}
      <Typography variant="body2" style={{ marginTop: '20px' }}>
        Already have an account?
        <Link to="/login/model" style={{ textDecoration: 'none' }}>
        <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333',
                },
                mt: 1, // Added margin top for spacing
              }}
              fullWidth
            >
              Log In
            </Button>
        </Link>
      </Typography>
    </Container>
  );
}

export default ModelSignup;
