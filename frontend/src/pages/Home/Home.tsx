// src/pages/Home.tsx

import React, { useState } from 'react';
import { useFetchPosts, useCreatePost } from '../../hooks/apiHooks';
import { Button } from '@mui/material';
import PostItem from '../../components/PostItem';
import { Post } from '../../types/post.type';
import { CreatePostDialog } from '../../components/CreatePostDialogue'; // Import the form
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';


export const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchPosts();
  const { mutate: createPost } = useCreatePost();
  const [open, setOpen] = useState(false);
  const user1:string | null= localStorage.getItem("user")
  const userObj = user1 !== null ?  JSON.parse(user1) : null;
  const authorId = userObj._id;
  const authorName = `${userObj.firstName} ${userObj.lastName}`;


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePost = (post: Post) => {
    console.log(post);
    createPost(post, {
      onSuccess: () => {
        enqueueSnackbar('Post created successfully!', { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    });
  };

  return (
    <div>
      <div className="post-list">
        {!data || !data.pages || data.pages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: '20px' }}>
            <p>No posts available. Be the first to create a post!</p>
          </div>
        ) : (
          data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {Array.isArray(group.data) && group.data.length > 0 ? (
                group.data.map((post: Post) => (
                  <PostItem key={post.postId} post={post} userId={userObj._id} />
                ))
              ) : (
                <p>No posts in this group.</p>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {hasNextPage && data && data.pages && data.pages.length > 0 && (
        <div className="actions">
          <Button variant="outlined" color="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      <div className="actions">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create a Post
        </Button>
      </div>

      {/* Use the PostCreationForm component */}
      <CreatePostDialog open={open} onClose={handleClose} onCreatePost={handleCreatePost} authorId={authorId} authorName={authorName} />
    </div>
  );
};
