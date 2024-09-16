import React, { useState } from 'react';
import { Box, Button, Input, Textarea, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Use navigate for redirecting
import { postService } from '../../services/postService'; // Post service for Firebase integration
import { useAuth } from '../../context/AuthContext'; // To manage user authentication

const PostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate(); // Define navigate function
  const { user } = useAuth(); // Get the authenticated user

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted');
    console.log('Title:', title);
    console.log('Content:', content);

    if (user) {
      console.log('User authenticated:', user.uid);
      try {
        // Add log before the post is created
        console.log('Creating post...');
        await postService.createPost(title, content, user.uid);
        console.log('Post created successfully');

        // Redirect to the community page after submitting
        setTitle('');
        setContent('');
        navigate('/community');
      } catch (error) {
        console.error('Error creating post:', error);
      }
    } else {
      console.log('No authenticated user');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mt={8} p={4} shadow="md" borderRadius="md">
      <VStack spacing={4}>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <Button type="submit" colorScheme="blue" width="full">
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default PostForm;
