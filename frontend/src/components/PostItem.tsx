import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { ThumbUp, ThumbDown, Comment, Delete, Edit, ExpandMore } from "@mui/icons-material";
import { Post } from "../types/post.type";
import { useDeletePost } from "../hooks/apiHooks/post/useDeletePost";
import { useEditPost } from "../hooks/apiHooks/post/useEditPost"; 
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import EditPostDialogue from "./EditPostDialogue";
import { EditPostData } from "../types/editPost.type";
import { Link, useNavigate } from "react-router-dom";
import CommentSection from "./CommentSection";

interface PostProps {
  post: Post;
  userId: string;
}

const PostItem: React.FC<PostProps> = ({ post, userId }) => {
  const navigate = useNavigate();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: editPost } = useEditPost();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postImages, setPostImages] = useState(post.images || []);
  const [isCommentsOpen, setCommentsOpen] = useState(false); // State for accordion open/close
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedText, setEditedText] = useState(post.text);

  const queryClient = useQueryClient();
  const isOwner = userId === post.authorId; // Check if the user owns the post

  // Handle deletion of a post
  const handleDelete = () => {
    deletePost(post.postId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        enqueueSnackbar("Post deleted successfully!", { variant: "success" });
        setDeleteDialogOpen(false); // Close confirmation dialog after deletion
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  };

  // Handle submitting edited post data
  const handleEditSubmit = (data: { title: string; text: string; images?: string[] }) => {
    const updatedPost: Post = {
      ...post, // Spread existing post object to retain unchanged fields
      title: data.title,
      text: data.text,
      images: data.images || post.images, // Keep existing images if no new ones are provided
      updatedAt: new Date(),
    };
    editPost(updatedPost, {
      onSuccess: () => {
        enqueueSnackbar("Post updated successfully!", { variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        setEditDialogOpen(false); // Close the dialog after successful edit
      },
    });
  };

  // Toggle like status
  const toggleLike = () => {
    setLiked((prev) => !prev);
    if (disliked) setDisliked(false);
  };

  // Toggle dislike status
  const toggleDislike = () => {
    setDisliked((prev) => !prev);
    if (liked) setLiked(false);
  };

  // Toggle comments section visibility
  const toggleComments = () => {
    setCommentsOpen((prev) => !prev);
  };

  // Navigate to PostDetail.tsx when title or text is clicked
  const navigateToPostDetail = () => {
    if (post.postId) {
      navigate(`/posts/${post.postId}`);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...postImages];
    updatedImages.splice(index, 1); // Remove the image at the specified index
    setPostImages(updatedImages);
  };

  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Avatar src={post.authorImg} alt={post.authorName} sx={{ marginRight: 2 }} />
          <Typography variant="h6">{post.authorName}</Typography>
        </div>
        {/* Clicking on the title or text navigates to PostDetail */}
        <Typography
          variant="h5"
          gutterBottom
          onClick={navigateToPostDetail}
          sx={{ cursor: "pointer" }} // Make it clickable
        >
          {post.title}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          onClick={navigateToPostDetail}
          sx={{ cursor: "pointer" }} // Make it clickable
        >
          {post.text}
        </Typography>
        {postImages?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {postImages.map((imgUrl: string, index: number) => (
              <img key={index} src={imgUrl} alt={`Post image ${index}`} style={{ maxWidth: "100%" }} />
            ))}
          </div>
        )}
        <Typography variant="caption" color="textSecondary">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        {post.updatedAt && (
          <Typography variant="caption" color="textSecondary">
            {" | Updated on " + new Date(post.updatedAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <IconButton onClick={toggleLike} aria-label="like" sx={{ color: liked ? "blue" : "inherit" }}>
          <ThumbUp />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {post.likeCount}
          </Typography>
        </IconButton>
        <IconButton onClick={toggleDislike} aria-label="dislike" sx={{ color: disliked ? "red" : "inherit" }}>
          <ThumbDown />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {post.dislikeCount}
          </Typography>
        </IconButton>
        {/* Clicking the comments icon will toggle the comments section */}
        <IconButton onClick={toggleComments} aria-label="comments" sx={{ marginLeft: "auto" }}>
          <Comment />
        </IconButton>
        {isOwner && (
          <>
            <IconButton onClick={() => setEditDialogOpen(true)} aria-label="edit">
              <Edit />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} aria-label="delete">
              <Delete />
            </IconButton>
          </>
        )}
      </CardActions>

      {/* Comments Accordion */}
      <Accordion expanded={isCommentsOpen} sx={{ width: "100%", marginTop: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />} onClick={toggleComments}>
          <Typography>Comments ({post.commentCount})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Fetch comments from the database */}
          <CommentSection postId={post.postId} />
          {/* If more than 3 comments, show "View All Comments" button */}
          {post.commentCount > 3 && (
            <Button component={Link} to={`/posts/${post.postId}`} variant="outlined">
              View All Comments
            </Button>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Edit Post Dialog */}
      <EditPostDialogue
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        images={postImages}
        removeImage={removeImage}
        handleEditSubmit={handleEditSubmit}
        title={post.title}
        text={post.text}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostItem;
