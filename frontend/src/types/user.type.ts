export enum Role {
	Guest = 'guest',
	User = 'user',
	Admin = 'admin',
}

export type UserInfoDTO = {
	id: string;
	firstname: string;
	lastname: string;
	dob: Date;
	gender: string;
	bio: string;
	profileImageUrl: string;
	role: string;
	createdAt: string;
};

export type UserInfoT = UserInfoDTO & {
	email: string;
};
