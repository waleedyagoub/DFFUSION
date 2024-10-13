import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

function ModelLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(''); // Added error state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setLoading(true); // Start loading

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/model-dashboard'); // Redirect to dashboard after login
    } catch (error) {
      console.error(error.message);
      setError('Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Model Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
              mb: 2, // Added margin bottom for spacing
            }}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        {/* Link to Signup Page */}
        <Typography variant="body2" align="center">
          Don't have an account?
          <Link to="/signup/model" style={{ textDecoration: 'none' }}>
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
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default ModelLogin;

