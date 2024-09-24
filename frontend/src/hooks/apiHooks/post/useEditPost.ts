
import { useMutation } from "@tanstack/react-query";
import { editPostRequest } from "../../../api/apis/post.api";
import { Post } from "../../../types/post.type";
import { useGenericErrHandler } from "../../errorHandler/useGenericErrHandler";
import { AxiosError } from "axios";
import { EditPostData } from "../../../types/editPost.type";

export const useEditPost = () => {
  const errorHandler = useGenericErrHandler();

  return useMutation({
    mutationFn: (postData: EditPostData) => editPostRequest(postData),
    onError: (err: AxiosError) => {
      console.error(err);
      errorHandler(err);
    },
  });
};