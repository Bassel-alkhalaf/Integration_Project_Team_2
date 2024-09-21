import { sendRequest } from './request';
import { Post } from "../../types/post.type";
import { POST_ENDPOINT } from '../endpoints';

// Fetch all posts with pagination
export const fetchPosts = async (limit: number): Promise<Post[]> => {

  const url = `${POST_ENDPOINT}?limit=${limit}`
    const res = await sendRequest({
      endpoint: url,
      method: 'GET',
    });

    return res.data as Post[];
  };
  
  // Create a new post
  export const createPostRequest = async (postData: Post) => {
    return sendRequest({
      endpoint: 'posts/create',
      method: 'POST',
      body: postData,
    });
  };
  
  // Delete a post
  export const deletePostRequest = async (postId: string) => {
    const res = await sendRequest({
      endpoint: `posts/delete/${postId}`,
      method: 'DELETE',
    });

    return res.data.message;
  };