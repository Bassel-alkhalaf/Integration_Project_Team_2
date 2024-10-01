import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  CreatePostFormData,
} from "../schemas/createPost.schema";
import { Post } from "../types/post.type"; // Adjust the path if needed
import { UserCommunitySelect } from "./UserCommunitySelect";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCreatePost } from "../hooks";

interface PostCreationFormProps {
  open: boolean;
  onClose: () => void;
  authorName: string;
  authorId: string;
}

export const CreatePostDialog: React.FC<PostCreationFormProps> = ({
  authorName,
  authorId,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { mutate: createPost } = useCreatePost();

  const [communityId, setCommunityId] = useState<string>("");
   
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      text: "",
      visibility: "public",
      images: [],
    },
  });

  const images = watch("images");

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const imageUrls = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setValue("images", imageUrls);
    }
  };

  // Handle creating a new post
  const onSubmit = (data: CreatePostFormData) => {
    const postData: Post = {
      ...data,
      postId: "", 
      authorId: authorId,
      communityId,
      authorName: authorName,
      authorImg: "default-image-url", 
      createdAt: new Date(),
      updatedAt: undefined,
      commentCount: 0,
      likes: [],
      dislikes: [],
    };
    createPost(postData, {
      onSuccess: () => {
        enqueueSnackbar("Post created successfully!", {
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create a Post</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2} py={1}>
            {/* Community Select */}
            <UserCommunitySelect
              communityId={communityId}
              setCommunityId={setCommunityId}
            />
            {errors.communityId && <p>{errors.communityId.message}</p>}

            {/* Post Title */}
            <TextField
              label="Post Title"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Post Text */}
            <TextField
              label="Post text"
              fullWidth
              multiline
              {...register("text")}
              error={!!errors.text}
              helperText={errors.text?.message}
            />

            {/* Visibility Select */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="visibility-label">Visibility</InputLabel>
              <Select
                labelId="visibility-label"
                value={watch("visibility")}
                {...register("visibility")}
                label="Visibility"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="only-me">Only Me</MenuItem>
              </Select>
            </FormControl>

            {/* Image Upload */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-images"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-images">
              <IconButton
                color="primary"
                aria-label="upload pictures"
                component="span"
              >
                <UploadIcon />
              </IconButton>
            </label>

            {/* Preview Images */}
            {images?.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`uploaded-${idx}`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ))}
          </Stack>

          <DialogActions>
            <Button onClick={()=>{onClose();reset()}} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
