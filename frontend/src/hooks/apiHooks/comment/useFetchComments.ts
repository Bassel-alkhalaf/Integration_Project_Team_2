import { useQuery } from '@tanstack/react-query';
import { getPostComments } from '../../../api/apis/comment.api'; // Adjust path if needed
import { AxiosError } from 'axios';

export const useFetchComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getPostComments(postId),
    retry: false, // Prevents retry on failure
    staleTime: 300000, // Cache data for 5 minutes (optional)
    // cacheTime: 600000, // Removed as it may not be supported in newer versions
  });
};
