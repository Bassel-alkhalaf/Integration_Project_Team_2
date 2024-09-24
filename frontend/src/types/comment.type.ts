export interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
