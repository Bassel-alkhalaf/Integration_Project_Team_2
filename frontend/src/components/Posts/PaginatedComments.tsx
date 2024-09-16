import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Text } from '@chakra-ui/react';
import { postService } from '../../services/postService';
import { useParams } from 'react-router-dom';

const PaginatedComments: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [comments, setComments] = useState<any[]>([]);
  const [lastCommentKey, setLastCommentKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if postId is undefined
  if (!postId) {
    return <Text>Invalid Post ID</Text>;
  }

  const fetchComments = async () => {
    setIsLoading(true);
    const newComments = await postService.getCommentsWithPagination(postId, 10, lastCommentKey);
    if (newComments.length > 0) {
      setLastCommentKey(newComments[newComments.length - 1].id); // Update the key for pagination
      setComments((prevComments) => [...prevComments, ...newComments]); // Append new comments to existing ones
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <VStack spacing={4}>
        {comments.map((comment) => (
          <Box key={comment.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
            <Text>
              {comment.content} - <strong>{comment.authorName || 'Unknown'}</strong>
            </Text>
          </Box>
        ))}
      </VStack>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Button onClick={fetchComments} mt={4} colorScheme="blue">
          Load more comments
        </Button>
      )}
    </Box>
  );
};

export default PaginatedComments;
