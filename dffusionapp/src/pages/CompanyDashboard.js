// src/pages/CompanyDashboard.js

import React, { useState } from 'react';
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
  Checkbox,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

function CompanyDashboard() {
  const { currentUser } = useAuth();
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [location, setLocation] = useState('');
  const [heightMin, setHeightMin] = useState('');
  const [heightMax, setHeightMax] = useState('');
  const [selectedRaces, setSelectedRaces] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleRaceChange = (event) => {
    const { value } = event.target;
    setSelectedRaces(typeof value === 'string' ? value.split(',') : value);
  };

  const handleGenderChange = (event) => {
    const { value } = event.target;
    setSelectedGenders(typeof value === 'string' ? value.split(',') : value);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Input Validation
    if (
      !ageMin ||
      !ageMax ||
      !location ||
      !heightMin ||
      !heightMax ||
      selectedRaces.length === 0 ||
      selectedGenders.length === 0 ||
      !image
    ) {
      setError('Please fill in all fields and upload an image.');
      setLoading(false);
      return;
    }

    if (parseInt(ageMin) > parseInt(ageMax)) {
      setError('Minimum age cannot be greater than maximum age.');
      setLoading(false);
      return;
    }

    if (parseInt(heightMin) > parseInt(heightMax)) {
      setError('Minimum height cannot be greater than maximum height.');
      setLoading(false);
      return;
    }

    try {
      // Upload Image to Firebase Storage
      const imageRef = ref(
        storage,
        `company-matches/${currentUser.uid}/${Date.now()}_${image.name}`
      );
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Submit Data to firestore
      const matchesCollection = collection(db, 'companyMatches');
      await addDoc(matchesCollection, {
        companyId: currentUser.uid,
        age: {
          min: parseInt(ageMin),
          max: parseInt(ageMax),
        },
        location: location.trim(),
        height: {
          min: parseInt(heightMin),
          max: parseInt(heightMax),
        },
        races: selectedRaces,
        genders: selectedGenders,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Match criteria submitted successfully!');
      // Reset Form
      setAgeMin('');
      setAgeMax('');
      setLocation('');
      setHeightMin('');
      setHeightMax('');
      setSelectedRaces([]);
      setSelectedGenders([]);
      setImage(null);
    } catch (err) {
      console.error('Error submitting match criteria:', err);
      setError('Failed to submit match criteria. Please try again.');
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Company Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Submit your criteria to find suitable models.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Age Range */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Minimum Age"
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Maximum Age"
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Location */}
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Height Range */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Minimum Height (cm)"
              type="number"
              value={heightMin}
              onChange={(e) => setHeightMin(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Maximum Height (cm)"
              type="number"
              value={heightMax}
              onChange={(e) => setHeightMax(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Race Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="race-label">Race</InputLabel>
            <Select
              labelId="race-label"
              multiple
              value={selectedRaces}
              onChange={handleRaceChange}
              input={<OutlinedInput label="Race" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {races.map((race) => (
                <MenuItem key={race} value={race}>
                  <Checkbox checked={selectedRaces.indexOf(race) > -1} />
                  <ListItemText primary={race} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Gender Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              multiple
              value={selectedGenders}
              onChange={handleGenderChange}
              input={<OutlinedInput label="Gender" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  <Checkbox checked={selectedGenders.indexOf(gender) > -1} />
                  <ListItemText primary={gender} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Image Upload */}
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Button>
            {image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected File: {image.name}
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
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Criteria'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CompanyDashboard;

