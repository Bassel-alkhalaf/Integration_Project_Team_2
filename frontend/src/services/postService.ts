import {
  ref,
  set,
  get,
  update,
  push,
  remove,
  query,
  limitToLast,
  orderByKey,
  startAfter,
  runTransaction,
} from 'firebase/database';
import { db } from './firebase'; // Realtime Database instance

// Define interfaces for data stored in Firebase (without 'id')
interface FirebasePostData {
  title: string;
  content: string;
  authorId: string;
  isPrivate: boolean;
  createdAt: number;
  likes?: { [userId: string]: boolean };
  totalLikes?: number;
}

interface FirebaseCommentData {
  content: string;
  authorId: string;
  createdAt: number;
}

// Interfaces for application use (includes 'id')
interface Post extends FirebasePostData {
  id: string;
  comments?: Comment[];
  authorName: string; // Now required
}

interface Comment extends FirebaseCommentData {
  id: string;
  authorName: string; // Now required
}

interface User {
  firstName: string;
  lastName: string;
}

export const postService = {
  // Create a new post
  createPost: async function (
    title: string,
    content: string,
    authorId: string,
    isPrivate: boolean = false
  ) {
    try {
      const newPostRef = push(ref(db, 'posts'));
      await set(newPostRef, {
        title,
        content,
        authorId,
        isPrivate,
        createdAt: Date.now(),
        totalLikes: 0,
        likes: {},
      });
      console.log('Post created successfully.');
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Fetch user's first and last name based on authorId
  getUserDetails: async function (authorId: string): Promise<User | null> {
    try {
      console.log('Fetching user details for authorId:', authorId);
      const userRef = ref(db, `users/${authorId}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      console.log('Fetched user data:', userData);
      if (userData) {
        return { firstName: userData.firstName, lastName: userData.lastName };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  },

  // Retrieve all posts with the last comment and fetch author name
  getPosts: async function (): Promise<Post[]> {
    try {
      const snapshot = await get(ref(db, 'posts'));
      const postsData = snapshot.val();

      if (postsData && typeof postsData === 'object') {
        const posts = postsData as { [key: string]: FirebasePostData | undefined };
        const postEntries = Object.entries(posts).filter(
          ([id, postData]) => postData !== undefined
        ) as [string, FirebasePostData][];

        const postList = await Promise.all(
          postEntries.map(async ([id, postData]) => {
            // Fetch author's full name for the post
            const postAuthorDetails = await this.getUserDetails(postData.authorId);
            const postAuthorName = postAuthorDetails
              ? `${postAuthorDetails.firstName} ${postAuthorDetails.lastName}`
              : 'Unknown';

            // Fetch the last comment
            let lastComment: Comment | null = null;
            const commentsRef = ref(db, `posts/${id}/comments`);
            const commentsQuery = query(commentsRef, orderByKey(), limitToLast(1));
            const commentsSnapshot = await get(commentsQuery);
            const commentsData = commentsSnapshot.val();

            if (commentsData && typeof commentsData === 'object') {
              const commentsObj = commentsData as {
                [key: string]: FirebaseCommentData | undefined;
              };
              const commentEntries = Object.entries(commentsObj).filter(
                ([id, commentData]) => commentData !== undefined
              ) as [string, FirebaseCommentData][];

              if (commentEntries.length > 0) {
                const [commentId, commentData] = commentEntries[0];

                // Fetch author's full name for the comment
                const commentAuthorDetails = await this.getUserDetails(commentData.authorId);
                const commentAuthorName = commentAuthorDetails
                  ? `${commentAuthorDetails.firstName} ${commentAuthorDetails.lastName}`
                  : 'Unknown';

                lastComment = {
                  id: commentId,
                  ...commentData,
                  authorName: commentAuthorName,
                };
              }
            }

            return {
              id,
              ...postData,
              comments: lastComment ? [lastComment] : [],
              authorName: postAuthorName,
            };
          })
        );

        return postList;
      } else {
        console.log('No posts found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  // Retrieve comments for a post
  getComments: async function (postId: string): Promise<Comment[]> {
    try {
      const snapshot = await get(ref(db, `posts/${postId}/comments`));
      const commentsData = snapshot.val();

      if (commentsData && typeof commentsData === 'object') {
        const comments = commentsData as { [key: string]: FirebaseCommentData | undefined };
        const commentEntries = Object.entries(comments).filter(
          ([id, commentData]) => commentData !== undefined
        ) as [string, FirebaseCommentData][];

        const commentList = await Promise.all(
          commentEntries.map(async ([id, commentData]) => {
            // Fetch author's full name for the comment
            const commentAuthorDetails = await this.getUserDetails(commentData.authorId);
            const commentAuthorName = commentAuthorDetails
              ? `${commentAuthorDetails.firstName} ${commentAuthorDetails.lastName}`
              : 'Unknown';

            return { id, ...commentData, authorName: commentAuthorName };
          })
        );

        return commentList;
      } else {
        console.log('No comments found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  // Paginate comments for a post
  getCommentsWithPagination: async function (
    postId: string,
    limit: number,
    lastCommentKey: string | null
  ): Promise<Comment[]> {
    try {
      let commentsQuery = query(
        ref(db, `posts/${postId}/comments`),
        orderByKey(),
        limitToLast(limit)
      );

      // If we have a last comment key, start after it
      if (lastCommentKey) {
        commentsQuery = query(
          ref(db, `posts/${postId}/comments`),
          orderByKey(),
          startAfter(lastCommentKey),
          limitToLast(limit)
        );
      }

      const snapshot = await get(commentsQuery);
      const commentsData = snapshot.val();

      if (commentsData && typeof commentsData === 'object') {
        const comments = commentsData as { [key: string]: FirebaseCommentData | undefined };
        const commentEntries = Object.entries(comments).filter(
          ([id, commentData]) => commentData !== undefined
        ) as [string, FirebaseCommentData][];

        const commentList = await Promise.all(
          commentEntries.map(async ([id, commentData]) => {
            // Fetch author's full name for the comment
            const commentAuthorDetails = await this.getUserDetails(commentData.authorId);
            const commentAuthorName = commentAuthorDetails
              ? `${commentAuthorDetails.firstName} ${commentAuthorDetails.lastName}`
              : 'Unknown';

            return { id, ...commentData, authorName: commentAuthorName };
          })
        );

        return commentList;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments with pagination:', error);
      return [];
    }
  },

  // Get posts meant for close friends
  getCloseFriendsPosts: async function (userId: string): Promise<Post[]> {
    try {
      const snapshot = await get(ref(db, 'posts'));
      const postsData = snapshot.val();

      if (postsData && typeof postsData === 'object') {
        const posts = postsData as { [key: string]: FirebasePostData | undefined };
        const filteredPostsArray = Object.entries(posts)
          .filter(([id, postData]) => postData !== undefined)
          .filter(([id, postData]) => {
            const postDataNonNull = postData as FirebasePostData;
            return postDataNonNull.isPrivate && postDataNonNull.authorId === userId;
          }) as [string, FirebasePostData][];

        const filteredPosts = await Promise.all(
          filteredPostsArray.map(async ([id, postData]) => {
            // Fetch author's full name for the post
            const postAuthorDetails = await this.getUserDetails(postData.authorId);
            const postAuthorName = postAuthorDetails
              ? `${postAuthorDetails.firstName} ${postAuthorDetails.lastName}`
              : 'Unknown';

            return { id, ...postData, authorName: postAuthorName };
          })
        );

        return filteredPosts;
      } else {
        console.log('No posts found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching posts for close friends:', error);
      return [];
    }
  },

  // Delete a post by ID
  deletePost: async function (postId: string) {
    try {
      const postRef = ref(db, `posts/${postId}`);
      await remove(postRef);
      console.log('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  },

  // Update a post
  updatePost: async function (postId: string, updatedPostData: Partial<FirebasePostData>) {
    try {
      await update(ref(db, `posts/${postId}`), updatedPostData);
      console.log('Post updated successfully.');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  },

  // Add a comment to a post
  addComment: async function (postId: string, commentContent: string, authorId: string) {
    try {
      const newCommentRef = push(ref(db, `posts/${postId}/comments`));
      await set(newCommentRef, {
        content: commentContent,
        authorId,
        createdAt: Date.now(),
      });
      console.log('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Delete a comment by ID
  deleteComment: async function (postId: string, commentId: string) {
    try {
      const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
      await remove(commentRef);
      console.log('Comment deleted successfully.');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  },

  // Update a comment by ID
  updateComment: async function (
    postId: string,
    commentId: string,
    updatedCommentContent: string
  ) {
    try {
      await update(ref(db, `posts/${postId}/comments/${commentId}`), {
        content: updatedCommentContent,
      });
      console.log('Comment updated successfully.');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  },

  // Like a post with atomic updates for likes count and user likes
  likePost: async function (postId: string, userId: string) {
    try {
      await runTransaction(ref(db, `posts/${postId}`), (post: any) => {
        if (post) {
          if (post.likes && post.likes[userId]) {
            // Unlike the post
            post.totalLikes--;
            delete post.likes[userId];
          } else {
            // Like the post
            post.totalLikes = (post.totalLikes || 0) + 1;
            post.likes = post.likes || {};
            post.likes[userId] = true;
          }
        }
        return post;
      });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  },

  // Get total likes for a post
  getLikes: async function (postId: string): Promise<number> {
    try {
      const totalLikesRef = ref(db, `posts/${postId}/totalLikes`);
      const snapshot = await get(totalLikesRef);
      return snapshot.val() || 0; // Return total likes or default to 0
    } catch (error) {
      console.error('Error fetching likes:', error);
      return 0; // Default to 0 in case of error
    }
  },
};
