export interface User {
    userId: string;
    username: string;
    email: string;
    bio?: string;
    profileImageUrl?: string;
    role: "Admin" | "User";
    createdAt: Date;
    followingUsers: string[];
    communitiesJoined: string[];
    postsCreated: string[];
    closeFriends: string[];
    friendRequests: string[];
  }