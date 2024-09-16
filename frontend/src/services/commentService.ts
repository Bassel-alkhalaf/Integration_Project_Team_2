import { ref, set, get, push, child } from 'firebase/database';
import { db } from './firebase'; // Import initialized Realtime Database

export const commentService = {
  addComment: async (postId: string, content: string) => {
    try {
      // Generate a new comment key using the `push` method
      const newCommentRef = push(ref(db, 'comments/' + postId));
      
      // Set the comment data
      await set(newCommentRef, {
        postId,
        content,
        createdAt: Date.now()
      });
      
      console.log('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },

  getComments: async (postId: string) => {
    try {
      // Reference the comments node for a specific post
      const commentsRef = ref(db, 'comments/' + postId);
      
      // Fetch the comments
      const snapshot = await get(commentsRef);
      
      if (snapshot.exists()) {
        // Return the comments as an array of objects
        const comments = snapshot.val();
        return Object.values(comments); // Convert object of comments to an array
      } else {
        console.log('No comments available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }
};
