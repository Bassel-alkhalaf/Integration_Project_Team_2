export const searchQueryKeys = {
	all: ['search'] as const,
	communities: (query: string) => [...searchQueryKeys.all, 'communities', query] as const,
	users: (query: string) => [...searchQueryKeys.all, 'users', query] as const,
	posts: (query: string) => [...searchQueryKeys.all, 'posts', query] as const,
};

export const userCommunityQueryKeys = {
	all: ['userCommunities'] as const,
	joined: () => [...userCommunityQueryKeys.all, 'joined'] as const,
	owned: () => [...userCommunityQueryKeys.all, 'owned'] as const,
};

export const communityQueryKeys = {
	all: ['communities'] as const,
	current: (communityId: string) => [...communityQueryKeys.all, 'current', communityId] as const,
};
