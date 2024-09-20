export const searchQueryKeys = {
	all: ['search'] as const,
	communities: () => [...searchQueryKeys.all, 'communities'] as const,
	users: () => [...searchQueryKeys.all, 'users'] as const,
	posts: () => [...searchQueryKeys.all, 'posts'] as const,
};

export const userCommunityQueryKeys = {
	all: ['userCommunities'] as const,
	starred: () => [...userCommunityQueryKeys.all, 'starred'] as const,
};
