// src/pages/Home.tsx
import React, { useState } from "react";
import { useFetchPosts, useCreatePost } from "../../hooks/apiHooks";
import { Post } from "../../types/post.type";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from "@mui/material";
import PostItem from "../../components/PostItem";
import UploadIcon from '@mui/icons-material/Upload';  // MUI Upload Icon



//=========================================
//Todo :
//=====
//onLike Fn, onDislike Fn, omCommentSubmit Fn
//===========================================

const Home: React.FC = () => {
  const { posts, loadMorePosts, hasMorePosts } = useFetchPosts(4);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({ text: "", images: [] as File[], visibility: "Public" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({ ...newPost, images: [...Array.from(event.target.files)] });
    }
  };

  const handleCreatePost = () => {
    useCreatePost();
    handleClose();
  };

  return (
    <div>
      <div className="post-list">
        {posts.map((post: Post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {/* Conditionally Render Load More Button */}
      {posts.length > 4 && hasMorePosts && (
        <div className="actions">
          <Button variant="outlined" color="secondary" onClick={loadMorePosts}>
            Load More
          </Button>
        </div>
      )}

      <div className="actions">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create a Post
        </Button>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <TextField
            label="Post Text"
            fullWidth
            multiline
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          />

          {/* Upload Images */}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-images"
            multiple
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-images">
            <IconButton color="primary" aria-label="upload pictures" component="span">
              <UploadIcon />
            </IconButton>
          </label>

          {/* Show Selected Images */}
          {newPost.images.map((image, idx) => (
            <div key={idx}>
              {image.name}
            </div>
          ))}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreatePost} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;

