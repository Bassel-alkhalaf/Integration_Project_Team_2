// src/components/PostCreationForm.tsx

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { Post } from '../types/post.type'; // Adjust the path if needed
import { UserCommunitySelect } from './UserCommunitySelect';


interface PostCreationFormProps {
  open: boolean;
  onClose: () => void;
  onCreatePost: (post: Post) => void;
  authorName: string; 
  authorId: string;
}

export const CreatePostDialog: React.FC<PostCreationFormProps> = ({ open, onClose, onCreatePost, authorName, authorId }) => {
  const [newPost, setNewPost] = useState<Post>({
    postId: '',
    authorId: authorId, 
    communityId: '',
    title: '',
    text: '',
    images: [],
    authorName: authorName, 
    authorImg: '', 
    createdAt: new Date(),
    updatedAt: undefined,
    commentCount: 0,
    likeCount: 0,
    dislikeCount: 0,
    visibility: 'public',
  });
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({ ...newPost, images: [...Array.from(event.target.files)].map(file => URL.createObjectURL(file)) });
    }
  };

  const handleSubmit = () => {
    const postData: Post = {
      ...newPost,
      authorImg: 'default-image-url', // Update this with the actual logic
    };
    onCreatePost(postData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create a Post</DialogTitle>
      <DialogContent>
        <Stack gap={2} py={1}>
          <UserCommunitySelect communityId={newPost.communityId} setCommunityId={setNewPost} />
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

          {newPost.images?.map((image, idx) => (
            <div key={idx}>{image}</div>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
