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
    endpoint: `${POST_ENDPOINT}/${postData.postId}`, 
    method: "PUT", 
    body: postData,  // Make sure 'postData' includes all necessary fields
  });
};

// Fetch Post details
export const getPostDetails = async (postId: string) => {
  const url = `${POST_ENDPOINT}/${postId}`;
  const res = await sendRequest({ method: 'GET', endpoint: url });
  return res.data;
};


// Fetch posts by date
// Fetch posts by date
export const fetchPostsByDate = async (selectedDate: string): Promise<Post[]> => {
  try {
    const url = `${POST_ENDPOINT}/by-date?date=${selectedDate}`;
    const res = await sendRequest({
      endpoint: url,
      method: 'GET',
    });
    
    console.log("Fetched posts: ", res.data); // Add this to log the fetched posts

    return res.data;
  } catch (error) {
    console.error("Error fetching posts by date: ", error); // Log any errors
    throw new Error("Failed to fetch posts by date.");
  }
};
