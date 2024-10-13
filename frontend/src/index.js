import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from '@aws-amplify/core'; // Import Amplify from core
import awsExports from './aws-exports';       // Ensure the path is correct

Amplify.configure(awsExports); // Configure Amplify

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
