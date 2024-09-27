import React, { useMemo, useState } from 'react';
import { useFetchPosts } from '../../hooks/apiHooks';
import { Button } from '@mui/material';
import PostItem from '../../components/PostItem';
import { Post } from '../../types/post.type';

import { useAuth } from '../../contexts';
import { CreatePostDialog } from '../../components/CreatePostDialogue';


export const Home: React.FC = () => {
  
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchPosts();
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const authorInfo = useMemo(() => { return { authorId: user?.id || '', authorName: `${user?.firstName || ''} ${user?.lastName || ''}`} }, [user]);
  const {authorId, authorName} =  authorInfo;
  const handleOpen = () => setOpen(true);
 const handleClose = () => setOpen(false);

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
                  <PostItem key={post.postId} post={post} user={user} /> // Pass userId to PostItem
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
      <CreatePostDialog
        authorName={authorName} // Replace with dynamic data
        authorId={authorId} open={open} onClose={handleClose}/>
    </div>
  );
};
