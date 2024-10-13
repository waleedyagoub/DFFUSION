// src/pages/ModelDashboard.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const races = [
  'Asian',
  'Black or African American',
  'Hispanic or Latino',
  'White',
  'Native American or Alaska Native',
  'Native Hawaiian or Other Pacific Islander',
  'Other',
];

const genders = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];

function ModelDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Added useNavigate hook

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [height, setHeight] = useState('');
  const [race, setRace] = useState('');
  const [gender, setGender] = useState('');
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing data if any
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const docRef = doc(db, 'models', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setAge(data.age || '');
          setPhoneNumber(data.phoneNumber || '');
          setLocation(data.location || '');
          setHeight(data.height || '');
          setRace(data.race || '');
          setGender(data.gender || '');
          // Resume URL is not fetched as we don't store it in state
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    console.log('current User in handleSubmit:', currentUser)
    // Input Validation
    if (!name || !age || !phoneNumber || !location || !height || !race || !gender) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
  
    if (parseInt(age) <= 0) {
      setError('Please enter a valid age.');
      setLoading(false);
      return;
    }
  
    if (parseInt(height) <= 0) {
      setError('Please enter a valid height.');
      setLoading(false);
      return;
    }
    if(!currentUser){
      setError('User not authenticated. Please log in.');
      setLoading(false);
      return
    }
    try {
      let resumeUrl = null;
  
      // Upload Resume to Firebase Storage if provided
      if (resume) {
        const resumeRef = ref(
          storage,
          `model-resumes/${currentUser.uid}/${Date.now()}_${resume.name}`
        );
        await uploadBytes(resumeRef, resume);
        resumeUrl = await getDownloadURL(resumeRef);
      }
  
      // Save Data to Firestore
      const modelDocRef = doc(db, 'models', currentUser.uid);
      await setDoc(modelDocRef, {
        name: name.trim(),
        age: parseInt(age),
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
        height: parseInt(height),
        race: race,
        gender: gender,
        resumeUrl: resumeUrl,
        updatedAt: new Date(),
      });
  
      // Redirect to ModelEnd page after successful submission
      navigate('/model-end');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update your profile. Please try again.');
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };
  

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Model Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Enter your details to complete your profile.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Name */}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Age */}
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            fullWidth
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          {/* Phone Number */}
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Location */}
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Height */}
          <TextField
            label="Height (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            fullWidth
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />

          {/* Race Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="race-label">Race</InputLabel>
            <Select
              labelId="race-label"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              input={<OutlinedInput label="Race" />}
            >
              {races.map((raceOption) => (
                <MenuItem key={raceOption} value={raceOption}>
                  {raceOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Gender Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              input={<OutlinedInput label="Gender" />}
            >
              {genders.map((genderOption) => (
                <MenuItem key={genderOption} value={genderOption}>
                  {genderOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Resume Upload */}
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" component="label" style ={{backgroundColor :'black'}}>
              Upload Resume (Optional)
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </Button>
            {resume && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected File: {resume.name}
              </Typography>
            )}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            style = {{backgroundColor: 'black'}}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ModelDashboard;
