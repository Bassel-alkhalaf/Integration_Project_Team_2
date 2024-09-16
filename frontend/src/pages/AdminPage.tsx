import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const AdminPage: React.FC = () => {
  return (
    <Box w="100%" maxW="800px" mx="auto" mt={8} p={4}>
      <Heading as="h2" mb={4}>
        Admin Dashboard
      </Heading>
      <Text fontSize="lg">Manage users, posts, and reports here.</Text>
    </Box>
  );
};

export default AdminPage;
