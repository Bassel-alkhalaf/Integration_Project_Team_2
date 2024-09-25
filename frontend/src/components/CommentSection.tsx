// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Button, TextField } from '@mui/material';
// import { Comment } from '../types/comment.type'; // Adjust the import paths as needed
// import { useFetchComments } from '../hooks/apiHooks/comment/useFetchComments';
// import { useDeleteComment } from '../hooks/apiHooks/comment/useDeleteComment';
// import { useCreateComment } from '../hooks/apiHooks/comment/useCreateComment';
// import { getAuth } from 'firebase/auth';
// import { useQueryClient } from '@tanstack/react-query';
// import { commentQueryKeys } from '../consts';
// import { useEditComment } from '../hooks/apiHooks/comment/useEditComment';

// interface CommentSectionProps {
//     postId: string;
// }

// const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
//     const queryClient = useQueryClient();

//     const [newCommentText, setNewCommentText] = useState('');
//     const { data: comments, refetch } = useFetchComments(postId); // Fetch comments using the hook
//     const [editCommentText, setEditCommentText] = useState('');
//     const [editCommentId, setEditCommentId] = useState<string | null>(null); // To store the ID of the comment being edited


//     // const [localComments, setLocalComments] = useState<Comment[]>([]); // Use local state for comments
//     const { mutate: createComment } = useCreateComment(); // Use the hook to create a comment
//     const { mutate: deleteComment } = useDeleteComment(); // Use the hook to delete a comment
//     const { mutate: editComment } = useEditComment(); // Use the hook to edit a comment
//     // Get the current authenticated user
//     const auth = getAuth();
//     const user = auth.currentUser;

//     // Fetch comments and update local state when comments or postId changes
//     // useEffect(() => {
//     //     if (comments) {
//     //         setLocalComments(comments);
//     //     }
//     // }, [comments]);

//     const handleCommentSubmit = () => {
//         if (!newCommentText.trim()) {
//             alert('Comment cannot be empty');
//             return;
//         }

//         if (!user) {
//             alert('You must be logged in to comment.');
//             return;
//         }

//         const newComment: Comment = {
//             commentId: 'new-id', // This will be replaced by a real ID from the backend
//             postId: postId!,
//             authorId: user.uid, // Current user's UID
//             content: newCommentText,
//             createdAt: new Date(),
//         };
//         // Use the createComment hook to create a new comment
//         createComment(newComment, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId)})
//                 // setLocalComments([...localComments, { commentId: 'new-id', postId, authorId: user.uid, text: newCommentText, createdAt: new Date() }]);
//                 setNewCommentText('');
//                 //refetch(); 
//             },
//             onError: (error) => {
//                 console.error('Failed to submit comment:', error);
//                 alert('Failed to submit comment.');
//             }
//         });
//     };
//     const handleEditComment = (commentId: string, content: string) => {
//         console.log("Editing comment:", commentId);
//         setEditCommentId(commentId);
//         setEditCommentText(content);
//       };

//       const handleSaveEditComment = () => {
//         if (!editCommentText.trim() || !editCommentId) return;
//         editComment(
//             { commentId: editCommentId, content: editCommentText, postId }, // Make sure postId is passed here
//             {
//                 onSuccess: () => {
//                     queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//                     setEditCommentId(null);
//                     setEditCommentText('');
//                 },
//             }
//         );
//     };


//     const handleDeleteComment = (commentId: string) => {
//         deleteComment(commentId, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) })

//                 // setLocalComments((prevComments) => prevComments.filter(comment => comment.commentId !== commentId));
//             },
//             onError: (error) => {
//                 console.error('Failed to delete comment:', error);
//                 alert('Failed to delete comment.');
//             }
//         });
//     };




//     return (
//         <Box>
//             <Typography variant="h5">Comments</Typography>
//             {comments?.slice(0, 3).map((comment, index) => (
//                 <Box key={index} sx={{ mt: 2 }}>
//                     <Typography variant="body2">
//                         {comment.content} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
//                     </Typography>
//                     {comment.authorId === user?.uid && (
//                         <Button color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
//                             Delete
//                         </Button>
//                     )}
//                 </Box>
//             ))}

//             <Box sx={{ mt: 4 }}>
//                 <TextField
//                     label="Add a comment"
//                     value={newCommentText}
//                     onChange={(e) => setNewCommentText(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={4}
//                 />
//                 <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ mt: 2 }}>
//                     Submit Comment
//                 </Button>
//             </Box>
//         </Box>
//     );



// };

// export default CommentSection;




// import React, { useState } from 'react';
// import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
// import { Comment } from '../types/comment.type'; // Adjust the import paths as needed
// import { useFetchComments } from '../hooks/apiHooks/comment/useFetchComments';
// import { useDeleteComment } from '../hooks/apiHooks/comment/useDeleteComment';
// import { useCreateComment } from '../hooks/apiHooks/comment/useCreateComment';
// import { getAuth } from 'firebase/auth';
// import { useQueryClient } from '@tanstack/react-query';
// import { commentQueryKeys } from '../consts';
// import { useEditComment } from '../hooks/apiHooks/comment/useEditComment';
// import { Edit, Delete } from '@mui/icons-material'; // Import Edit and Delete icons

