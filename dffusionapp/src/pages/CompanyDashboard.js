import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
//import { useAuth } from '../AuthContext';
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

function CompanyDashboard() {
 //const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [error, setError] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [heightMin, setHeightMin] = useState('');
  const [heightMax, setHeightMax] = useState('');
  const [selectedRaces, setSelectedRaces] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoadingMatches(true);
      try {
        const snapshot = await getDocs(collection(db, 'companyMatches'));
        const matchesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMatches(matchesData);
        setFilteredMatches(matchesData); // Initialize with all matches
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches.');
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, []);

  const handleFilter = () => {
    let filtered = matches;

    if (ageMin || ageMax) {
      filtered = filtered.filter(match => {
        const age = match.age.min;
        return (
          (ageMin ? age >= parseInt(ageMin) : true) &&
          (ageMax ? age <= parseInt(ageMax) : true)
        );
      });
    }

    if (heightMin || heightMax) {
      filtered = filtered.filter(match => {
        const height = match.height.min;
        return (
          (heightMin ? height >= parseInt(heightMin) : true) &&
          (heightMax ? height <= parseInt(heightMax) : true)
        );
      });
    }

    if (selectedRaces.length > 0) {
      filtered = filtered.filter(match => 
        selectedRaces.includes(match.race)
      );
    }

    if (selectedGenders.length > 0) {
      filtered = filtered.filter(match => 
        selectedGenders.includes(match.gender)
      );
    }

    setFilteredMatches(filtered);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          View Matches
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Filters</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Min Age"
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              fullWidth
            />
            <TextField
              label="Max Age"
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Min Height (cm)"
              type="number"
              value={heightMin}
              onChange={(e) => setHeightMin(e.target.value)}
              fullWidth
            />
            <TextField
              label="Max Height (cm)"
              type="number"
              value={heightMax}
              onChange={(e) => setHeightMax(e.target.value)}
              fullWidth
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="race-label">Race</InputLabel>
            <Select
              labelId="race-label"
              multiple
              value={selectedRaces}
              onChange={(e) => setSelectedRaces(e.target.value)}
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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              multiple
              value={selectedGenders}
              onChange={(e) => setSelectedGenders(e.target.value)}
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

          <Button variant="contained" onClick={handleFilter} style = {{backgroundColor: 'black'}}>
            Apply Filters
          </Button>
        </Box>

        {loadingMatches ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <Grid item xs={12} sm={6} md={4} key={match.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt="Match Image"
                      height="200"
                      image={match.imageUrl}
                    />
                    <CardContent>
                      <Typography variant="h6">
                        Age: {match.age.min} - {match.age.max}
                      </Typography>
                      <Typography variant="body2">Location: {match.location}</Typography>
                      <Typography variant="body2">Height: {match.height.min} - {match.height.max} cm</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2">No matches found.</Typography>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default CompanyDashboard;
