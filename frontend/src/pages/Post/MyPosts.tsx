import React from "react";
import PostItem from "../../components/PostItem";
import { useAuth } from "../../contexts";
import { useFetchOnlyMePosts } from "../../hooks/apiHooks/post/useFetchOnlyMePosts";

export const MyPosts: React.FC = () => {
  const { user } = useAuth();
  if (user?.id == null) {
    return <div>Error: User ID is required.</div>;
  }
  const userId = user?.id;

  const res = useFetchOnlyMePosts(userId);
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
    </div>
  );
};
