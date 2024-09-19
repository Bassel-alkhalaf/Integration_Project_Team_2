export const userCommunityQueryKeys = {
	all: ['userCommunities'] as const,
	starred: () => [...userCommunityQueryKeys.all, 'starred'] as const,
};
