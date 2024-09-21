export interface Post {
    postId: string;
    authorId: string;
    communityId?: string;
    text: string;
    images: string[];
    commentsCount: number;
    likesCount: number;
    createdAt: Date;
    updatedAt: Date;
    visibility: "Public" | "Private" | "Exclusive";
    comments: string[];
  }