import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button, // Import Button
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function ProfileView() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'models', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          setError('No profile data found.');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(`Failed to fetch profile data. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Name:</strong> {profileData.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Age:</strong> {profileData.age}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Phone Number:</strong> {profileData.phoneNumber}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Location:</strong> {profileData.location}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Height:</strong> {profileData.height} cm
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Race:</strong> {profileData.race}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Gender:</strong> {profileData.gender}
        </Typography>
        {profileData.resumeUrl && (
          <Typography variant="body1" gutterBottom>
            <strong>Resume:</strong>{' '}
            <a href={profileData.resumeUrl} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </Typography>
        )}

        {/* Add the button here */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/model-end')}
            style = {{backgroundColor: 'black'}}
          >
            Back to Confirmation
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color = "primary"
              onClick = {() => navigate('/model-dashboard')}
              style= {{backgroundColor: 'black'}}
              >
                Edit Profile
              </Button>
            </Box>
      </Box>
    </Container>
  );
}

export default ProfileView;


