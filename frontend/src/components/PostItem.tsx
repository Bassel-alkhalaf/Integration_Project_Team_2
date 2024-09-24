import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Comment,
  Delete,
  Edit,
  ExpandMore,
} from "@mui/icons-material";
import { Post } from '../types/post.type';
import { useDeletePost } from "../hooks/apiHooks/post/useDeletePost";
import { useEditPost } from "../hooks/apiHooks/post/useEditPost"; // Assuming you have an edit hook
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import EditPostDialogue from "./EditPostDialogue";
import { EditPostData } from "../types/editPost.type";

interface PostProps {
  post: Post;
  userId: string;
}



const PostItem: React.FC<PostProps> = ({ post, userId }) => {

  const { mutate: deletePost } = useDeletePost();
  const { mutate: editPost } = useEditPost(); // Assuming you have this hook
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postImages, setPostImages] = useState(post.images || []);
  const [isCommentsOpen, setCommentsOpen] = useState(false); // State for accordion open/close
  const queryClient = useQueryClient();


 
  const isOwner = userId === post.authorId; // Check if the user owns the post


  const handleDelete = () => {
    deletePost(post.postId, {
      onSuccess: () => {
        enqueueSnackbar('Post deleted successfully!', {
          variant: 'success',
        })
        setDeleteDialogOpen(false); // Close confirmation dialog after deletion
      },
    });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

   // Handle submitting edited post data
   const handleEditSubmit = (data: { title: string; text: string; images?: string[] }) => {
    const updatedPost: EditPostData = {
      postId: post.postId,
      title: data.title,
      text: data.text,
      images: data.images,
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

  const toggleLike = () => {
    setLiked(prev => !prev);
    if (disliked) setDisliked(false); // Unselect dislike if like is pressed
  };

  const toggleDislike = () => {
    setDisliked(prev => !prev);
    if (liked) setLiked(false); // Unselect like if dislike is pressed
  };

  const toggleComments = () => {
    setCommentsOpen(prev => !prev); // Toggle comments accordion
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
        <Typography variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
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
        <IconButton onClick={toggleLike} aria-label="like" sx={{ color: liked ? 'blue' : 'inherit' }}>
          <ThumbUp />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {post.likeCount}
          </Typography>
        </IconButton>
        <IconButton onClick={toggleDislike} aria-label="dislike" sx={{ color: disliked ? 'red' : 'inherit' }}>
          <ThumbDown />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {post.dislikeCount}
          </Typography>
        </IconButton>
        <IconButton onClick={toggleComments} aria-label="comments" sx={{ marginLeft: 'auto' }}>
          <Comment />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {post.commentCount}
          </Typography>
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
      <Accordion expanded={isCommentsOpen} sx={{ width: '100%', marginTop: 1 }}>
        <AccordionSummary>
          <Typography>Comments ({post.commentCount})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={() => {}} style={{ width: '100%' }}>
            <input
              type="text"
              name="comment"
              placeholder="Add a comment..."
              required
              style={{ width: '80%', marginRight: '8px', height:'2.1rem' }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
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
          <Button onClick={() => handleDelete()} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostItem;
