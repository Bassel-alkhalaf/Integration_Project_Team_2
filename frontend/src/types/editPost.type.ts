import { z } from 'zod';
import { editPostSchema } from '../schemas/editPost.schema';

export interface EditPostData {
        postId: string;
        title: string;
        text: string;
        images?: string[];
        updatedAt: Date;
}

export type EditPostFormData = z.infer<typeof editPostSchema>;