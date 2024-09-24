import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Comment } from '../types/comment.type'; // Adjust the import paths as needed
import { useFetchComments } from '../hooks/apiHooks/comment/useFetchComments';
import { useDeleteComment } from '../hooks/apiHooks/comment/useDeleteComment';
import { useCreateComment } from '../hooks/apiHooks/comment/useCreateComment';
import { getAuth } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { commentQueryKeys } from '../consts';

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const queryClient = useQueryClient();

    const [newCommentText, setNewCommentText] = useState('');
    const { data: comments, refetch } = useFetchComments(postId); // Fetch comments using the hook
    // const [localComments, setLocalComments] = useState<Comment[]>([]); // Use local state for comments
    const { mutate: createComment } = useCreateComment(); // Use the hook to create a comment
    const { mutate: deleteComment } = useDeleteComment(); // Use the hook to delete a comment

    // Get the current authenticated user
    const auth = getAuth();
    const user = auth.currentUser;

    // Fetch comments and update local state when comments or postId changes
    // useEffect(() => {
    //     if (comments) {
    //         setLocalComments(comments);
    //     }
    // }, [comments]);

    const handleCommentSubmit = () => {
        if (!newCommentText.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        if (!user) {
            alert('You must be logged in to comment.');
            return;
        }

        const newComment: Comment = {
            commentId: 'new-id', // This will be replaced by a real ID from the backend
            postId: postId!,
            authorId: user.uid, // Current user's UID
            content: newCommentText,
            createdAt: new Date(),
        };
        // Use the createComment hook to create a new comment
        createComment(newComment, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId)})
                // setLocalComments([...localComments, { commentId: 'new-id', postId, authorId: user.uid, text: newCommentText, createdAt: new Date() }]);
                setNewCommentText('');
                //refetch(); 
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
                queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) })

                // setLocalComments((prevComments) => prevComments.filter(comment => comment.commentId !== commentId));
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
            {comments?.slice(0, 3).map((comment, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        {comment.content} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
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
