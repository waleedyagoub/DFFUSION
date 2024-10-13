import React, { useEffect, useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import { Auth, API, Storage } from 'aws-amplify';
import { listModels } from '../graphql/queries';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Payment from './Payment.js';

const BrowseModels = () => {
  const [models, setModels] = useState([]);
  const [filters, setFilters] = useState({
    gender: '',
    ageRange: [0, 100],
    heightRange: [0, 300],
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const modelData = await API.graphql({ query: listModels });
      let modelsList = modelData.data.listModels.items;

      // Fetch image URLs
      for (let model of modelsList) {
        if (model.images && model.images.length > 0) {
          const imageKey = model.images[0];
          model.imageURL = await Storage.get(imageKey);
        }
      }

      setModels(modelsList);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    // Implement filtering logic based on filters state
    // For simplicity, we can filter models in the render method
  };

  const filteredModels = models.filter(model => {
    const withinGender = filters.gender ? model.gender === filters.gender : true;
    const withinAge = model.age >= filters.ageRange[0] && model.age <= filters.ageRange[1];
    const withinHeight = model.height >= filters.heightRange[0] && model.height <= filters.heightRange[1];
    return withinGender && withinAge && withinHeight;
  });

  return (
    <div>
      <Grid container spacing={3} style={{ padding: '20px' }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography id="age-range-slider" gutterBottom>
            Age Range
          </Typography>
          {/* Implement Age Range Slider or Input Fields */}
          {/* For simplicity, using input fields */}
          <input
            type="number"
            name="ageMin"
            placeholder="Min Age"
            value={filters.ageRange[0]}
            onChange={(e) => setFilters({ ...filters, ageRange: [Number(e.target.value), filters.ageRange[1]] })}
            style={{ width: '45%', marginRight: '10%' }}
          />
          <input
            type="number"
            name="ageMax"
            placeholder="Max Age"
            value={filters.ageRange[1]}
            onChange={(e) => setFilters({ ...filters, ageRange: [filters.ageRange[0], Number(e.target.value)] })}
            style={{ width: '45%' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography id="height-range-slider" gutterBottom>
            Height Range (cm)
          </Typography>
          {/* Implement Height Range Slider or Input Fields */}
          {/* For simplicity, using input fields */}
          <input
            type="number"
            name="heightMin"
            placeholder="Min Height"
            value={filters.heightRange[0]}
            onChange={(e) => setFilters({ ...filters, heightRange: [Number(e.target.value), filters.heightRange[1]] })}
            style={{ width: '45%', marginRight: '10%' }}
          />
          <input
            type="number"
            name="heightMax"
            placeholder="Max Height"
            value={filters.heightRange[1]}
            onChange={(e) => setFilters({ ...filters, heightRange: [filters.heightRange[0], Number(e.target.value)] })}
            style={{ width: '45%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ padding: '20px' }}>
        {filteredModels.map(model => (
          <Grid item xs={12} sm={6} md={4} key={model.id}>
            <Card>
              {model.imageURL && (
                <CardMedia
                  component="img"
                  alt={model.name}
                  height="200"
                  image={model.imageURL}
                  title={model.name}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {model.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Age: {model.age}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Gender: {model.gender}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Height: {model.height} cm
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Measurements: {model.measurements}
                </Typography>
              </CardContent>
              <CardActions>
                <Payment modelId={model.id} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BrowseModels;
