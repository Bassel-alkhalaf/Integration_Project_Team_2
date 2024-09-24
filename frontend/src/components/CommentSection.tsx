import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Comment } from '../types/comment.type'; // Adjust the import paths as needed
import { useFetchComments } from '../hooks/apiHooks/comment/useFetchComments';
import { useDeleteComment } from '../hooks/apiHooks/comment/useDeleteComment';
import { useCreateComment } from '../hooks/apiHooks/comment/useCreateComment';
import { getAuth } from 'firebase/auth';

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [newCommentText, setNewCommentText] = useState('');
    const { data: comments, refetch } = useFetchComments(postId); // Fetch comments using the hook
    const [localComments, setLocalComments] = useState<Comment[]>([]); // Use local state for comments
    const { mutate: createComment } = useCreateComment(); // Use the hook to create a comment
    const { mutate: deleteComment } = useDeleteComment(); // Use the hook to delete a comment

    // Get the current authenticated user
    const auth = getAuth();
    const user = auth.currentUser;

    // Fetch comments and update local state when comments or postId changes
    useEffect(() => {
        if (comments) {
            setLocalComments(comments);
        }
    }, [comments]);

    const handleCommentSubmit = () => {
        if (!newCommentText.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        if (!user) {
            alert('You must be logged in to comment.');
            return;
        }

        const newComment = {
            postId,
            content: newCommentText,
        };

        // Use the createComment hook to create a new comment
        createComment(newComment, {
            onSuccess: () => {
                setLocalComments([...localComments, { commentId: 'new-id', postId, authorId: user.uid, text: newCommentText, createdAt: new Date() }]);
                setNewCommentText('');
                refetch(); // Refetch comments after creating a new one
            },
            onError: (error) => {
                console.error('Failed to submit comment:', error);
                alert('Failed to submit comment.');
            }
        });
    };

    const handleDeleteComment = (commentId: string) => {
        deleteComment(commentId, {
            onSuccess: () => {
                setLocalComments((prevComments) => prevComments.filter(comment => comment.commentId !== commentId));
            },
            onError: (error) => {
                console.error('Failed to delete comment:', error);
                alert('Failed to delete comment.');
            }
        });
    };

    return (
        <Box>
            <Typography variant="h5">Comments</Typography>
            {localComments.slice(0, 3).map((comment) => (
                <Box key={comment.commentId} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        {comment.text} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
                    </Typography>
                    {comment.authorId === user?.uid && (
                        <Button color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
                            Delete
                        </Button>
                    )}
                </Box>
            ))}

            <Box sx={{ mt: 4 }}>
                <TextField
                    label="Add a comment"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                />
                <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ mt: 2 }}>
                    Submit Comment
                </Button>
            </Box>
        </Box>
    );
};

export default CommentSection;
