export interface FriendRequest {
    friendRequestId: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    status: "Pending" | "Accepted" | "Denied" | "Canceled";
  }