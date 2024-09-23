
import { useMutation } from "@tanstack/react-query";
import { editPostRequest } from "../../../api/apis/post.api";
import { Post } from "../../../types/post.type";
import { useGenericErrHandler } from "../../errorHandler/useGenericErrHandler";
import { AxiosError } from "axios";

export const useEditPost = () => {
  const errorHandler = useGenericErrHandler();

  return useMutation({
    mutationFn: (postData: Post) => editPostRequest(postData),
    onError: (err: AxiosError) => {
      console.error(err);
      errorHandler(err);
    },
  });
};