// interface CommentSectionProps {
//     postId: string;
// }

// const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
//     const queryClient = useQueryClient();

//     const [newCommentText, setNewCommentText] = useState('');
//     const { data: comments } = useFetchComments(postId); // Fetch comments using the hook
//     const [editCommentText, setEditCommentText] = useState('');
//     const [editCommentId, setEditCommentId] = useState<string | null>(null); // To store the ID of the comment being edited

//     const { mutate: createComment } = useCreateComment(); // Use the hook to create a comment
//     const { mutate: deleteComment } = useDeleteComment(); // Use the hook to delete a comment
//     const { mutate: editComment } = useEditComment(); // Use the hook to edit a comment

//     const auth = getAuth();
//     const user = auth.currentUser;

//     const handleCommentSubmit = () => {
//         if (!newCommentText.trim()) {
//             alert('Comment cannot be empty');
//             return;
//         }

//         if (!user) {
//             alert('You must be logged in to comment.');
//             return;
//         }

//         const newComment: Comment = {
//             commentId: 'new-id', // This will be replaced by a real ID from the backend
//             postId: postId!,
//             authorId: user.uid,
//             content: newCommentText,
//             createdAt: new Date(),
//         };

//         createComment(newComment, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//                 setNewCommentText('');
//             },
//             onError: (error) => {
//                 console.error('Failed to submit comment:', error);
//                 alert('Failed to submit comment.');
//             },
//         });
//     };

//     const handleEditComment = (commentId: string, content: string) => {
//         console.log("Editing comment:", commentId);
//         setEditCommentId(commentId);
//         setEditCommentText(content);
//     };

//     const handleSaveEditComment = () => {

//         if (!editCommentText.trim() || !editCommentId) return;

//         editComment({ commentId: editCommentId, content: editCommentText, postId }, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//                 setEditCommentId(null);
//                 setEditCommentText('');
//             },
//         });
//     };

//     const handleDeleteComment = (commentId: string) => {
//         deleteComment(commentId, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//             },
//             onError: (error) => {
//                 console.error('Failed to delete comment:', error);
//                 alert('Failed to delete comment.');
//             },
//         });
//     };

//     return (
//         <Box>
//             <Typography variant="h5">Comments</Typography>
//             {comments?.slice(0, 3).map((comment, index) => (
//                 <Box key={index} sx={{ mt: 2 }}>
//                     {editCommentId === comment.commentId ? (
//                         <TextField
//                             value={editCommentText}
//                             onChange={(e) => setEditCommentText(e.target.value)}
//                             fullWidth
//                             multiline
//                             rows={2}
//                         />
//                     ) : (
//                         <Typography variant="body2">
//                             {comment.content} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
//                         </Typography>
//                     )}
//                     {comment.authorId === user?.uid && (
//                         <Box>
//                             <IconButton color="primary" onClick={() => handleEditComment(comment.commentId, comment.content)}>
//                                 <Edit />
//                             </IconButton>
//                             <IconButton color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
//                                 <Delete />
//                             </IconButton>
//                             {editCommentId === comment.commentId && (
//                                 <Button color="primary" onClick={handleSaveEditComment}>
//                                     Save
//                                 </Button>
//                             )}
//                         </Box>
//                     )}
//                 </Box>
//             ))}

//             <Box sx={{ mt: 4 }}>
//                 <TextField
//                     label="Add a comment"
//                     value={newCommentText}
//                     onChange={(e) => setNewCommentText(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={4}
//                 />
//                 <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ mt: 2 }}>
//                     Submit Comment
//                 </Button>
//             </Box>
//         </Box>
//     );
// };

// export default CommentSection;










// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
// import { Comment } from '../types/comment.type'; // Adjust the import paths as needed
// import { useFetchComments } from '../hooks/apiHooks/comment/useFetchComments';
// import { useDeleteComment } from '../hooks/apiHooks/comment/useDeleteComment';
// import { useCreateComment } from '../hooks/apiHooks/comment/useCreateComment';
// import { useEditComment } from '../hooks/apiHooks/comment/useEditComment';
// import { getAuth, User } from 'firebase/auth';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { useQueryClient } from '@tanstack/react-query';
// import { commentQueryKeys } from '../consts';
// import { Edit, Delete } from '@mui/icons-material';

// interface CommentSectionProps {
//     postId: string;
// }

// const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
//     const queryClient = useQueryClient();
//     const [newCommentText, setNewCommentText] = useState('');
//     const { data: comments } = useFetchComments(postId); // Fetch comments using the hook
//     const [editCommentText, setEditCommentText] = useState('');
//     const [editCommentId, setEditCommentId] = useState<string | null>(null); // To store the ID of the comment being edited
//     const [currentUser, setCurrentUser] = useState<User | null>(null); // Store the current user
//     const [userIdFromFirestore, setUserIdFromFirestore] = useState<string | null>(null); // Store the Firestore user ID

