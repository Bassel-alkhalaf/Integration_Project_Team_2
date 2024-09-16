import React, { useState } from 'react';
import { Box, Heading, Text, Button, VStack, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  totalLikes?: number;
  comments?: Comment[];
}

interface PostListProps {
  posts: Post[];
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  user: any;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  onDelete,
  onLike,
  onAddComment,
  user,
}) => {
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleAddComment = (postId: string) => {
    const commentText = newComments[postId]?.trim();
    if (commentText) {
      onAddComment(postId, commentText);
      setNewComments((prev) => ({ ...prev, [postId]: '' })); // Clear the input after adding a comment
    }
  };

  const handleViewMoreComments = (postId: string) => {
    navigate(`/post/${postId}/comments`); // Navigate to comments page
  };

  const handleCommentChange = (postId: string, value: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  return (
    <VStack spacing={4}>
      {posts.map((post) => (
        <Box
          key={post.id}
          p={4}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          width="100%"
        >
          <Heading as="h3" size="md">
            {post.title}
          </Heading>
          <Text mt={2}>{post.content}</Text>
          <Text mt={2} fontWeight="bold">
            By: {post.authorName || 'Unknown'}
          </Text>

          {/* Likes Section */}
          <Button colorScheme="blue" mt={2} onClick={() => onLike(post.id)}>
            Like ({post.totalLikes || 0})
          </Button>

          {/* Comment Section */}
          {post.comments && post.comments.length > 0 && (
            <Box mt={4}>
              <Heading as="h4" size="sm">
                Last Comment:
              </Heading>
              <Text key={post.comments[0].id} mt={2}>
                {post.comments[0].content} -{' '}
                <strong>{post.comments[0].authorName || 'Unknown'}</strong>
              </Text>

              {/* View more comments button */}
              <Button
                colorScheme="gray"
                mt={2}
                onClick={() => handleViewMoreComments(post.id)}
              >
                View more comments
              </Button>
            </Box>
          )}

          {/* Add Comment */}
          <Box mt={4}>
            <Input
              placeholder="Add a comment..."
              value={newComments[post.id] || ''}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
            />
            <Button
              mt={2}
              colorScheme="green"
              onClick={() => handleAddComment(post.id)}
            >
              Add Comment
            </Button>
          </Box>

          {user?.uid === post.authorId && (
            <Button
              colorScheme="red"
              mt={4}
              onClick={() => onDelete(post.id)}
            >
              Delete Post
            </Button>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default PostList;
