// src/pages/Home.tsx
import React, { useState } from 'react';
import { useFetchPosts, useCreatePost } from '../../hooks/apiHooks';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import PostItem from '../../components/PostItem';
import UploadIcon from '@mui/icons-material/Upload';
import { Post } from '../../types/post.type'; // Adjust the import based on your file structure

const Home: React.FC = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchPosts();
  const { mutate: createPost } = useCreatePost();
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState<Post>({
    PostId: '',
    AuthorId: '', // Assign this when creating the post
    Title: '',
    Text: '',
    Images: [],
    AuthorName: '', // Assign this when creating the post
    AuthorImg: '', // Assign this when creating the post
    CreatedAt: new Date(),
    UpdatedAt: undefined,
    CommentCount: 0,
    LikeCount: 0,
    DislikeCount:0,
    Visibility: 'public',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({ ...newPost, Images: [...Array.from(event.target.files)].map(file => URL.createObjectURL(file)) });
    }
  };

  const handleCreatePost = () => {
    const postData: Post = {
      ...newPost,
       
      AuthorId: 'your-author-PostId', // Replace with actual logic to get the author ID
      AuthorName: 'Your Name', // Replace with actual logic to get the author's name
      AuthorImg: 'default-image-url', // Replace with actual logic to get the author's image
    };
    createPost(postData);
    handleClose();
  };

  return (
    <div>
        <div className="post-list">
          {(!data || !data.pages || data.pages.length === 0) ? (
            <div style={{ textAlign: 'center', margin: '20px' }}>
              <p>No posts available. Be the first to create a post!</p>
            </div>
          ) : (
            data.pages.map((group, i) => (
              <React.Fragment key={i}>
                {Array.isArray(group.data) && group.data.length > 0 ? (
                  group.data.map((post: Post) => (
                    <PostItem key={post.PostId} post={post} />
                  ))
                ) : (
                  <p>No posts in this group.</p> // Optional message for empty groups
                )}
              </React.Fragment>
            ))
          )}
        </div>

      {/* Load More Posts */}
      {hasNextPage && data && data.pages && data.pages.length > 0 && (
        <div className="actions">
          <Button variant="outlined" color="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Create Post Button */}
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
            label="Post Title"
            fullWidth
            value={newPost.Title}
            onChange={(e) => setNewPost({ ...newPost, Title: e.target.value })}
          />
          <TextField
            label="Post Text"
            fullWidth
            multiline
            value={newPost.Text}
            onChange={(e) => setNewPost({ ...newPost, Text: e.target.value })}
          />

          {/* Visibility Dropdown */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="Visibility-label">Visibility</InputLabel>
            <Select
              labelId="Visibility-label"
              value={newPost.Visibility}
              onChange={(e) => setNewPost({ ...newPost, Visibility: e.target.value as Post['Visibility'] })}
              label="Visibility"
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="friends">Friends</MenuItem>
            </Select>
          </FormControl>

          {/* Upload Images */}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-Images"
            multiple
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-Images">
            <IconButton color="primary" aria-label="upload pictures" component="span">
              <UploadIcon />
            </IconButton>
          </label>

          {/* Show Selected Images */}
          {newPost.Images?.map((image, idx) => (
            <div key={idx}>{image}</div>
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
