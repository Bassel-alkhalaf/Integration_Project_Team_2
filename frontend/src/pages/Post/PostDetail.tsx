// import { useState, useEffect } from 'react';
// import { Container, TextField, Button, Typography, Box } from '@mui/material';
// import { createComment, getPostComments } from '../../api/apis/comment.api'; // Adjust the path as needed
// import { getPostDetails } from '../../api/apis/post.api'; // Adjust the path as needed
// import { useParams } from 'react-router-dom';
// import { Post } from '../../types/post.type'; // Import Post type
// import { Comment } from '../../types/comment.type'; // Import Comment type
// import { getAuth } from "firebase/auth"; // Firebase Auth for comment submission
// import { useQueryClient } from '@tanstack/react-query';
// import { commentQueryKeys } from '../../consts';

// export default function PostDetail() {
//     const { postId } = useParams<{ postId: string }>();
//     const [post, setPost] = useState<Post | null>(null); // Use Post type
//     const [comments, setComments] = useState<Comment[]>([]); // Use Comment array for storing comments
//     const [commentText, setCommentText] = useState('');
//     const [commentsCount, setCommentsCount] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const queryClient = useQueryClient();
//     // Fetch post details and comments
//     useEffect(() => {
//         async function fetchPostDetails() {
//             if (!postId) return;
//             try {
//                 const postData = await getPostDetails(postId);
//                 setPost(postData); 
//                 const postComments = await getPostComments(postId);
//                 setComments(postComments);
//                 setCommentsCount(postComments.length)
//             } catch (error) {
//                 console.error("Failed to fetch post or comments:", error);
//             } finally {
//                 setIsLoading(false); 
//             }
//         }
//         fetchPostDetails();
//     }, [postId]);

//     // Handle comment submission
//     const handleCommentSubmit = async () => {
//         if (!commentText.trim()) {
//             alert('Comment cannot be empty');
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             // Ensure the user is authenticated
//             const auth = getAuth();
//             const user = auth.currentUser;
//             if (!user) {
//                 alert("You must be logged in to comment.");
//                 return;
//             }
           
//             const newComment: Comment = {
//                 commentId: 'new-id', // This will be replaced by a real ID from the backend
//                 postId: postId!,
//                 authorId: user.uid, // Current user's UID
//                 content: commentText,
//                 createdAt: new Date(),
//             };
//             await createComment(newComment), {
//                 onSuccess: () => {
                  
//                   queryClient.invalidateQueries({ queryKey: [commentQueryKeys.all(postId), "posts"]});
                  
//                 },
            
//               };
          

//             // Update comments state with the newly created comment
//             setComments((prevComments) => [...prevComments, newComment]);
//             setCommentText(''); // Clear the input after submission
//         } catch (error) {
//             console.error("Failed to submit comment:", error);
//             alert("Failed to submit comment. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) {
//         return <Typography variant="h6">Loading post...</Typography>;
//     }

//     return (
//         <Container>
//             {post ? (
//                 <Box>
//                     <Typography variant="h4">{post.title}</Typography>
//                     <Typography variant="body1">{post.text}</Typography>
//                 </Box>
//             ) : (
//                 <Typography variant="h6">Post not found</Typography>
//             )}

//             {/* Display comments */}
//             {commentsCount > 0 ? (
//                 <Box sx={{ mt: 4 }}>
//                     <Typography variant="h5">Comments</Typography>
//                     {comments.map((comment) => (
//                         <Box key={postId} sx={{ mt: 2 }}>
//                             <Typography variant="body2">
//                                 {comment.content} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
//                             </Typography>
//                         </Box>
//                     ))}
//                 </Box>
//             ) : (
//                 <Typography variant="body2" sx={{ mt: 4 }}>No comments yet.</Typography>
//             )}

//             {/* Add a comment */}
//             <Box sx={{ mt: 4 }}>
//                 <TextField
//                     label="Add a comment"
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     fullWidth
//                     multiline
//                     rows={4}
//                 />
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleCommentSubmit}
//                     sx={{ mt: 2 }}
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit Comment'}
//                 </Button>
//             </Box>
//         </Container>
//     );
// }







import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton } from '@mui/material';
import { createComment, getPostComments } from '../../api/apis/comment.api'; // Adjust the path as needed
import { getPostDetails } from '../../api/apis/post.api'; // Adjust the path as needed
import { useParams } from 'react-router-dom';
import { Post } from '../../types/post.type'; // Import Post type
import { Comment } from '../../types/comment.type'; // Import Comment type
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth for comment submission
import { useQueryClient } from '@tanstack/react-query';
import { commentQueryKeys } from '../../consts';
import { Edit, Delete } from '@mui/icons-material'; // Import the Edit and Delete icons

