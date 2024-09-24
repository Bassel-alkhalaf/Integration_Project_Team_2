import { sendRequest } from "./request";
import { Post } from "../../types/post.type";
import { POST_ENDPOINT } from "../endpoints";
import { EditPostData } from "../../types/editPost.type";

const LIMIT = 5;

// Fetch all posts with pagination
export const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const url = `${POST_ENDPOINT}?limit=${LIMIT}&page=${pageParam}`;
  const res = await sendRequest({
    endpoint: url,
    method: "GET",
  });

  return res;
};

// Create a new post
export const createPostRequest = async (postData: Post) => {
  return sendRequest({
    endpoint: "posts/create",
    method: "POST",
    body: postData,
  });
};

// Delete a post
export const deletePostRequest = async (postId: string) => {
  const res = await sendRequest({
    endpoint: `posts/delete/${postId}`,
    method: "DELETE",
  });

  return res.data.message;
};

// Edit an existing post
export const editPostRequest = async (data: EditPostData) => {
  return sendRequest({
    endpoint: `posts/${data.postId}`, 
    method: "PUT", 
    body: data,
  });
};
