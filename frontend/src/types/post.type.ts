export interface Post {
  postId: string;
  authorId?: string;
  communityId: string;
  title: string;
  text: string;
  images?: string[];
  authorName: string;
  authorImg: string;
  createdAt: Date;
  updatedAt?: Date;
  commentCount: number;
  visibility: string;  // "public", "private", or "friends"
  likes: string[];
  dislikes: string[];
}


