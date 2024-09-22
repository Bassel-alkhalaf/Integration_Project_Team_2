import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getUserCommunities } from '../../../api';
import { userCommunityQueryKeys } from '../../../consts';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useGetUserCommunities = (accessToken: string) => {
	const errorHandler = useGenericErrHandler();

	return useQuery({
		queryKey: userCommunityQueryKeys.all,
		queryFn: () =>
			getUserCommunities(accessToken)
				.then(res => res)
				.catch((err: AxiosError) => {
					console.error(err);
					errorHandler(err);
					return null;
				}),
		enabled: !!accessToken,
	});
};
