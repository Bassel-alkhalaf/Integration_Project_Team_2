import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface CommentProps {
  content: string;
  author: string;
}

const Comment: React.FC<CommentProps> = ({ content, author }) => {
  return (
    <Box p={4} shadow="md" borderWidth="1px" borderRadius="md" mb={4}>
      <Text>{content}</Text>
      <Text mt={2} color="gray.500">
        By {author}
      </Text>
    </Box>
  );
};

export default Comment;
