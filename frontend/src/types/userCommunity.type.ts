import { CommunityT } from './community.type';

export type UserCommunityT = CommunityT & {
	isStarred: boolean;
};

export type GetUserCommunityResDTO = UserCommunityT[];
