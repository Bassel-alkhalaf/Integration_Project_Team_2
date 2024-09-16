import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Input, Button, VStack, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [interests, setInterests] = useState('');
  const [bio, setBio] = useState(''); // New bio field
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setLoading(true);
      userService.getUserProfile(user.uid)
        .then((profile) => {
          if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setGender(profile.gender || '');
            setAge(profile.age || '');
            setHobbies(profile.hobbies || '');
            setInterests(profile.interests || '');
            setBio(profile.bio || ''); // Load bio if exists
          }
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, toast]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await userService.updateUserProfile(user.uid, {
        firstName,
        lastName,
        gender,
        age,
        hobbies,
        interests,
        bio, // Update bio field
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Text>Please log in to view your profile.</Text>;
  }

  return (
    <Box w="100%" maxW="600px" mx="auto" mt={8} p={4}>
      <Heading as="h2" mb={4}>My Profile</Heading>
      <VStack spacing={4}>
        <Input
          value={email}
          isReadOnly
          backgroundColor="gray.700"  // Darker gray for dark theme
          color="gray.400"            // Light gray text to contrast
          cursor="not-allowed"
          placeholder="Email"
        />
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <Input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Gender"
        />
        <Input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <Input
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          placeholder="Hobbies"
        />
        <Input
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Interests"
        />
        <Input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />
        <Button
          onClick={handleUpdateProfile}
          colorScheme="blue"
          isLoading={loading}
        >
          Update Profile
        </Button>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
