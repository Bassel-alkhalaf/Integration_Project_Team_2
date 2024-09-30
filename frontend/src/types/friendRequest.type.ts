import { UserInfoT } from './user.type';

export type FriendRequestT = {
	id: string;
	createdAt: string;
	status: 'Pending' | 'Accepted' | 'Rejected' | 'Canceled';
	user: UserInfoT;
};

export type FriendRequestTypeT = 'sent' | 'received';
export type FriendRequestActionT = 'accept' | 'reject' | 'cancel';
