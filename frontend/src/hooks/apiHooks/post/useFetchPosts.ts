import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../api/apis/post.api";
import { Post } from "../../../types/post.type";
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useFetchPosts = (initialLimit: number) => {
  const errorHandler = useGenericErrHandler();
  const [limit, setLimit] = useState(initialLimit);

  // Fetch posts using useQuery
  const { data: posts = [], isLoading, isError } = useQuery<Post[], Error>(
    ['posts', limit],
    () => fetchPosts(limit),
    {
      keepPreviousData: true,
      onError: (error: Error) => {
        errorHandler(error);
      },
    }
  );

  // Function to load more posts
  const loadMorePosts = () => {
    setLimit((prev) => prev + 4); // Adjust the number as needed
  };



  // Determine if there are more posts to load
  const hasMorePosts = posts.length === limit; // Example logic; adjust based on your data source

  return {
    posts,
    isLoading,
    isError,
    loadMorePosts,
    hasMorePosts,
  };
};