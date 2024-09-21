export interface Post {
    id: string;
    authorId: string,
    title: string;
    text: string;
    images?: string[];
    authorName: string;
    authorImg: string;
    createdAt: Date;
    updatedAt?: Date;
    commentCount: number;
    likeCount: number;
    visibility: 'public' | 'private' | 'friends';
  }