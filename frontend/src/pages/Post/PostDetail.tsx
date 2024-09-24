import { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { createComment, getPostComments } from '../../api/apis/comment.api'; // Adjust the path as needed
import { getPostDetails } from '../../api/apis/post.api'; // Adjust the path as needed
import { useParams } from 'react-router-dom';
import { Post } from '../../types/post.type'; // Import Post type
import { Comment } from '../../types/comment.type'; // Import Comment type
import { getAuth } from "firebase/auth"; // Firebase Auth for comment submission

export default function PostDetail() {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null); // Use Post type
    const [comments, setComments] = useState<Comment[]>([]); // Use Comment array for storing comments
    const [commentText, setCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch post details and comments
    useEffect(() => {
        async function fetchPostDetails() {
            if (!postId) return;
            try {
                const postData = await getPostDetails(postId);
                setPost(postData.post); // Assuming getPostDetails returns { post, comments }
                const postComments = await getPostComments(postId);
                setComments(postComments);
            } catch (error) {
                console.error("Failed to fetch post or comments:", error);
            } finally {
                setIsLoading(false); // Ensure loading state is turned off
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

            // Ensure the user is authenticated
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to comment.");
                return;
            }

            const commentPayload = {
                postId: postId!, // Assert postId exists
                content: commentText,
            };

            await createComment(commentPayload); // Call API to create a comment
            const newComment: Comment = {
                commentId: 'new-id', // This will be replaced by a real ID from the backend
                postId: postId!,
                authorId: user.uid, // Current user's UID
                text: commentText,
                createdAt: new Date(),
            };

            // Update comments state with the newly created comment
            setComments((prevComments) => [...prevComments, newComment]);
            setCommentText(''); // Clear the input after submission
        } catch (error) {
            console.error("Failed to submit comment:", error);
            alert("Failed to submit comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
            {comments.length > 0 ? (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Comments</Typography>
                    {comments.map((comment) => (
                        <Box key={comment.commentId} sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                {comment.text} (Posted by: {comment.authorId} at {new Date(comment.createdAt).toLocaleString()})
                            </Typography>
                        </Box>
                    ))}
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
