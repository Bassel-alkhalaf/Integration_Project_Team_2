import React, { useState } from 'react';
import { Box, Heading, Input, Button, VStack, Text } from '@chakra-ui/react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext'; // To get the current logged-in user

const SearchUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { user } = useAuth(); // Use authenticated user to get senderId

  const handleSearch = async () => {
    try {
      const users = await userService.searchUsers(searchQuery);
      setResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSendFriendRequest = async (recipientId: string) => {
    if (user) {
      try {
        await userService.sendFriendRequest(user.uid, recipientId); // Pass both senderId and recipientId
        console.log('Friend request sent successfully.');
      } catch (error) {
        console.error('Error sending friend request:', error);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  return (
    <Box w="100%" maxW="800px" mx="auto" mt={8} p={4}>
      <Heading as="h2" mb={4}>Search Users</Heading>
      <VStack spacing={4}>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by email"
        />
        <Button onClick={handleSearch} colorScheme="blue">Search</Button>
      </VStack>

      <VStack mt={4} spacing={4}>
        {results.map((user) => (
          <Box key={user.uid} p={4} borderWidth="1px" borderRadius="md" w="100%">
            <Text>{user.firstName} {user.lastName} - {user.email}</Text>
            <Button colorScheme="green" onClick={() => handleSendFriendRequest(user.uid)}>
              Send Friend Request
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default SearchUsersPage;
