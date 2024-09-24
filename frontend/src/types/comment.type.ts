export interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}
