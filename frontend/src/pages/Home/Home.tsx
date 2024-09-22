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
    postId: '',
    authorId: '', // Assign this when creating the post
    title: '',
    text: '',
    images: [],
    authorName: '', // Assign this when creating the post
    authorImg: '', // Assign this when creating the post
    createdAt: new Date(),
    updatedAt: undefined,
    commentCount: 0,
    likeCount: 0,
    dislikeCount:0,
    visibility: 'public',
  });

  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({ ...newPost, images: [...Array.from(event.target.files)].map(file => URL.createObjectURL(file)) });
    }
  };

  const handleCreatePost = () => {
    const postData: Post = {
      ...newPost,
      postId:'',
      authorId: 'your-author-postId', // Replace with actual logic to get the author ID
      authorName: 'Your Name', // Replace with actual logic to get the author's name
      authorImg: 'default-image-url', // Replace with actual logic to get the author's image
    };
    console.log(postData);
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
                    <PostItem key={i} post={post} />
                    
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
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            label="Post text"
            fullWidth
            multiline
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          />

          {/* visibility Dropdown */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="visibility-label">visibility</InputLabel>
            <Select
              labelId="visibility-label"
              value={newPost.visibility}
              onChange={(e) => setNewPost({ ...newPost, visibility: e.target.value as Post['visibility'] })}
              label="visibility"
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="friends">Friends</MenuItem>
            </Select>
          </FormControl>

          {/* Upload images */}
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

          {/* Show Selected images */}
          {newPost.images?.map((image, idx) => (
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
