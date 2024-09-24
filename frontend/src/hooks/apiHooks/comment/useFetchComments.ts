import { useQuery } from '@tanstack/react-query';
import { getPostComments } from '../../../api/apis/comment.api'; // Adjust path if needed


export const useFetchComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getPostComments(postId),
    retry: false, // Prevents retry on failure
    
  });
};
