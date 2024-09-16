import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const NotFound: React.FC = () => {
  return (
    <Box w="100%" maxW="600px" mx="auto" mt={8} p={4} textAlign="center">
      <Heading as="h2" mb={4}>
        404 - Page Not Found
      </Heading>
      <Text fontSize="lg">Sorry, the page you are looking for does not exist.</Text>
    </Box>
  );
};

export default NotFound;