//     const { mutate: createComment } = useCreateComment(); // Use the hook to create a comment
//     const { mutate: deleteComment } = useDeleteComment(); // Use the hook to delete a comment
//     const { mutate: editComment } = useEditComment(); // Use the hook to edit a comment

//     const auth = getAuth();

//     // Fetch current authenticated user from Firebase Auth and user data from Firestore
//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(async (user) => {
//             if (user) {
//                 setCurrentUser(user);

//                 // Fetch user details from Firestore using the user's UID
//                 const firestore = getFirestore();
//                 const userRef = doc(firestore, 'users', user.uid); // Assuming 'users' is your Firestore collection
//                 const userDoc = await getDoc(userRef);

//                 if (userDoc.exists()) {
//                     const userData = userDoc.data();
//                     console.log('Firestore Id:', userData.Id); // Logging Firestore Id
//                     console.log('Firebase Auth user.uid:', user.uid);
//                     setUserIdFromFirestore(userData.Id || user.uid); // Adjusted to use Firestore 'Id' or fallback to Firebase Auth UID
//                 }
//             } else {
//                 setCurrentUser(null);
//                 setUserIdFromFirestore(null); // Reset user data on logout
//             }
//         });

//         return () => unsubscribe();
//     }, [auth]);

//     // Handle comment submission
//     const handleCommentSubmit = () => {
//         if (!newCommentText.trim()) {
//             alert('Comment cannot be empty');
//             return;
//         }

//         if (!currentUser || !userIdFromFirestore) {
//             alert('You must be logged in to comment.');
//             return;
//         }

//         const newComment: Comment = {
//             commentId: 'new-id', // Placeholder, replaced by backend ID
//             postId: postId!,
//             UserId: userIdFromFirestore, // Use Firestore user ID
//             content: newCommentText,
//             createdAt: new Date(),
//         };

//         createComment(newComment, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//                 setNewCommentText(''); // Clear input after successful submission
//             },
//             onError: (error) => {
//                 console.error('Failed to submit comment:', error);
//                 alert('Failed to submit comment.');
//             },
//         });
//     };

//     // Handle editing a comment
//     const handleEditComment = (commentId: string, content: string) => {
//         console.log("Editing comment:", commentId);
//         setEditCommentId(commentId);
//         setEditCommentText(content);
//     };

//     // Save the edited comment
//     const handleSaveEditComment = () => {
//         if (!editCommentText.trim() || !editCommentId) return;

//         editComment({ commentId: editCommentId, content: editCommentText, postId }, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//                 setEditCommentId(null);
//                 setEditCommentText('');
//             },
//         });
//     };

//     // Handle deleting a comment
//     const handleDeleteComment = (commentId: string) => {
//         deleteComment(commentId, {
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: commentQueryKeys.all(postId) });
//             },
//             onError: (error) => {
//                 console.error('Failed to delete comment:', error);
//                 alert('Failed to delete comment.');
//             },
//         });
//     };

//     return (
//         <Box>
//             <Typography variant="h5">Comments</Typography>
//             {comments?.slice(0, 3).map((comment, index) => {
//                 console.log("Comment UserId:", comment.UserId, "Firestore userId:", userIdFromFirestore);

//                 const isOwner = comment.UserId === userIdFromFirestore;

//                 return (
//                     <Box key={index} sx={{ mt: 2 }}>
//                         {editCommentId === comment.commentId ? (
//                             <TextField
//                                 value={editCommentText}
//                                 onChange={(e) => setEditCommentText(e.target.value)}
//                                 fullWidth
//                                 multiline
//                                 rows={2}
//                             />
//                         ) : (
//                             <Typography variant="body2">
//                                 {comment.content} (Posted by: {comment.UserId || 'Unknown'} at {new Date(comment.createdAt).toLocaleString()})
//                             </Typography>
//                         )}

//                         {isOwner && (
//                             <Box>
//                                 <IconButton color="primary" onClick={() => handleEditComment(comment.commentId, comment.content)}>
//                                     <Edit />
//                                 </IconButton>
//                                 <IconButton color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
//                                     <Delete />
//                                 </IconButton>
//                                 {editCommentId === comment.commentId && (
//                                     <Button color="primary" onClick={handleSaveEditComment}>
//                                         Save
//                                     </Button>
//                                 )}
//                             </Box>
//                         )}
//                     </Box>
//                 );
//             })}

//             <Box sx={{ mt: 4 }}>
//                 <TextField
//                     label="Add a comment"
//                     value={newCommentText}
//                     onChange={(e) => setNewCommentText(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={4}
//                 />
//                 <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ mt: 2 }}>
//                     Submit Comment
//                 </Button>
//             </Box>
//         </Box>
//     );
// };

// export default CommentSection;


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

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
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
            {commentData?.slice(0, 3).map((comment, index) => {
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

export default CommentSection;
