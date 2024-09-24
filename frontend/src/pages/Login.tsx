import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/apis/login.api';
import { enqueueSnackbar } from 'notistack';
import { getAuth } from 'firebase/auth'; // Import Firebase authentication

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await loginUser(email, password); // Calls the login function from the API

      const auth = getAuth(); // Initialize Firebase Auth
      const user = auth.currentUser; // Get the current logged-in user

      if (user) {
        const token = await user.getIdToken(); // Get the Firebase auth token
        console.log('Firebase Token:', token); // Log the token
      } else {
        console.error('No user is logged in.');
      }

      enqueueSnackbar('Login successful!', { variant: 'success' }); // Display success notification
      navigate('/'); // Navigate to the homepage after login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // If error is an instance of Error, display the message
        enqueueSnackbar('Login failed!', { variant: 'error' });
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Login
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Button
              color="primary"
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              Register here
            </Button>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
