import { UserCommunityT } from '../types';

export const sortUserCommunities = (a: UserCommunityT, b: UserCommunityT) => {
	if (a.isStarred === b.isStarred) {
		return a.name.localeCompare(b.name);
	}
	return a.isStarred ? -1 : 1;
};
