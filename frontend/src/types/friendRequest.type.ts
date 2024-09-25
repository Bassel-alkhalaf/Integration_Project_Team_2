export type FriendRequestT = {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	createdAt: string;
	status: 'Pending' | 'Accepted' | 'Rejected' | 'Canceled';
};

export type FriendRequestTypeT = 'sent' | 'received';
export type FriendRequestActionT = 'accept' | 'reject' | 'cancel';
