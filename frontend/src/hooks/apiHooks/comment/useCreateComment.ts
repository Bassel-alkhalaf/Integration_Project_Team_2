// hooks/apiHooks/comment/useCreateComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../../api/apis/comment.api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
import { AxiosError } from 'axios';
import { Comment } from '../../../types/comment.type';

export const useCreateComment = () => {
  const errorHandler = useGenericErrHandler();
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: (commentData: Comment) => createComment(commentData),
    onError: (err: AxiosError) => {
      console.error('Error creating comment:', err);
      errorHandler(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    }
   
  });
};
