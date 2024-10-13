// src/pages/ModelDashboard.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  //TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [raceFilter, setRaceFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  // Fetch models data from Firestore
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'models'));
        const modelsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setModels(modelsData);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load models. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const filteredModels = models.filter(model => {
    return (
      (!raceFilter || model.race === raceFilter) &&
      (!genderFilter || model.gender === genderFilter)
    );
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Model Gallery
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="race-filter-label">Race</InputLabel>
            <Select
              labelId="race-filter-label"
              value={raceFilter}
              onChange={(e) => setRaceFilter(e.target.value)}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {races.map((raceOption) => (
                <MenuItem key={raceOption} value={raceOption}>
                  {raceOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="gender-filter-label">Gender</InputLabel>
            <Select
              labelId="gender-filter-label"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {genders.map((genderOption) => (
                <MenuItem key={genderOption} value={genderOption}>
                  {genderOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Loading Spinner */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {filteredModels.map((model) => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={model.name}
                    height="140"
                    image={model.imageUrl} // Ensure this field exists in your Firestore data
                  />
                  <CardContent>
                    <Typography variant="h6">{model.name}</Typography>
                    <Typography color="text.secondary">
                      {model.race}, {model.gender}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Profile</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default ModelDashboard;
