// src/pages/Home.tsx

import React, { useMemo, useState } from 'react';
import { useFetchPosts, useCreatePost } from '../../hooks/apiHooks';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Stack } from '@mui/material';
import PostItem from '../../components/PostItem';
import UploadIcon from '@mui/icons-material/Upload';
import { Post } from '../../types/post.type';
import { UserCommunitySelect } from '../../components/UserCommunitySelect';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useAuth } from '../../contexts';


export const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchPosts();
  const { mutate: createPost } = useCreatePost();
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState<Post>({
    postId: '',
    authorId: '',
    communityId: '',
    title: '',
    text: '',
    images: [],
    authorName: '',
    authorImg: '',
    createdAt: new Date(),
    updatedAt: undefined,
    commentCount: 0,
    likeCount: 0,
    dislikeCount: 0,
    visibility: 'public',
  });

  const { user } = useAuth();
  const authorInfo = useMemo(() => { return { authorId: user?.id || '', authorName: `${user?.firstName || ''} ${user?.lastName || ''}`} }, [user]);
  const {authorId, authorName} =  authorInfo;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({ ...newPost, images: [...Array.from(event.target.files)].map(file => URL.createObjectURL(file)) });
    }
  };

  // Handle creating a new post
  const handleCreatePost = () => {
    const postData: Post = {
      ...newPost,
      postId: '', // New post, so no postId yet
      authorId,
      authorName,
      authorImg: 'default-image-url', // Replace with actual user image if available
    };
    createPost(postData, {
      onSuccess: () => {
        enqueueSnackbar('Post created successfully!', {
          variant: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    });
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
                  <PostItem key={post.postId} post={post} userId={authorId} /> // Pass userId to PostItem
                ))
              ) : (
                <p>No posts in this group.</p>
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
      <Dialog open={open} onClose={handleClose} fullWidth>
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
              <InputLabel id="visibility-label">Visibility</InputLabel>
              <Select
                labelId="visibility-label"
                value={newPost.visibility}
                onChange={(e) => setNewPost({ ...newPost, visibility: e.target.value })}
                label="Visibility"
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
              <div key={idx}>
                <img src={image} alt={`upload-preview-${idx}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
              </div>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleCreatePost} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
