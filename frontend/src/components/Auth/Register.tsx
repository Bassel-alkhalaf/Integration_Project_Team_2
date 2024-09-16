import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, FormControl, FormLabel, FormErrorMessage, useToast, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // To redirect after success
import { authService } from '../../services/authService';
import { userService } from '../../services/userService'; // To save user profile

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(''); // New required field for gender
  const [age, setAge] = useState(''); // New required field for age
  const [hobbies, setHobbies] = useState(''); // Optional field for hobbies
  const [interests, setInterests] = useState(''); // Optional field for interests
  const [bio, setBio] = useState(''); // New optional field for bio
  const [error, setError] = useState('');
  const toast = useToast(); // For flash messages
  const navigate = useNavigate(); // To redirect

  // Form validation for password matching
  const validatePasswords = () => password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Reset error message

    // Basic form validation
    if (!validatePasswords()) {
      setError('Passwords do not match');
      return;
    }

    if (!gender || !age) {
      setError('Gender and age are required.');
      return;
    }

    try {
      const userCredential = await authService.register(email, password); // Register the user in Firebase

      // Create user profile in the database after registration
      await userService.createUserProfile(userCredential.uid, {
        firstName,
        lastName,
        email,
        gender,
        age,
        hobbies,
        interests,
        bio, // Include bio in the profile creation
      });

      // Flash message for successful registration
      toast({
        title: 'Registration successful.',
        description: 'You have been registered successfully. Redirecting to login...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to login page after registration
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box w="100%" maxW="500px" mx="auto" mt={8} p={4} shadow="md" borderRadius="md">
      <Text fontSize="2xl" mb={4} textAlign="center">
        Register
      </Text>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </FormControl>

        <FormControl isRequired isInvalid={!validatePasswords() && confirmPassword !== ''}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <FormErrorMessage>Passwords do not match</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Gender</FormLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Select Gender"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-Binary</option>
            <option value="prefer-not-to-say">Prefer Not to Say</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Age</FormLabel>
          <Input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Hobbies (Optional)</FormLabel>
          <Input
            type="text"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            placeholder="Your hobbies"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Interests (Optional)</FormLabel>
          <Input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Your interests"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Bio (Optional)</FormLabel>
          <Input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us something about yourself"
          />
        </FormControl>

        {error && <Text color="red.500">{error}</Text>}

        <Button type="submit" colorScheme="blue" width="full">
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;
