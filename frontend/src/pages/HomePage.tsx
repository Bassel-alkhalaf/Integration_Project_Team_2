import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const HomePage: React.FC = () => {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    const API_URL = 'http://localhost:5062/api/test/ping'; // Your backend URL

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log('Backend response:', data);
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error('Error connecting to backend:', error);
      });
  }, []);

  // Chakra UI color modes for light/dark theme
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const boxShadowColor = useColorModeValue('lg', 'dark-lg');

  return (
    <Box
      w="100%"
      maxW="1000px"
      mx="auto"
      mt={8}
      p={6}
      bg={bgColor}
      color={textColor}
      borderRadius="md"
      shadow={boxShadowColor}
    >
      <Heading as="h1" mb={4} color={headingColor}>
        Welcome to the Forum
      </Heading>
      <Text fontSize="lg">
        Join discussions, create posts, and share your thoughts with the community!
      </Text>
      <Text fontSize="lg" mt={4} color={headingColor}>
        Backend says: {backendMessage || 'Connecting to backend...'}
      </Text>
    </Box>
  );
};

export default HomePage;
