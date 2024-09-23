// src/hooks/useDeletePost.ts
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';
import { deletePostRequest } from "../../../api/apis/post.api";

export const useDeletePost = () => {
  const errorHandler = useGenericErrHandler();

  return useMutation<string, AxiosError, string>({
    mutationFn: (postId: string) => deletePostRequest(postId),
    onError: (err) => {
      console.error(err);
      errorHandler(err);
    },
    
  });
};

