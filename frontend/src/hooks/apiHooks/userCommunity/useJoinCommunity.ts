import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { joinCommunity } from '../../../api';
import { useGenericErrHandler } from '../../errorHandler/useGenericErrHandler';

export const useJoinCommunity = (userId: string) => {
	const errorHandler = useGenericErrHandler();

	return useMutation({
		mutationFn: (communityId: string) => joinCommunity(userId, communityId),
		onError: err => {
			console.error(err);
			errorHandler(err as AxiosError);
		},
	});
};
