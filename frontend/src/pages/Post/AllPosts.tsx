import React from 'react';
import { useFetchPosts } from '../../hooks/apiHooks';
import { Button, Typography } from '@mui/material';
import PostItem from '../../components/PostItem';
import { Post } from '../../types/post.type';
import { useAuth } from '../../contexts';

export const AllPosts: React.FC = () => {
  
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchPosts();
  const { user } = useAuth();
 
  return (
    <div>
      <Typography variant='h4' sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
				All Posts
      </Typography>

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
    </div>
  );
};
