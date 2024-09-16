import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext'; // To handle authentication

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast(); // For flash messages
  const navigate = useNavigate(); // For redirection
  const { login: authenticateUser } = useAuth(); // To set the user as authenticated

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Reset any existing error message

    try {
      const user = await authService.login(email, password); // Login via authService and get the user

      // If login is successful, authenticate the user in context by passing the user object
      authenticateUser(user);

      // Flash message for successful login
      toast({
        title: 'Login successful.',
        description: 'You have been logged in successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to another page, like the profile page, after successful login
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box w="100%" maxW="400px" mx="auto" mt={8} p={4} shadow="md" borderRadius="md">
      <Text fontSize="2xl" mb={4} textAlign="center">
        Login
      </Text>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {error && <Text color="red.500">{error}</Text>}

        <Button type="submit" colorScheme="blue" width="full">
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
