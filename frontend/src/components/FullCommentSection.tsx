
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import { Comment } from '../types/comment.type'; // Adjust the import paths as needed
import { useFetchComments } from '../hooks/apiHooks/comment/useFetchComments';
import { useDeleteComment } from '../hooks/apiHooks/comment/useDeleteComment';
import { useCreateComment } from '../hooks/apiHooks/comment/useCreateComment';
import { useEditComment } from '../hooks/apiHooks/comment/useEditComment';
import { getAuth, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { commentQueryKeys } from '../consts';
import { Edit, Delete } from '@mui/icons-material';

interface CommentSectionProps {
    postId: string;
}

interface CommentWithUser extends Comment {
    firstName?: string;
    lastName?: string;
}

const FullCommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const queryClient = useQueryClient();
    const [newCommentText, setNewCommentText] = useState('');
    const { data: comments } = useFetchComments(postId); // Fetch comments using the hook
    const [editCommentText, setEditCommentText] = useState('');
    const [editCommentId, setEditCommentId] = useState<string | null>(null); // To store the ID of the comment being edited
    const [currentUser, setCurrentUser] = useState<User | null>(null); // Store the current user
    const [commentData, setCommentData] = useState<CommentWithUser[]>([]); // Store comments with user data

    const { mutate: createComment } = useCreateComment(); // Use the hook to create a comment
    const { mutate: deleteComment } = useDeleteComment(); // Use the hook to delete a comment
    const { mutate: editComment } = useEditComment(); // Use the hook to edit a comment

    const auth = getAuth();

    // Fetch current authenticated user from Firebase Auth and user data from Firestore
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Fetch user data for each comment
    useEffect(() => {
        const fetchUserData = async () => {
            if (comments) {
                const firestore = getFirestore();
                const updatedComments = await Promise.all(
                    comments.map(async (comment) => {
                        const userRef = doc(firestore, 'users', comment.UserId);
                        const userDoc = await getDoc(userRef);
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            return {
                                ...comment,
                                firstName: userData?.FirstName || 'Unknown',
                                lastName: userData?.LastName || 'User',
                            };
                        }
                        return { ...comment, firstName: 'Unknown', lastName: 'User' };
                    })
                );
                setCommentData(updatedComments);
            }
        };

        fetchUserData();
    }, [comments]);

    const handleCommentSubmit = () => {
        if (!newCommentText.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        if (!currentUser) {
            alert('You must be logged in to comment.');
            return;
        }

        const newComment: Comment = {
            commentId: 'new-id', // Placeholder, replaced by backend ID
            postId: postId!,
            UserId: currentUser.uid, // Use Firebase Auth user ID
            content: newCommentText,
            createdAt: new Date(),
        };

        createComment(newComment, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
                setNewCommentText(''); // Clear input after successful submission
            },
            onError: (error) => {
                console.error('Failed to submit comment:', error);
                alert('Failed to submit comment.');
            },
        });
    };

    const handleEditComment = (commentId: string, content: string) => {
        console.log("Editing comment:", commentId);
        setEditCommentId(commentId);
        setEditCommentText(content);
    };

    const handleSaveEditComment = () => {
        if (!editCommentText.trim() || !editCommentId) return;

        editComment({ commentId: editCommentId, content: editCommentText, postId }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
                setEditCommentId(null);
                setEditCommentText('');
            },
        });
    };

    const handleDeleteComment = (commentId: string) => {
        deleteComment(commentId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
            },
            onError: (error) => {
                console.error('Failed to delete comment:', error);
                alert('Failed to delete comment.');
            },
        });
    };

    return (
        <Box>
            <Typography variant="h5">Comments</Typography>
            {commentData.map((comment, index) => {
                const isOwner = comment.UserId === currentUser?.uid;

                return (
                    <Box key={index} sx={{ mt: 2 }}>
                        {editCommentId === comment.commentId ? (
                            <TextField
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        ) : (
                            <Typography variant="body2">
                                {comment.content} (Posted by: {comment.firstName} {comment.lastName} at {new Date(comment.createdAt).toLocaleString()})
                            </Typography>
                        )}

                        {isOwner && (
                            <Box>
                                <IconButton color="primary" onClick={() => handleEditComment(comment.commentId, comment.content)}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
                                    <Delete />
                                </IconButton>
                                {editCommentId === comment.commentId && (
                                    <Button color="primary" onClick={handleSaveEditComment}>
                                        Save
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                );
            })}

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

export default FullCommentSection;
