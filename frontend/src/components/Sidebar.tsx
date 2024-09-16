import React from 'react';
import { Box, List, ListItem, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Box
      as="aside"
      w="250px"
      p={4}
      bg={useColorModeValue('gray.100', 'gray.900')}
      shadow="md"
      borderRadius="md"
    >
      <List spacing={4}>
        <ListItem>
          <Link as={RouterLink} to="/" fontWeight="bold">
            Home
          </Link>
        </ListItem>
        <ListItem>
          <Link as={RouterLink} to="/community" fontWeight="bold">
            Community
          </Link>
        </ListItem>
        <ListItem>
          <Link as={RouterLink} to="/friend-request" fontWeight="bold">
            Friend Requests
          </Link>
        </ListItem>
        <ListItem>
          <Link as={RouterLink} to="/admin" fontWeight="bold">
            Admin Dashboard
          </Link>
        </ListItem>
        <ListItem>
          <Link as={RouterLink} to="/settings" fontWeight="bold">
            Settings
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
