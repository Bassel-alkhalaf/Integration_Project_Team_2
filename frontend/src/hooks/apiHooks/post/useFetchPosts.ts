import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../../api/apis/post.api";
import { postQueryKeys } from "../../../consts";

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
    queryKey: postQueryKeys.all(),
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




