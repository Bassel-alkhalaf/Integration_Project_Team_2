export type GetUserCommunityResDTO = (CommunityT & {
	isStarred: boolean;
})[];

export type CommunityT = {
	id: string;
	name: string;
	description: string;
	userCount: number;
	createdAt: string;
};
