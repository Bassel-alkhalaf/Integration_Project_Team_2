import React from "react";
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
  Image,
} from "@mui/icons-material";
import { PostItemProps  } from '../types/postItemProp.type';
import { useDeletePost } from "../hooks/apiHooks/post/useDeletePost";



const PostItem: React.FC<PostItemProps> = ({
  post,
  onLike,
  onDislike,
  onCommentSubmit,
  isOwner,
}) => {
  const { mutate: deletePost, isLoading } = useDeletePost(); 

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentInput = e.currentTarget.elements.namedItem(
      "comment"
    ) as HTMLInputElement; // Safely access the form elements
    if (commentInput) {
      // onCommentSubmit(commentInput.value);
      commentInput.value = "";
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Avatar
            src={post.authorImg}
            alt={post.authorName}
            sx={{ marginRight: 2 }}
          />
          <Typography variant="h6">{post.authorName}</Typography>
        </div>
        <Typography variant="body2" color="textSecondary">
          {post.text}
        </Typography>
        {post.images?.length ? ( // Safely checking if images exist
          <div style={{ marginTop: 10 }}>
            {post.images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Post image ${index}`}
                style={{ maxWidth: "100%" }}
              />
            ))}
          </div>
        ) : null}
        <Typography variant="caption" color="textSecondary">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={onLike} aria-label="like">
          <ThumbUp />
        </IconButton>
        <IconButton onClick={onDislike} aria-label="dislike">
          <ThumbDown />
        </IconButton>
        {isOwner && (
          <IconButton onClick={handleDelete} disabled={isLoading} aria-label="delete">
          <Delete />
        </IconButton>
        )}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Comments ({post.commentCount})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Render comments */}
            <Button
              variant="outlined"
              startIcon={<Image />}
              style={{ marginBottom: 8 }}
            >
              Upload Image
            </Button>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="comment"
                placeholder="Add a comment..."
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </AccordionDetails>
        </Accordion>
      </CardActions>
    </Card>
  );
};

export default PostItem;
