import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CommunityT } from '../types';

export const useGetJoinedCommunities = (userId: string) => {
	return useQuery({
		queryKey: ['joinedCommunities', userId],
		enabled: false,
		queryFn: () =>
			axios
				.get<CommunityT[]>(`/api/UserCommunity/userId/${userId}`)
				.then(res => res.data)
				.catch(err => err),
	});
};
