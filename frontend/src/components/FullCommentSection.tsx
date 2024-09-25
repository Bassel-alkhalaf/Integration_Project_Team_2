import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button, Card, Avatar } from '@mui/material';
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
    avatarUrl?: string; // Optional: Add avatar for professional touch
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
                                avatarUrl: userData?.avatarUrl || '', // Optional: Avatar URL
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
        <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1d3557', marginBottom: '20px' }}>
                Comments
            </Typography>
            {commentData.map((comment, index) => {
                const isOwner = comment.UserId === currentUser?.uid;

                return (
                    <Card key={index} sx={{ display: 'flex', alignItems: 'flex-start', padding: 2, marginBottom: 2, backgroundColor: '#f8f9fa' }}>
                        {comment.avatarUrl ? (
                            <Avatar src={comment.avatarUrl} sx={{ marginRight: 2 }} />
                        ) : (
                            <Avatar sx={{ marginRight: 2 }}>{comment.firstName?.[0]}</Avatar>
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2d4059' }}>
                                {comment.firstName} {comment.lastName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6c757d', marginBottom: 1 }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                            {editCommentId === comment.commentId ? (
                                <TextField
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    sx={{ marginBottom: 2 }}
                                />
                            ) : (
                                <Typography variant="body2" sx={{ marginBottom: 1, color: '#2d4059' }}>
                                    {comment.content}
                                </Typography>
                            )}
                            {isOwner && (
                                <Box>
                                    <IconButton color="primary" onClick={() => handleEditComment(comment.commentId, comment.content)} sx={{ color: '#1d3557' }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDeleteComment(comment.commentId)} sx={{ color: '#e63946' }}>
                                        <Delete />
                                    </IconButton>
                                    {editCommentId === comment.commentId && (
                                        <Button color="primary" onClick={handleSaveEditComment} sx={{ marginTop: 1 }}>
                                            Save
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Card>
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
                    sx={{ backgroundColor: '#ffffff', borderRadius: '4px' }}
                />
                <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ mt: 2, backgroundColor: '#1d3557' }}>
                    Submit Comment
                </Button>
            </Box>
        </Box>
    );
};

export default FullCommentSection;
