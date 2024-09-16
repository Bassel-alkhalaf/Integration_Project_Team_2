import { ref, set, get, update, push, remove, child } from 'firebase/database';
import { db } from './firebase'; // Realtime Database instance

export const friendService = {
  // Search for users based on an email or username
  searchUsers: async (searchQuery: string) => {
    const dbRef = ref(db, 'users');
    const snapshot = await get(child(dbRef, '/'));
    const users = snapshot.val();
    
    if (users) {
      return Object.entries(users)
        .filter(([key, user]) => (user as any).email.includes(searchQuery)) // Casting to `any` to avoid 'unknown' type
        .map(([uid, user]) => ({ uid, ...(user as object) })); // Casting to `object` before spreading
    }
    
    return [];
  },

  // Send a friend request
  sendFriendRequest: async (senderId: string, recipientId: string) => {
    const newRequestRef = push(ref(db, 'friendRequests'));
    await set(newRequestRef, {
      senderId,
      recipientId,
      status: 'pending',
    });
  },

  // Fetch friend requests sent by the current user
  getFriendRequests: async (userId: string) => {
    const snapshot = await get(ref(db, 'friendRequests'));
    const requests = snapshot.val();

    if (requests) {
      return Object.entries(requests)
        .filter(([id, request]) => (request as any).senderId === userId)
        .map(([id, request]) => ({ id, ...(request as object) })); // Casting to `object` before spreading
    }
    
    return [];
  },

  // Fetch incoming friend requests for the current user
  getIncomingFriendRequests: async (userId: string) => {
    const snapshot = await get(ref(db, 'friendRequests'));
    const requests = snapshot.val();

    if (requests) {
      return Object.entries(requests)
        .filter(([id, request]) => (request as any).recipientId === userId)
        .map(([id, request]) => ({ id, ...(request as object) })); // Casting to `object` before spreading
    }
    
    return [];
  },

  // Accept a friend request
  acceptFriendRequest: async (requestId: string) => {
    const requestRef = ref(db, `friendRequests/${requestId}`);
    await update(requestRef, { status: 'accepted' });
  },

  // Reject a friend request
  rejectFriendRequest: async (requestId: string) => {
    const requestRef = ref(db, `friendRequests/${requestId}`);
    await remove(requestRef); // Now `remove` is properly imported and used
  }
};
