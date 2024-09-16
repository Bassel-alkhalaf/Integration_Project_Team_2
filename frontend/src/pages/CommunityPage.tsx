import React, { useState, useEffect } from 'react';
import { Box, Heading, useColorModeValue, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/Posts/PostList';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext'; // To manage user authentication

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const { user } = useAuth(); // Use authenticated user
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const fetchedPosts = await postService.getPosts(); // Fetch from Firebase
    if (Array.isArray(fetchedPosts)) {
      setPosts(fetchedPosts);
    } else {
      console.error('Fetched posts are not an array:', fetchedPosts);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    if (user) {
      await postService.deletePost(postId);
      fetchPosts(); // Refresh post list after deletion
    } else {
      console.error('User is not authenticated.');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (user) {
      await postService.likePost(postId, user.uid);
      fetchPosts(); // Refresh post list after like
    } else {
      console.error('User is not authenticated.');
    }
  };

  const handleAddComment = async (postId: string, comment: string) => {
    if (user) {
      await postService.addComment(postId, comment, user.uid);
      fetchPosts(); // Refresh post list after comment
    } else {
      console.error('User is not authenticated.');
    }
  };

  const handleCreatePost = () => {
    if (user) {
      navigate('/create-post');
    } else {
      console.error('User is not authenticated.');
    }
  };

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Box w="100%" maxW="1000px" mx="auto" mt={8} p={4} bg={bgColor} borderRadius="md" shadow="md">
      <Heading as="h1" mb={4} color={headingColor}>
        Community Posts
      </Heading>
      <Text fontSize="lg" color={textColor}>
        Browse through the latest posts from the community!
      </Text>
      {user && (
        <Button onClick={handleCreatePost} colorScheme="blue" mt={4}>
          Create New Post
        </Button>
      )}
      <PostList
        posts={posts}
        onDelete={handleDeletePost}
        onLike={handleLikePost}
        onAddComment={handleAddComment}
        user={user}
      />
    </Box>
  );
};

export default CommunityPage;
