// hooks/apiHooks/comment/useCreateComment.ts
import { useMutation } from '@tanstack/react-query';
import { createComment } from '../../../api/apis/comment.api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
import { AxiosError } from 'axios';

export const useCreateComment = () => {
  const errorHandler = useGenericErrHandler();

  return useMutation({
    mutationFn: (commentData: { postId: string; content: string }) => createComment(commentData),
    onError: (err: AxiosError) => {
      console.error('Error creating comment:', err);
      errorHandler(err);
    },
  });
};
