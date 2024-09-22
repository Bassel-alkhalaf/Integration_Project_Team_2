import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../api/apis/post.api";

export const useFetchPosts = () => {

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    
  })
  //   // Flatten the pages array into a single array of posts
  // const posts: PostItemProps[] = data?.pages.flatMap((page) => page.data) || [];
  return{
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
    
  }
 

};




