import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Accordion,
  Avatar,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  ExpandMore,
  Delete,
} from "@mui/icons-material";
import { Post } from '../types/post.type';
import { useDeletePost } from "../hooks/apiHooks/post/useDeletePost";

interface PostProps {
  post: Post;
}
const isOwner = false;
const PostItem: React.FC<PostProps> = ({ post }) => {
  const { mutate: deletePost } = useDeletePost();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleDelete = () => {
    deletePost(post.id);
  };

  const toggleLike = () => {
    setLiked(prev => !prev);
    if (disliked) setDisliked(false); // Unselect dislike if like is pressed
  };

  const toggleDislike = () => {
    setDisliked(prev => !prev);
    if (liked) setLiked(false); // Unselect like if dislike is pressed
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentInput = e.currentTarget.elements.namedItem("comment") as HTMLInputElement;
    if (commentInput) {
      // Handle comment submission
      commentInput.value = ""; // Clear input after submission
    }
  };

  return (
    <Card sx={{ marginBottom: 2, padding: 2 }}>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Avatar src={post.authorImg} alt={post.authorName} sx={{ marginRight: 2 }} />
          <Typography variant="h6">{post.authorName}</Typography>
        </div>
        <Typography variant="body2" color="textSecondary">
          {post.text}
        </Typography>
        {post.images?.length ? (
          <div style={{ marginTop: 10 }}>
            {post.images.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`Post image ${index}`} style={{ maxWidth: "100%" }} />
            ))}
          </div>
        ) : null}
        <Typography variant="caption" color="textSecondary">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
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
            {post.likeCount}
          </Typography>
        </IconButton>
        {isOwner && (
          <IconButton onClick={handleDelete} aria-label="delete">
            <Delete />
          </IconButton>
        )}
      </CardActions>
      <Accordion sx={{ width: '100%', marginTop: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Comments ({post.commentCount})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              name="comment"
              placeholder="Add a comment..."
              required
              style={{ width: '80%', marginRight: '8px' }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default PostItem;
