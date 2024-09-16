import { ref, set, get, update, push, remove } from 'firebase/database';
import { db } from './firebase'; // Realtime Database instance

// Define interfaces for user profile and friend request
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: string;
  hobbies?: string;
  interests?: string;
  bio?: string;
}

interface FriendRequest {
  senderId: string;
  recipientId: string;
  status: string;
}

export const userService = {
  // Create or update a user profile in Realtime Database
  createUserProfile: async (
    userId: string,
    profileData: UserProfile
  ): Promise<void> => {
    try {
      await set(ref(db, `users/${userId}`), profileData);
      console.log('User profile created/updated successfully.');
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  },

  // Get a user's profile from Realtime Database
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const snapshot = await get(ref(db, `users/${userId}`));
      if (snapshot.exists()) {
        const userData = snapshot.val() as UserProfile;
        return userData;
      } else {
        console.log('User profile not found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update a user's profile in Realtime Database
  updateUserProfile: async (
    userId: string,
    updatedProfileData: Partial<UserProfile>
  ): Promise<void> => {
    try {
      await update(ref(db, `users/${userId}`), updatedProfileData);
      console.log('User profile updated successfully.');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Friend requests
  sendFriendRequest: async (senderId: string, recipientId: string): Promise<void> => {
    try {
      const newRequestRef = push(ref(db, 'friendRequests'));
      const friendRequest: FriendRequest = {
        senderId,
        recipientId,
        status: 'pending',
      };
      await set(newRequestRef, friendRequest);
      console.log('Friend request sent successfully.');
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  cancelFriendRequest: async (requestId: string): Promise<void> => {
    try {
      const requestRef = ref(db, `friendRequests/${requestId}`);
      await remove(requestRef);
      console.log('Friend request canceled successfully.');
    } catch (error) {
      console.error('Error canceling friend request:', error);
      throw error;
    }
  },

  acceptFriendRequest: async (requestId: string): Promise<void> => {
    try {
      const requestRef = ref(db, `friendRequests/${requestId}`);
      await update(requestRef, { status: 'accepted' });
      console.log('Friend request accepted successfully.');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  rejectFriendRequest: async (requestId: string): Promise<void> => {
    try {
      const requestRef = ref(db, `friendRequests/${requestId}`);
      await remove(requestRef);
      console.log('Friend request rejected successfully.');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  },

  // Search for users
  searchUsers: async (searchQuery: string): Promise<Array<{ uid: string } & UserProfile>> => {
    try {
      const dbRef = ref(db, 'users');
      const snapshot = await get(dbRef);
      const usersData = snapshot.val();

      if (usersData && typeof usersData === 'object') {
        const users = usersData as { [key: string]: UserProfile };
        return Object.entries(users)
          .filter(([_, user]) => user.email.includes(searchQuery))
          .map(([uid, user]) => ({ uid, ...user }));
      }
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get friend requests for the current user
  getFriendRequests: async (userId: string): Promise<Array<{ id: string } & FriendRequest>> => {
    try {
      const snapshot = await get(ref(db, 'friendRequests'));
      const requestsData = snapshot.val();

      if (requestsData && typeof requestsData === 'object') {
        const requests = requestsData as { [key: string]: FriendRequest };
        return Object.entries(requests)
          .filter(([_, request]) => request.recipientId === userId)
          .map(([id, request]) => ({ id, ...request }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      throw error;
    }
  },

  // Get the list of friends for the current user
  getFriendsList: async (userId: string): Promise<any> => {
    try {
      const dbRef = ref(db, `friends/${userId}`);
      const snapshot = await get(dbRef);
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching friends list:', error);
      throw error;
    }
  },

  // Add a user to the close friends list
  addCloseFriend: async (userId: string, friendId: string): Promise<void> => {
    try {
      await update(ref(db, `friends/${userId}/closeFriends`), {
        [friendId]: true,
      });
      console.log('Close friend added successfully.');
    } catch (error) {
      console.error('Error adding close friend:', error);
      throw error;
    }
  },

  // Remove a user from the close friends list
  removeCloseFriend: async (userId: string, friendId: string): Promise<void> => {
    try {
      await remove(ref(db, `friends/${userId}/closeFriends/${friendId}`));
      console.log('Close friend removed successfully.');
    } catch (error) {
      console.error('Error removing close friend:', error);
      throw error;
    }
  },
};
