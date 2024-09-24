// src/api/apis/post.api.ts
import { sendRequest } from './request';
import { Post } from '../../types/post.type';
import { POST_ENDPOINT } from '../endpoints';

// Fetch all posts with pagination
export const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const url = `${POST_ENDPOINT}?limit=5&page=${pageParam}`;
  const res = await sendRequest({
    endpoint: url,
    method: 'GET',
  });

  return res;
};

// Create a new post
export const createPostRequest = async (postData: Post) => {
  return sendRequest({
    endpoint: `${POST_ENDPOINT}/create`,
    method: 'POST',
    body: postData,
  });
};

// Delete a post
export const deletePostRequest = async (postId: string) => {
  const res = await sendRequest({
    endpoint: `${POST_ENDPOINT}/delete/${postId}`,
    method: 'DELETE',
  });

  return res.data.message;
};

// Edit an existing post
export const editPostRequest = async (postData: Post) => {
  return sendRequest({
    endpoint: `${POST_ENDPOINT}/${postData.postId}`, // Assuming postData contains the post ID
    method: 'PUT',
    body: postData,
  });
};

// Fetch post details
export const getPostDetails = async (postId: string) => {
  const url = `${POST_ENDPOINT}/${postId}`;
  const res = await sendRequest({ method: 'GET', endpoint: url });
  return res.data;
};
