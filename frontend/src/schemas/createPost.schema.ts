import { z } from "zod";

export const createPostSchema = z.object({
    communityId: z.string().min(1, "Community is required"),
    title: z.string().min(1, "Post title is required").max(100, "Title must be 100 characters or less"),
    text: z.string().min(1, "Post text is required"),
    visibility: z.enum(["public", "private", "friends"]),
    images: z.array(z.string()).optional(),
  });
  
  // Infer types from schema
  export type CreatePostFormData = z.infer<typeof createPostSchema>;

