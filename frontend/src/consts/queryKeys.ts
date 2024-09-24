export const searchQueryKeys = {
	all: ['search'] as const,
	communities: () => [...searchQueryKeys.all, 'communities'] as const,
	users: () => [...searchQueryKeys.all, 'users'] as const,
	posts: () => [...searchQueryKeys.all, 'posts'] as const,
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

export const commentQueryKeys = {
	all: (postId: string) => ['comment', postId] as const,
};
