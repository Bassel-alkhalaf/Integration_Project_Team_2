import React, { useMemo, useState } from 'react';
import { Button } from '@mui/material';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../contexts';
import { CreatePostDialog } from '../../components/CreatePostDialogue';
import { useFetchPrivatePosts } from '../../hooks/apiHooks/post/useFetchPrivateposts';


export const Home: React.FC = () => {
  

  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const authorInfo = useMemo(() => { return { authorId: user?.id || '', authorName: `${user?.firstName || ''} ${user?.lastName || ''}`} }, [user]);
  const {authorId, authorName} =  authorInfo;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const res = useFetchPrivatePosts(user?.id!);
  return (
    <div>
      <div className="post-list">
      {!res || res.data?.data.length == 0 ? (
          <div style={{ textAlign: "center", margin: "20px" }}>
            <p>No posts available. Be the first to create a post!</p>
          </div>
        ) : (
          res.data?.data.map((post) => (
            <PostItem key={post.postId} post={post} user={user} />
          ))
        )}
      </div>

    

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
