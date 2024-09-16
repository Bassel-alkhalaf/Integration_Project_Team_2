import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const SettingsPage: React.FC = () => {
  return (
    <Box w="100%" maxW="600px" mx="auto" mt={8} p={4}>
      <Heading as="h2" mb={4}>
        Settings
      </Heading>
      <Text fontSize="lg">Manage your account settings here.</Text>
    </Box>
  );
};

export default SettingsPage;
