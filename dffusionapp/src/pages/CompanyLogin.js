import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function CompanyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/company-dashboard'); // Redirect to homepage after login
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Company Login</Typography>
      <form onSubmit={handleLogin}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth
          style={{backgroundColor : 'black'}}
        >
          Login
        </Button>
      </form>

      {/* Link to Signup Page */}
      <Typography variant="body2" style={{ marginTop: '20px' }}>
        Don't have an account?
        <Link to="/signup/company" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" style = {{backgroundColor: 'black'}}>
            Sign Up
          </Button>
        </Link>
      </Typography>
    </Container>
  );
}

export default CompanyLogin;
