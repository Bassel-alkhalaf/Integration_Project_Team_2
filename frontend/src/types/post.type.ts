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
    likeCount: number;
    dislikeCount: number;
    visibility: string;
  }