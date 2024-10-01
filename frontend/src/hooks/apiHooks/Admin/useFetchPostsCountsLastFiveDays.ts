import { useQuery } from '@tanstack/react-query';
import { fetchPostCountsLastFiveDays } from '../../../api/apis/post.api';
import { PostCount } from '../../../types/post.type';

// Hook
export const useFetchPostCountsLastFiveDays = () => {
  return useQuery<PostCount[], Error>({
    queryKey: ['postCountsLastFiveDays'],
    queryFn: fetchPostCountsLastFiveDays, 
  });
};
