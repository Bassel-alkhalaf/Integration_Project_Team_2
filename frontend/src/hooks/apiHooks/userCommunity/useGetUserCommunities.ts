import { useQuery } from '@tanstack/react-query';
import { getUserCommunities } from '../../../api';
import { userCommunityQueryKeys } from '../../../consts';

export const useGetUserCommunities = (userId: string) => {
	return useQuery({
		queryKey: userCommunityQueryKeys.all,
		queryFn: () => getUserCommunities(userId),
	});
};
