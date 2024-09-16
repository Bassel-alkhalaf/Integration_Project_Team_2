import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text, VStack, HStack } from '@chakra-ui/react';
import { friendService } from '../services/friendService';
import { useAuth } from '../context/AuthContext';

const FriendRequest: React.FC = () => {
  const { user } = useAuth(); // Access current user
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchFriendRequests();
      fetchIncomingRequests();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    if (!user) return;
    const requests = await friendService.getFriendRequests(user.uid);
    setFriendRequests(requests);
  };

  const fetchIncomingRequests = async () => {
    if (!user) return;
    const incoming = await friendService.getIncomingFriendRequests(user.uid);
    setIncomingRequests(incoming);
  };

  const handleSearch = async () => {
    const foundUsers = await friendService.searchUsers(searchQuery);
    setUsers(foundUsers);
  };

  const handleSendRequest = async (recipientId: string) => {
    if (!user) return;
    await friendService.sendFriendRequest(user.uid, recipientId);
    fetchFriendRequests();
  };

  const handleAcceptRequest = async (requestId: string) => {
    await friendService.acceptFriendRequest(requestId);
    fetchIncomingRequests();
  };

  const handleRejectRequest = async (requestId: string) => {
    await friendService.rejectFriendRequest(requestId);
    fetchIncomingRequests();
  };

  if (!user) {
    return (
      <Box w="100%" maxW="600px" mx="auto" mt={8} p={4}>
        <Text fontSize="xl" fontWeight="bold">
          Please log in to access the friend request system.
        </Text>
      </Box>
    );
  }

  return (
    <Box w="100%" maxW="600px" mx="auto" mt={8} p={4}>
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Friend Request System
        </Text>

        <Input
          placeholder="Search for users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} colorScheme="blue">
          Search
        </Button>

        <Text fontWeight="bold">Search Results:</Text>
        {users.map((user) => (
          <HStack key={user.uid}>
            <Text>{user.email}</Text>
            <Button
              colorScheme="green"
              onClick={() => handleSendRequest(user.uid)}
            >
              Send Friend Request
            </Button>
          </HStack>
        ))}

        <Text fontWeight="bold" mt={4}>
          Pending Friend Requests:
        </Text>
        {friendRequests.map((request) => (
          <HStack key={request.id}>
            <Text>Request to {request.recipientEmail}</Text>
            <Button colorScheme="red">Cancel Request</Button>
          </HStack>
        ))}

        <Text fontWeight="bold" mt={4}>
          Incoming Friend Requests:
        </Text>
        {incomingRequests.map((request) => (
          <HStack key={request.id}>
            <Text>From {request.senderEmail}</Text>
            <Button
              colorScheme="green"
              onClick={() => handleAcceptRequest(request.id)}
            >
              Accept
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleRejectRequest(request.id)}
            >
              Reject
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default FriendRequest;
