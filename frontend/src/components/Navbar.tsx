import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, HStack, Button, Link, useColorModeValue, Text } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const Navbar: React.FC = () => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext

  // Define colors using useColorModeValue
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const hoverLinkColor = useColorModeValue('blue.400', 'blue.300');
  const profileBtnBg = useColorModeValue('blue.600', 'blue.400');
  const profileBtnHoverBg = useColorModeValue('blue.400', 'blue.500');
  const logoutBtnBg = useColorModeValue('red.600', 'red.400');
  const logoutBtnHoverBg = useColorModeValue('red.400', 'red.500');

  return (
    <Box bg={bgColor} px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('blue.600', 'white')}>
          ForumApp
        </Text>

        <HStack spacing={8} alignItems="center">
          <Link
            as={RouterLink}
            to="/"
            fontSize="lg"
            fontWeight="medium"
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: hoverLinkColor,
            }}
          >
            Home
          </Link>
          <Link
            as={RouterLink}
            to="/community"
            fontSize="lg"
            fontWeight="medium"
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: hoverLinkColor,
            }}
          >
            Community
          </Link>
          <Link
            as={RouterLink}
            to="/friend-request"
            fontSize="lg"
            fontWeight="medium"
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: hoverLinkColor,
            }}
          >
            Friend Requests
          </Link>
          {user ? (
            <Link
              as={RouterLink}
              to="/profile"
              fontSize="lg"
              fontWeight="medium"
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: hoverLinkColor,
              }}
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                as={RouterLink}
                to="/login"
                fontSize="lg"
                fontWeight="medium"
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: hoverLinkColor,
                }}
              >
                Login
              </Link>
              <Link
                as={RouterLink}
                to="/register"
                fontSize="lg"
                fontWeight="medium"
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: hoverLinkColor,
                }}
              >
                Register
              </Link>
            </>
          )}
        </HStack>

        <Flex alignItems="center">
          {user ? (
            <Button
              onClick={logout}
              bg={logoutBtnBg}
              color="white"
              _hover={{
                bg: logoutBtnHoverBg,
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              as={RouterLink}
              to="/profile"
              bg={profileBtnBg}
              color="white"
              _hover={{
                bg: profileBtnHoverBg,
              }}
            >
              My Profile
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
