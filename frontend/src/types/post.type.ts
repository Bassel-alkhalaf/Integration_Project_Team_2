export interface Post {
    PostId: string;
    AuthorId: string,
    Title: string;
    Text: string;
    Images?: string[];
    AuthorName: string;
    AuthorImg: string;
    CreatedAt: Date;
    UpdatedAt?: Date;
    CommentCount: number;
    LikeCount: number;
    DislikeCount: number;
    Visibility: string;
  }