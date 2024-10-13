import React, { useState } from 'react';
import { Auth, API, Storage } from 'aws-amplify';
import { createModel } from '../graphql/mutations';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';

const ModelProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    height: '',
    measurements: '',
    gender: '',
    age: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await Auth.currentAuthenticatedUser();
    const input = { ...formData, owner: user.username };

    // Upload images to S3
    const imageKeys = [];
    for (let i = 0; i < formData.images.length; i++) {
      const file = formData.images[i];
      const result = await Storage.put(file.name, file, {
        contentType: file.type,
      });
      imageKeys.push(result.key);
    }

    input.images = imageKeys;

    // Save to GraphQL API
    try {
      await API.graphql({
        query: createModel,
        variables: { input }
      });
      alert('Profile created successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        height: '',
        measurements: '',
        gender: '',
        age: '',
        images: []
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Create Your Model Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* Repeat for other fields */}
          <Grid item xs={12}>
            <input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload Images
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary">
              {formData.images.length > 0 ? `${formData.images.length} file(s) selected` : 'No files selected'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ModelProfile;
