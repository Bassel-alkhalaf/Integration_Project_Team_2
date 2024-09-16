import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface PostProps {
  title: string;
  content: string;
  author: string;
}

const Post: React.FC<PostProps> = ({ title, content, author }) => {
  return (
    <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" mb={4}>
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      <Text mt={4}>{content}</Text>
      <Text mt={2} color="gray.500">
        By {author}
      </Text>
    </Box>
  );
};

export default Post;
