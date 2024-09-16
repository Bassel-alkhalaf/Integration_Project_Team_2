import React from 'react';
import { ChakraProvider, Flex, Box, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import FriendRequest from './components/FriendRequest';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import PostForm from './components/Posts/PostForm';
import PaginatedComments from './components/Posts/PaginatedComments'; // Import PaginatedComments

// Define dark theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Router>
          <Flex direction="column" minHeight="100vh">
            <Navbar />
            <Flex flex="1">
              <Sidebar />
              <Box flex="1" p={4}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/friend-request" element={<FriendRequest />} />
                  <Route path="/create-post" element={<PostForm />} />
                  <Route
                    path="/post/:postId/comments"
                    element={<PaginatedComments />}
                  /> {/* Add PaginatedComments Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
            </Flex>
            <Footer />
          </Flex>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
