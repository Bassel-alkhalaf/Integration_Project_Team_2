import { useMutation } from '@tanstack/react-query';
import { deleteComment } from '../../../api/apis/comment.api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
import { AxiosError } from 'axios';

// The hook to delete a comment
export const useDeleteComment = () => {
  const errorHandler = useGenericErrHandler();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onError: (err: AxiosError) => {
      console.error(err);
      errorHandler(err); // Handles the error using your generic error handler
    },
  });
};