export default function PostDetail() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null); // Use Post type
    const [comments, setComments] = useState<Comment[]>([]); // Use Comment array for storing comments
    const [commentText, setCommentText] = useState('');
    const [editCommentId, setEditCommentId] = useState<string | null>(null); // Store ID of comment being edited
    const [editCommentText, setEditCommentText] = useState(''); // Store the comment text being edited
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<any | null>(null); // Track the logged-in user

    const queryClient = useQueryClient();
    const auth = getAuth();

    // Track auth state using onAuthStateChanged to make sure we know when the user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Set the user state when logged in
            if (user) {
                console.log("PostDetail Firestore userId:", user.uid);
                console.log("PostDetail Firebase Auth user.uid:", user.uid);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Fetch post details and comments
    useEffect(() => {
        async function fetchPostDetails() {
            if (!postId) return;
            try {
                const postData = await getPostDetails(postId);
                setPost(postData); 
                const postComments = await getPostComments(postId);
                setComments(postComments);
                setCommentsCount(postComments.length);
            } catch (error) {
                console.error("PostDetail Fetch Error: Failed to fetch post or comments:", error);
            } finally {
                setIsLoading(false); 
            }
        }
        fetchPostDetails();
    }, [postId]);

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!commentText.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        try {
            setIsSubmitting(true);

            if (!currentUser) {
                alert("You must be logged in to comment.");
                return;
            }

            const newComment: Comment = {
                commentId: 'new-id', // This will be replaced by a real ID from the backend
                postId: postId!,
                UserId: currentUser.uid, // Current user's UID
                content: commentText,
                createdAt: new Date(),
            };
            await createComment(newComment);

            setComments((prevComments) => [...prevComments, newComment]);
            setCommentText(''); // Clear the input after submission
            queryClient.invalidateQueries({ queryKey: [commentQueryKeys.all(postId), "posts"] });

            console.log("PostDetail Comment Submitted by:", currentUser.uid);

        } catch (error) {
            console.error("PostDetail Comment Submission Error:", error);
            alert("Failed to submit comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle deleting a comment
    const handleDeleteComment = (commentId: string) => {
        console.log(`PostDetail Deleting Comment with commentId: ${commentId}`);
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    };

    // Handle editing a comment
    const handleEditComment = (commentId: string, content: string) => {
        console.log(`PostDetail Editing Comment with commentId: ${commentId}`);
        setEditCommentId(commentId);
        setEditCommentText(content);
    };

    // Save the edited comment
    const handleSaveEditComment = () => {
        console.log(`PostDetail Saving Edited Comment with commentId: ${editCommentId}`);
        setComments((prevComments) => 
            prevComments.map((comment) => 
                comment.commentId === editCommentId ? { ...comment, content: editCommentText } : comment
            )
        );
        setEditCommentId(null);
        setEditCommentText('');
    };

    if (isLoading) {
        return <Typography variant="h6">Loading post...</Typography>;
    }

    return (
        <Container>
            {post ? (
                <Box>
                    <Typography variant="h4">{post.title}</Typography>
                    <Typography variant="body1">{post.text}</Typography>
                </Box>
            ) : (
                <Typography variant="h6">Post not found</Typography>
            )}

            {/* Display comments */}
            {commentsCount > 0 ? (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Comments</Typography>
                    {comments.map((comment) => {
                        const isOwner = comment.UserId === currentUser?.uid;
                        if (isOwner) {
                            // Log debug information
                            console.log(`PostDetail Render Edit/Delete Buttons for commentId: ${comment.commentId}, authorId: ${comment.UserId}, currentUser.uid: ${currentUser?.uid}`);
                        }

                        return (
                            <Box key={comment.commentId} sx={{ mt: 2 }}>
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
                                        {comment.content} (Posted by: {comment.UserId || 'Unknown'} at {new Date(comment.createdAt).toLocaleString()})
                                    </Typography>
                                )}

                                {isOwner && ( // Check if the current user is the comment owner
                                    <Box>
                                        <IconButton color="primary" onClick={() => handleEditComment(comment.commentId, comment.content)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDeleteComment(comment.commentId)}>
                                            <Delete />
                                        </IconButton>
                                        {editCommentId === comment.commentId && (
                                            <Button onClick={handleSaveEditComment} color="primary">
                                                Save
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Typography variant="body2" sx={{ mt: 4 }}>No comments yet.</Typography>
            )}

            {/* Add a comment */}
            <Box sx={{ mt: 4 }}>
                <TextField
                    label="Add a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCommentSubmit}
                    sx={{ mt: 2 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                </Button>
            </Box>
        </Container>
    );
}
