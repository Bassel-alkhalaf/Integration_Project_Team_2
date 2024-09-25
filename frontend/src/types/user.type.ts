// src/types/user.type.ts
export enum Role {
	Guest = 'guest',
	User = 'user',
	Admin = 'admin',
}

export type UserInfoDTO = {
	id: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender: string;
	bio: string;
	profileImageUrl: string;
	role: string;
	createdAt: string;

	email: string;
};

export type UserInfoT = UserInfoDTO & {
	email: string;
};
export interface UserUpdateDTO {
	firstName?: string;
	lastName?: string;
	dob?: string;  // Storing as string for input compatibility
	gender?: string;
	bio?: string;
	profileImageUrl?: string;

}

  
  