import React, { useState } from 'react';
import { Box, Button, Textarea, VStack } from '@chakra-ui/react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(content);
    setContent('');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mt={8} p={4} shadow="md" borderRadius="md">
      <VStack spacing={4}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <Button type="submit" colorScheme="blue" width="full">
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default CommentForm;
